# To-Report-App

A React-based civic issue reporting application that allows users to document and track infrastructure problems in their community.

## Features

- User authentication (register/login)
- Report infrastructure issues with categories (Electricity, Water, Sewer, Roads, Traffic Lights, Illegal Dumping, Fallen Trees)
- Photo upload support
- GPS location capturing
- View submitte# PIRS — Public Infrastructure Reporting System

PIRS is a digital platform that allows citizens to report damaged and faulty public infrastructure and helps responsible teams identify, prioritize, and respond to issues faster.

## 🚨 The Problem

Public infrastructure problems such as faulty electricity infrastructure, damaged water pipes, blocked sewer systems, potholes, broken traffic lights, illegal dumping, and fallen trees can remain unresolved because reporting is often slow, fragmented, or difficult to track.

Citizens may know about a problem but have no simple way to report it with useful location information.

## 💡 Our Solution

PIRS provides a centralized reporting platform where citizens can submit infrastructure problems, attach photos, provide location information, and track the progress of their reports.

Authorities and responsible teams can use the system to view reports, prioritize urgent problems, and manage infrastructure issues more efficiently.

## ✨ Key Features

- 📍 Location-based infrastructure reporting
- 📸 Photo evidence for reported problems
- 🚨 Multiple infrastructure categories
- 📊 Authority dashboard and analytics
- ⭐ Smart report prioritization
- 🔄 Report status tracking
- 🔐 User authentication
- 📱 Mobile-friendly interface
- 🤖 AI-powered infrastructure knowledge capabilities
- 🗺️ Map-based infrastructure information

## 🏗️ Infrastructure Categories

PIRS currently supports:

- Electricity
- Water
- Sewer
- Roads
- Traffic Lights
- Illegal Dumping
- Fallen Trees
- Other Infrastructure Issues

## 🛠️ Technology Stack

- React
- Tailwind CSS
- Supabase
- JavaScript
- Leaflet / React Leaflet
- Sanity
- AI / Gemini
- Vercel

## 🌍 Vision

Our vision is to create a smarter infrastructure reporting network that connects citizens, authorities, and service providers so that infrastructure problems can be identified and resolved faster.

PIRS is starting with Zimbabwe, with the potential to expand to other African cities facing similar infrastructure challenges.

## 🚀 Live Application

https://public-infrastructure-reporting-sys.vercel.app/

## 👨‍💻 Founder

Built by Layton Tozvireva.

PIRS was created to explore how technology can make it easier for citizens to report real-world infrastructure problems and help responsible teams respond more effectively.d reports

## Tech Stack

- **React 19** - UI framework
- **React Router DOM 7** - Routing
- **Tailwind CSS** - Styling
- **Supabase** - Backend and authentication
- **Leaflet / React-Leaflet** - Maps
- **Lucide React** - Icons
- **Axios** - HTTP client

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
  components/
    Navbar.js
    Footer.js
  context/
    AuthContext.js
  pages/
    Home.js
    Login.js
    Register.js
    ReportIssue.js
    MyReports.js
  services/
    api.js
  App.js
  index.css
```

## License

Private