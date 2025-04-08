## SkillSwap - Service Exchange Platform
SkillSwap is a modern service exchange platform built with Next.js and TypeScript that enables users to offer their skills and services for monetary payment or reciprocal support.

![Screenshot 2025-04-02 165253](https://github.com/user-attachments/assets/7913768d-de12-4ed7-83d2-ebc68c65428a)


# Features
🔍 Service Marketplace

Browse and search services by category, price range, and payment type
Detailed service cards with provider ratings and information
Advanced filtering system for refined service discovery

## 💸 Secure Escrow Payment System

Payments are securely held in escrow until service completion
Service providers can confirm completion to release funds
Comprehensive transaction history tracking
Multiple payment method options (credit/debit, PayPal, bank transfer)

## 📢 Community Alerts

Public alerts board for urgent service needs
Time-limited posts with automatic expiration
Quick response functionality

## 👤 User Management

User profiles with ratings and service history
Dashboard for managing offered services
Separate views for buyers and sellers

## 🛠️ Service Management

Create, edit, and manage service listings
Track service status (Available, In Progress, Completed)
Support for both monetary and exchange-based services

## Technology Stack

Frontend: Next.js 13+ with App Router
Language: TypeScript
Styling: Tailwind CSS
Icons: Lucide React
State Management: React Hooks

Getting Started
Prerequisites

Node.js 18.0 or higher
npm or yarn

## Installation

# Clone the repository

bashgit clone https://github.com/yourusername/skillswap.git
cd skillswap

Install dependencies

bashnpm install
# or
yarn install

Run the development server

bashnpm run dev
# or
yarn dev

Open http://localhost:3000 in your browser to see the application.

## Project Structure

app/page.tsx - Main application component containing all functionality
Types and interfaces defined at the top of the file
Mock data for demonstration purposes

## Key Components

Discover Tab: Browse available services
Alerts Tab: Community alerts board
My Services Tab: Manage your service offerings
Transactions Tab: Track service payments and completions
Escrow Payment System: Secure payment processing workflow

## Future Enhancements

Backend integration with database
User authentication and authorization
Real payment processing integration
Messaging system between users
Rating and review system
Search optimization

## Acknowledgments

Design inspired by modern marketplace platforms like Airbnb
Images sourced from Unsplash (for demonstration purposes)
