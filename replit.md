# MOTHERGRID Healthcare Insurance Platform

## Overview

MOTHERGRID is a Web3-powered healthcare insurance platform designed to transparently track a mother's maternity journey through blockchain technology. The application provides a comprehensive dashboard for managing prenatal care, insurance claims, appointments, and smart contract interactions. It combines modern healthcare management with blockchain transparency to create an accessible, fraud-resistant system for maternal healthcare insurance.

The platform serves as a visual claim lifecycle management system that logs medical events as smart contract transactions, automates insurance processes, and provides users with real-time visibility into their healthcare journey through an intuitive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Voice Assistant Integration (August 1, 2025)
- Added voice-activated assistant component using Web Speech API
- Supports voice commands for claim submission, policy viewing, and status inquiries
- Includes text-to-speech responses for accessibility
- Designed specifically for users with varying literacy levels
- Integrated with existing dashboard functionality and claim submission system

### Dashboard Components Update (August 1, 2025)
- Replaced scheduled appointments with pregnancy milestone tracker
- Replaced smart contract activity with healthcare provider directory
- Added comprehensive pregnancy journey visualization with trimester progress
- Integrated in-network provider finder with booking capabilities
- Enhanced maternal care focus with relevant healthcare features

## System Architecture

### Frontend Architecture
The application uses a modern React-based frontend with TypeScript, built using Vite for fast development and optimized production builds. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable interface elements. Styling is handled through Tailwind CSS with a healthcare-focused color scheme including custom CSS variables for consistent theming.

The frontend follows a component-based architecture with reusable UI components, custom hooks for mobile responsiveness, and React Query for efficient data fetching and state management. The routing is handled by Wouter, a lightweight alternative to React Router.

### Backend Architecture
The server runs on Express.js with TypeScript, implementing a RESTful API architecture. The backend serves both the API endpoints and static assets in production. Development includes Vite integration for hot module replacement and enhanced developer experience.

The application uses an in-memory storage implementation (MemStorage class) that implements a complete interface for data persistence, making it easy to swap for a database solution later. The storage layer handles users, policies, claims, appointments, and smart contract transactions.

### Database Schema Design
The schema is defined using Drizzle ORM with PostgreSQL dialect, featuring five main entity tables:

- **Users**: Stores user profiles including pregnancy-specific information like due dates and pregnancy week
- **Policies**: Manages insurance policy details with coverage amounts, deductibles, and usage tracking
- **Claims**: Handles insurance claims with status tracking, document storage via JSONB, and provider information
- **Smart Contract Transactions**: Records blockchain interactions with transaction hashes and metadata
- **Appointments**: Manages medical appointments with scheduling and status tracking

All tables use UUID primary keys and include proper foreign key relationships. The schema supports the complete claim lifecycle from submission through payment.

### State Management and Data Flow
The application uses TanStack React Query for server state management, providing caching, background updates, and optimistic updates. The query client is configured with custom error handling and request utilities that include proper error throwing and JSON response handling.

Data flows from the Express API through React Query to React components, with proper loading and error states handled throughout the application. The dashboard aggregates data from multiple entities to provide comprehensive user statistics and timeline views.

### UI Component System
The interface is built on a design system using shadcn/ui components with Tailwind CSS. Components include comprehensive form controls, data display elements, navigation components, and specialized healthcare-focused components like claim timelines and smart contract activity displays.

The system includes responsive design patterns with mobile-first approach, including a dedicated mobile bottom navigation for smaller screens. Custom hooks handle mobile detection and responsive behavior.

## External Dependencies

### Blockchain Integration
- **@neondatabase/serverless**: PostgreSQL database connection for production deployments
- **Drizzle ORM**: Type-safe database interactions with PostgreSQL dialect
- The architecture is prepared for smart contract integration, with transaction tracking built into the data model

### UI and Design System
- **@radix-ui/***: Comprehensive set of accessible UI primitives for building the component system
- **Tailwind CSS**: Utility-first CSS framework for styling with custom healthcare color scheme
- **class-variance-authority**: Component variant management for consistent UI patterns
- **Lucide React**: Icon library for consistent iconography

### Data Management
- **@tanstack/react-query**: Server state management with caching and background updates
- **React Hook Form with @hookform/resolvers**: Form management with validation
- **Zod integration**: Schema validation for forms and API data

### Development and Build Tools
- **Vite**: Fast build tool and development server with React plugin
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds

### Additional Features
- **date-fns**: Date manipulation and formatting utilities
- **Wouter**: Lightweight client-side routing
- **connect-pg-simple**: PostgreSQL session store for production deployments

The platform is architected to be extensible, with clear separation between the current in-memory storage and future database implementations, making it straightforward to integrate additional blockchain networks, payment processors, or healthcare provider APIs as the system scales.