# Food Donation Management System

A role-based full-stack web application designed to manage food donations and connect **Donors, Receivers, and Admins** through a structured donation lifecycle.

## 📌 Overview

The Food Donation Management System provides a centralized platform for creating, managing, tracking, and receiving food donations. The application uses role-based access control to provide different workflows for Donors, Receivers, and Admins.

The system tracks donations through multiple states, from **Available** to **Expired**, and provides secure authentication and authorization for protected operations.

## ✨ Features

### 👤 Donor
- Register and log in securely
- Create food donation records
- View and manage submitted donations
- Track donation status
- Update donation details when permitted

### 🤝 Receiver
- View available food donations
- Receive/request available food
- Track received donations
- View donation status and history

### 🛡️ Admin
- Manage users and donation activities
- Monitor donation workflows
- Manage application data and access

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Protected routes and APIs
- Separate access for Donor, Receiver, and Admin workflows

## 🔄 Donation Workflow

The application manages the donation lifecycle through multiple states:

**Available → Requested → Accepted → Received → Completed / Expired**

This workflow helps users track the current status of each food donation.

## 🛠️ Technology Stack

### Frontend
- React.js
- Tailwind CSS
- JavaScript

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication

### Database
- MySQL

### Tools
- Git
- GitHub
- Visual Studio Code

## 🏗️ Application Architecture

```text
                    Food Donation Management System
                                |
             +------------------+------------------+
             |                  |                  |
          Donor              Receiver            Admin
             |                  |                  |
             +------------------+------------------+
                                |
                         React.js Frontend
                                |
                           REST APIs
                                |
                       Node.js + Express.js
                                |
                         JWT / RBAC
                                |
                             MySQL
```

## 📂 Main Modules

- Authentication & Authorization
- Donor Dashboard
- Receiver Dashboard
- Admin Dashboard
- Food Donation Management
- Donation Status Tracking
- User Management
- Protected API Routes
- Database Operations

## 🗄️ Database

The application uses MySQL for storing and managing application data such as:

- Users
- Food Donations
- Donation Status
- Requests/Receipts
- User Roles
- Related transaction and tracking information

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

Navigate to the backend folder and run:

```bash
npm install
```

### 4. Configure the database

Create a MySQL database and configure the database connection in the backend environment/configuration.

Example environment variables:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=food_donation
JWT_SECRET=your_secret_key
```

### 5. Start the backend

```bash
npm start
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local development URL shown by Vite in your browser.

## 🔒 Security

- JWT-based authentication
- Role-based authorization
- Protected backend routes
- Input/data validation
- Controlled access to user-specific operations

## 🎯 Project Objective

The goal of this project is to provide a structured digital platform for managing food donations, improving coordination between donors and receivers, and making the donation process easier to track and manage.

## 👩‍💻 Developed By

**Vaishnavi Sangolkar**

Computer Science Engineering Graduate

**Technologies:** React.js | Node.js | Express.js | MySQL | Tailwind CSS | JWT
