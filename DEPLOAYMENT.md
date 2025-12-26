# Hosting & Deployment Guide

To host the **Student Success Navigator** as a public website, you need to deploy the Frontend and Backend separately.

## 1. Frontend (React + Vite)
The frontend should be deployed to a provider that specializes in "Static Site Hosting".

- **Recommended Platforms**: [Vercel](https://vercel.com), [Netlify](https://netlify.com), or [GitHub Pages](https://pages.github.com).
- **Steps**:
    1. Update `axios.post('http://localhost:8000')` calls to your public backend URL (see below).
    2. Run `npm run build` in the `frontend` folder.
    3. Upload the resulting `dist` folder to your provider. Or, connect your GitHub repository for automatic deployment.

## 2. Backend (FastAPI + Python)
The backend needs a "Web Service" host that can run Python.

- **Recommended Platforms**: [Render.com](https://render.com), [Railway.app](https://railway.app), or [Koyeb](https://koyeb.com).
- **Steps**:
    1. Create a `Procfile` or use the command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
    2. Ensure `requirements.txt` is updated.
    3. Connect your GitHub repository.
    4. **Environment Variables**: Add your `SECRET_KEY` and other sensitive data in the provider's dashboard.

## 3. Database
- **Current**: Using `database.db` (SQLite).
- **Production Recommendation**: 
    - If using **Render** or **Railway**, they offer a "Persistent Disk" where you can keep the `.db` file.
    - Alternatively, switch to a managed **PostgreSQL** database (supported by SQLModel) for better scalability.

## 4. Environment Configuration
You should create a `.env` file to manage URLs dynamically:
- In Frontend: Use `VITE_API_URL`.
- In Backend: Use `ALLOWED_ORIGINS` to allow your public frontend domain to talk to the backend (CORS).

---

### Do you want me to help you prepare the files?
I can:
1. Create a **Dockerfile** for a one-click deployment.
2. Update the code to use **Environment Variables** instead of `localhost`.
3. Create a **GitHub Action** to automate the whole process.
