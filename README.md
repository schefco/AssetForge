------------------------
AssetForge
------------------------

Full‑Stack Ticketing and Asset Management System

AssetForge is a full‑stack IT service management platform built with .NET 10, ASP.NET Core Web API, Entity Framework Core, SQL Server, React, TypeScript, Zustand, and TailwindCSS.

It demonstrates production‑grade engineering patterns including authentication, role‑based access control, ticket workflows, and a modern dashboard UI.

---------------------------------------
Features
---------------------------------------

Authentication and Authorization
• Secure JWT authentication
• Refresh token rotation
• Role‑based access control (Admin, Technician, User)
• Protected API endpoints and protected frontend routes

Ticketing System
• Create, view, and manage tickets
• Slide‑over ticket detail panel
• Julian‑date ticket numbering (Year + Julian Day + Sequence)
• Example: TKT25029‑0001
• Optional custom prefixes (up to 5 characters)
• Technician assignment workflow
• User‑specific ticket views

Frontend (React + TypeScript)
• Zustand global state management
• Axios interceptors for token refresh
• Responsive dashboard layout
• Reusable components (modals, slide‑overs, tables)
• Strong TypeScript models for all DTOs

Backend (ASP.NET Core)
• Clean architecture with Services, DTOs, and AutoMapper
• Entity Framework Core with SQL Server
• Query endpoints for pagination and filtering
• Secure password hashing and refresh token storage

--------------------------------------------
Tech Stack
--------------------------------------------

Frontend
• React 18
• TypeScript
• Zustand
• Axios
• TailwindCSS
• Vite

Backend
• .NET 10
• ASP.NET Core Web API
• Entity Framework Core
• SQL Server or SQLite
• AutoMapper

Project Structure

AssetForge/
AssetForge.API/
AssetForge.Application/
AssetForge.Infrastructure/
assetforge-frontend/
README.md

-----------------------------------------------
Running the Project
-----------------------------------------------

##### Backend #####

cd AssetForge.API
dotnet ef database update
dotnet run

###### Frontend #####

cd assetforge-frontend
npm install
npm run dev

##### Creating the First Admin User #####

AssetForge does not seed an admin account by default. When the system is first launched and the database contains no users, the frontend automatically redirects to a Create First Admin page.

To create the initial administrator:
1. 	Run the backend API
2. 	Run the frontend application
3. 	The application will detect that no users exist and display the Create First Admin form
4. 	Enter your name, email, and password
5. 	Submit the form to create the first Admin account
6. 	You will be redirected to the login page and can sign in using the credentials you just created

After the first user is created, only Admin users can create additional accounts or assign elevated roles.

Once created, you can log in using this account and begin managing users and tickets.

-------------------------------------------------
Future Enhancements
• Ticket comments and activity logs
• Asset inventory module
• Technician performance metrics
• Email notifications
• Dark mode
-------------------------------------------------