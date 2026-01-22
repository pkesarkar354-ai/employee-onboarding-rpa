# Employee Onboarding Automation (AWS Lambda + UiPath RPA)

## 📌 Overview
This project implements an end-to-end employee onboarding automation using **AWS Lambda** and **UiPath RPA**.

The solution fetches employee data from a public API, prioritizes employees based on salary, processes high-priority employees via web automation, generates QR codes, creates an Excel onboarding report, and sends an email notification with attachments.

## 🏗️ Architecture & Flow

1. **AWS Lambda (Node.js)**
   - Fetches employee data from a public REST API
   - Applies priority rules based on salary
   - Pushes employee records into a UiPath Orchestrator Queue

2. **UiPath Orchestrator**
   - Stores employees in a queue (`New_Hires`)
   - Manages transaction lifecycle (New, In Progress, Successful, Failed)

3. **UiPath Automation**
   - Reads queue items
   - Processes only **High Priority** employees
   - Automates web data entry on `https://rpachallenge.com`
   - Generates QR codes for IT assets
   - Creates Excel report and ZIP archive
   - Sends email notification with attachments

## 🧮 Priority Rules

| Priority | Rule |
|--------|------|
| High | Salary > 300,000 |
| Normal | Salary between 100,000 and 300,000 |
| Low | Salary < 100,000 |

Only **High Priority** employees are processed for onboarding.

## 🛠️ Technologies Used

- **AWS Lambda** (Node.js)
- **UiPath Studio 2026**
- **UiPath Orchestrator Queues**
- **Web Automation (Modern UI)**
- **HTTP Request (QR Code API)**
- **Excel Automation**
- **PowerShell (ZIP creation)**
- **SMTP Email (Gmail)**

---

## 📂 Repository Structure

