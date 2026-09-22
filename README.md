# Supervisor Management System

Multi-step web application for supervisor registration with document upload and application tracking.

## Features
- Multi-step registration wizard (Personal Details → Education → Employment → Research → Documents → Review)
- Authentication system (Login/Register)
- Dashboard for tracking application status
- PDF generation for submitted applications
- File upload handling (photos, documents, signatures)

## Tech Stack
- ASP.NET Core MVC (.NET 8)
- Entity Framework Core
- SQL Server
- Services layer with dependency injection (SupervisorService, PdfService, FileUploadService)
- Bootstrap 5, jQuery
