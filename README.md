# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Production Deployment

The application is deployed in a decoupled architecture:
- **Frontend (Vercel)**: Built with React/Vite. The production URL is [https://chatbot-mocha-six-11.vercel.app](https://chatbot-mocha-six-11.vercel.app).
- **Backend (Render)**: Built with Node/Express. The production API URL is [https://chatbot-f3rk.onrender.com](https://chatbot-f3rk.onrender.com).
- **Database (MongoDB Atlas)**: Used for persistent data.

### Configuration
- The frontend communicates with the backend using the centralized `VITE_API_URL` environment variable.
- Vercel builds the frontend using `npm run build` from the `frontend` root directory.
- Render starts the backend using `node server.js` from the `backend` root directory.
- All secrets (API keys, passwords, JWT secrets, MongoDB credentials) are kept securely in environment variables on the respective platforms and are strictly excluded from version control.
