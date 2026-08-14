# To-Report-App

A React-based civic issue reporting application that allows users to document and track infrastructure problems in their community.

## Features

- User authentication (register/login)
- Report infrastructure issues with categories (Electricity, Water, Sewer, Roads, Traffic Lights, Illegal Dumping, Fallen Trees)
- Photo upload support
- GPS location capturing
- View submitted reports

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