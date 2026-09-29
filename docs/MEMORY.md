# Project Memory

## Important Technical Decisions
- **MERN Stack**: The project was designed as a decoupled React frontend and Node/Express backend to ensure clear separation of concerns.
- **MongoDB Persistence**: Mongoose schemas are used to map users to their conversation threads, and conversation threads to their specific message histories.
- **HttpOnly JWT**: To mitigate XSS attacks, session tokens are delivered via HttpOnly cookies rather than local storage. The frontend relies on `/api/auth/me` to hydrate session state on refresh.
- **Gemini Proxy**: To secure billing and quotas, the frontend is forbidden from calling Google Gemini directly. The backend uses a dedicated `geminiService` to broker these requests.
- **Public Chat Fallback**: To allow quick trials of the platform, the frontend falls back to a public chat endpoint (`/api/chat/public`) when the `user` context is null. This endpoint purposely bypasses database persistence.
- **Vite API Proxy**: In development mode, the Vite server running on port 5174 dynamically proxies all `/api/*` traffic to the backend Express server running on port 5001. 

## Important File Locations
- **`frontend/src/context/UserContext.jsx`**: Central nerve center for the chat. Handles sending messages, swapping between active conversations, checking auth states, and safely parsing backend responses.
- **`frontend/src/components/chatSection/ChatSection.jsx`**: The core UI rendering engine for the chat. Houses the `ReactMarkdown` configuration and the syntax highlighter.
- **`backend/server.js`**: Express bootstrapping file.
- **`backend/services/geminiService.js`**: Houses the actual SDK integration and prompt tuning for the AI model (`gemini-robotics-er-2-preview`).

## Important Constraints
- **Gemini Key**: The `.env` environment variable `GEMINI_API_KEY` must remain exclusively on the Node server.
- **Unauthenticated Database Integrity**: Unauthenticated public chats must not attempt to execute `Conversation.save()` or `Message.save()`, as they lack an authenticating `req.user.userId`.
- **Admin Restrictions**: The `requireAdmin` middleware must always precede admin controllers in backend routes.
- **HTML Fallbacks**: By default, Express returns HTML for 404s. The frontend `fetch` wrappers must preemptively verify `content-type` headers before executing `.json()` to prevent token parsing crashes.

## Known Implementation Notes
- CSS Theme application works by attaching either `.lightmode` or `.darkmode` classes high up in the DOM, allowing components to organically inherit CSS variables like `--background-color` or `--color`.
- Sidebar resizing is implemented natively using standard pointer events (`onPointerDown`, `onPointerMove`) rather than external draggable libraries.

## Future Context
When continuing the project, remember that `UserContext` acts as a heavy controller for frontend network requests. When altering how chat messages are sent or retrieved, refer there first. If backend APIs fail to hot-reload in development, remember that the `package.json` relies on `node server.js` (not `nodemon`), meaning manual process restarts are required to see backend changes.

## Production Deployment & Debugging Record
1. **Render Deployment**: Initiated backend deployment on Render using `node server.js`.
2. **MongoDB Atlas Network Issue**: Encountered database connection timeouts on Render. Resolved by allowlisting Render's specific outbound IP ranges (`74.220.48.0/24`, `74.220.56.0/24`) in MongoDB Atlas.
3. **MongoDB Connection Success**: Verified successful persistent data connection from the Render backend.
4. **Vercel Frontend Deployment**: Initiated frontend deployment on Vercel (`npm run build`).
5. **FRONTEND_URL Configuration**: Configured Render backend with the Vercel production URL to correctly handle CORS. Frontend `VITE_API_URL` was pointed to the Render API.
6. **Production Auth Debugging**: Guest chat worked, but authenticated chat failed with a 401 "No token provided" error after successful login. (Previous commit `fe0a65c` fixed the guest auth state handling).
7. **Cross-Origin Cookie Root Cause**: Found that frontend `fetch` requests for login/register lacked `credentials: 'include'`. As a result, the browser rejected storing the cross-origin authentication cookie issued by the Render backend (which correctly used `secure: true` and `sameSite: 'none'`).
8. **Final Fix**: Added `credentials: 'include'` to the `login` and `register` functions in `frontend/src/context/AuthContext.jsx`. The `UserContext.jsx` was previously hardened to properly fall back to guest chat if no valid user ID was present.
9. **Final Deployment**: Auth fix pushed in commit `155be38` ("fix: include credentials for production auth"). Authenticated chat and guest chat are fully operational locally and in production.
