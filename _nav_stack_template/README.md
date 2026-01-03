# The Navigator Stack (Template)

**This is your bare-metal starting point for building AI-Driven Companion Apps.**
(e.g., Patient Portal, Employee Success, Client Dashboard)

## How to Start a New App

1.  **Move this folder:** Copy the contents of this folder to a new location (e.g., `C:\Projects\MyNewApp`).
2.  **Rename:** Update `package.json` and `capacitor.config.json` with your new App Name (e.g., "HealthNav").
3.  **Install:**
    *   `cd frontend && npm install`
    *   `cd backend && pip install -r requirements.txt`
4.  **Run:** `npm run dev` (starts both frontend and backend).

## Structure
*   **/backend**: FastAPI "Nexus" core. Pre-wired for Vercel.
*   **/frontend**: React/Vite "Glass" Shell. Pre-wired with Glassmorphism UI.
*   **/fastlane**: The "Mobile Factory". Pre-wired for One-Click iOS Release.

## Customization
*   **Theme:** Edit `frontend/src/index.css`.
*   **Data Models:** Edit `backend/models.py` (Swap 'Student' for 'Patient/User').
*   **Signals:** Edit `backend/api.py` to define your custom Alerts/Holds.
