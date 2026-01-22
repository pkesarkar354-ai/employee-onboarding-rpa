const axios = require("axios");

const EMP_API = "https://dummy.restapiexample.com/api/v1/employees";
const TOKEN_URL = "https://cloud.uipath.com/identity_/connect/token";

exports.handler = async () => {
  try {
    // 1. Fetch employees
    const empResponse = await axios.get(EMP_API);
    const employees = empResponse.data.data;

    // 2. Get UiPath access token
    const tokenResponse = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.UIPATH_CLIENT_ID,
        client_secret: process.env.UIPATH_CLIENT_SECRET,
        scope: "OR.Queues"
      })
    );

    const accessToken = tokenResponse.data.access_token;

    const queueUrl = `https://cloud.uipath.com/${process.env.UIPATH_ORG}/${process.env.UIPATH_TENANT}/orchestrator_/odata/Queues/UiPathODataSvc.AddQueueItem`;

    // 3. Push employees to queue
    for (const emp of employees) {
      const salary = Number(emp.employee_salary);

      let priority = "Low";
      if (salary > 300000) priority = "High";
      else if (salary >= 100000) priority = "Normal";

      const payload = {
        itemData: {
          Name: "New_Hires",
          Priority: priority,
          SpecificContent: {
            EmployeeID: emp.id,
            EmployeeName: emp.employee_name,
            Salary: salary,
            Age: emp.employee_age
          }
        }
      };

      try {
        const response = await axios.post(queueUrl, payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-UIPATH-OrganizationUnitId": process.env.UIPATH_FOLDER_ID,
            "X-UIPATH-FolderPath": "LambdaQueueFolder",
            "Content-Type": "application/json"
          }
        });

        console.log(`SUCCESS → Queue item added for EmployeeID ${emp.id}`);
      } catch (queueErr) {
        console.error(
          `FAILED → EmployeeID ${emp.id}`,
          queueErr.response?.status,
          queueErr.response?.data || queueErr.message
        );
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Queue push attempt completed",
        totalEmployees: employees.length
      })
    };
  } catch (err) {
    console.error("FATAL ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify(err.message)
    };
  }
};
