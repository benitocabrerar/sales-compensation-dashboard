# Sales Compensation Dashboard Pro

A full-stack web application for analyzing sales compensation plans with advanced analytics, scenario planning, and financial projections.

## Features

- **Real-time Calculations**: Instant updates to all metrics as you adjust parameters
- **Scenario Management**: Save, load, and compare different compensation scenarios
- **Advanced Analytics**: NPV, IRR, ROI, sensitivity analysis
- **Data Export**: Export analysis results to CSV
- **Alert System**: Get warnings when compensation structure needs adjustment
- **Offline Support**: Works with or without internet connection
- **Backend Persistence**: Save data to server for team collaboration

## Tech Stack

### Backend
- **Node.js** with Express.js
- **File-based storage** (JSON)
- **CORS** enabled for local development
- **REST API** endpoints

### Frontend
- **React 18** with hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API calls

## Project Structure

```
ventas/
├── backend/
│   ├── server.js           # Express server with REST API
│   ├── package.json        # Backend dependencies
│   └── data/               # Data storage (auto-created)
│       ├── scenarios.json  # Saved scenarios
│       └── config.json     # Configuration
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Tailwind CSS
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
├── start-backend.bat       # Start backend only
├── start-frontend.bat      # Start frontend only
├── start-all.bat           # Start both servers
└── README.md               # This file
```

## Installation

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

### Quick Start

1. **Clone or navigate to the project directory**
   ```bash
   cd C:\Users\benito\poweria\ventas
   ```

2. **Start the full application**

   Double-click `start-all.bat` or run:
   ```bash
   start-all.bat
   ```

   This will:
   - Install all dependencies for both backend and frontend
   - Start the backend server on http://localhost:3001
   - Start the frontend development server on http://localhost:3000
   - Open two terminal windows for server logs

3. **Access the application**

   Open your browser and go to: **http://localhost:3000**

### Alternative: Start Servers Separately

**Backend only:**
```bash
start-backend.bat
```
Backend will run on http://localhost:3001

**Frontend only:**
```bash
start-frontend.bat
```
Frontend will run on http://localhost:3000

### Manual Installation

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

The backend server provides the following REST API endpoints:

- `GET /api/health` - Health check
- `GET /api/config` - Get current configuration
- `POST /api/config` - Save configuration
- `GET /api/scenarios` - Get all saved scenarios
- `POST /api/scenarios` - Create new scenario
- `GET /api/scenarios/:id` - Get specific scenario
- `PUT /api/scenarios/:id` - Update scenario
- `DELETE /api/scenarios/:id` - Delete scenario
- `POST /api/calculate` - Calculate metrics
- `POST /api/export/csv` - Export data to CSV

## Usage Guide

### 1. Setting Up Salesperson Information
- Enter the salesperson's name in the input field at the top

### 2. Adjusting Parameters
Use the sliders to adjust:
- **L** (Leads): Number of leads per month
- **pL** (Price per Lead): Payment per lead
- **c** (Conversion Rate): Percentage of leads that convert to sales
- **V** (Average Ticket): Average sale value
- **r** (Commission Rate): Commission percentage on sales
- **B** (Monthly Bonus): Fixed monthly bonus
- **b** (Base Salary): Minimum guaranteed monthly payment
- **gm** (Gross Margin): Profit margin on sales
- **h** (Variable Overhead): Operating costs as % of sales
- **M** (Fixed Overhead): Fixed monthly costs
- **α** (Alpha Cap): Maximum compensation as % of gross margin

### 3. Viewing Results
The dashboard displays:
- Monthly and annual sales figures
- Salesperson compensation breakdown
- Company profit metrics
- ROI and margin percentages
- Break-even analysis
- Financial projections (NPV, IRR)

### 4. Working with Scenarios
- Click **"💾 Save Scenario"** to save current configuration
- Load saved scenarios to compare different compensation plans
- Delete scenarios you no longer need

### 5. Exporting Data
- Click **"📊 Export CSV"** to download analysis results
- CSV includes all key metrics and can be opened in Excel

### 6. Understanding Alerts
The system will alert you when:
- ⚠️ Base salary threshold is not met
- ⚠️ Compensation exceeds cap limit
- ⚠️ Company is operating at a loss
- ℹ️ ROI is below 50%

## Offline Mode

If the backend server is not running, the application automatically switches to offline mode using localStorage. You'll see a yellow indicator: **"🟡 Offline Mode"**

In offline mode:
- All calculations work normally
- Scenarios are saved locally in your browser
- Data persists across sessions
- CSV export still works

## Troubleshooting

### Port Already in Use
If you get an error that port 3000 or 3001 is already in use:
1. Close any other applications using these ports
2. Or modify the ports in:
   - Backend: `backend/server.js` (line 7)
   - Frontend: `frontend/vite.config.js` (line 6)

### Backend Connection Failed
- Check that the backend server is running
- Verify the backend URL in `frontend/src/App.jsx` (line 5)
- The app will automatically use offline mode if backend is unavailable

### Dependencies Installation Failed
- Make sure you have Node.js installed
- Try deleting `node_modules` folders and running `npm install` again
- Check your internet connection

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with hot reload
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```
This creates optimized files in `frontend/dist/`

## Data Storage

All data is stored in:
- **Backend**: `backend/data/` directory
  - `scenarios.json` - Saved scenarios
  - `config.json` - Current configuration
- **Frontend fallback**: Browser localStorage

## License

MIT License

## Support

For issues or questions, please check:
- The application alerts system (⚠️ icon)
- Backend server logs (terminal window)
- Frontend console (F12 in browser)

---

**Made with ❤️ for sales team optimization**
