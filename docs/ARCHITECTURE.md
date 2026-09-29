# Architecture

## 1. System Overview

The application follows a standard MERN stack architecture with a distinct separation between client and server logic. 

Browser (React/Vite) 
  → HTTP Requests
  → Express API Backend
  → Controllers (Auth, Chat, Admin)
  → Services (Gemini Service)
  → External Systems (MongoDB for storage, Google Gemini API for AI processing)

## 2. Repository Structure

- `frontend/`: The React client built with Vite.
  - `src/components/`: Reusable UI elements (`Sidebar`, `ChatSection`, `Darkmode`, `seperation`).
  - `src/context/`: Global state management (`AuthContext`, `UserContext`).
  - `src/pages/`: Top-level route components (`Login`, `Register`, `Admin`).
- `backend/`: The Node.js/Express server.
  - `config/`: Database connections (`db.js`).
  - `controllers/`: Request handlers (`authController`, `conversationController`).
  - `middlewares/`: Authorization (`authMiddleware.js`).
  - `models/`: Mongoose schemas.
  - `routes/`: API endpoint definitions.
  - `services/`: Third-party integration (`geminiService.js`).
- `docs/`: Technical and project documentation.

## 3. Frontend Architecture

- **App.jsx**: The main entry point managing routing using `react-router-dom`. Uses custom wrapper components (`ProtectedRoute`, `PublicRoute`, `AdminRoute`) for client-side access control.
- **Contexts**:
  - `AuthContext.jsx`: Manages the current authenticated user session, logging in, registering, and logging out.
  - `UserContext.jsx`: Manages the active chat state, sending messages, and handling both authenticated database persistence and unauthenticated public chat calls.
- **Components**: The UI heavily relies on `Sidebar.jsx` for navigation and `ChatSection.jsx` for rendering the actual message thread (including Markdown parsing with `react-markdown`).
- **State Management**: Handled entirely by React Context (`useState` / `useEffect`).
- **Theme Handling**: Managed via a global `index.css` applying `.lightmode` and `.darkmode` classes to the `<body>` element.

## 4. Backend Architecture

- **server.js**: The entry point, setting up Express, CORS, cookie parsers, and binding route modules to `/api/...`.
- **routes/**: Modular routers grouping endpoints (e.g., `chatRoutes`, `conversationRoutes`, `authRoutes`, `adminRoutes`).
- **controllers/**: Contains the business logic resolving route requests, reading/writing to the database, and responding with JSON.
- **middlewares/**: Intercepts requests to enforce security (e.g., `authenticateUser` parses the JWT; `requireAdmin` checks role claims).
- **services/**: Abstracted external dependencies, primarily `geminiService.js` for handling the Google Generative AI logic.

## 5. Authentication Flow

1. **Register**: User submits details `→` Backend hashes password with bcrypt `→` User is saved.
2. **Login**: User submits credentials `→` Backend compares hash `→` Issues JWT.
3. **Session Delivery**: The JWT is delivered strictly as an `HttpOnly` cookie.
4. **Session Retrieval**: On load, `AuthContext` calls `/api/auth/me` to read the cookie securely and populate the user state.
5. **Authorization**: The `authenticateUser` middleware checks the token's validity before granting access to `/api/conversations`.

## 6. Final Production Request Flow

**Guest (Unauthenticated):**
1. User types message in Vercel frontend.
2. Frontend calls `POST /api/chat/public`.
3. Render backend receives request.
4. Backend passes context to Gemini API.
5. Backend returns response to Vercel frontend.

**Authenticated:**
1. User logs in/registers from Vercel frontend with `credentials: 'include'`.
2. Render backend issues an `HttpOnly` authentication cookie (configured with `secure: true` and `sameSite: 'none'` for cross-origin).
3. User types message; Vercel frontend makes a protected API request (e.g., `POST /api/conversations/:id/messages`) with `credentials: 'include'`.
4. Render backend validates the cookie and accesses MongoDB Atlas and Gemini as required.
5. Backend returns the processed response to the frontend.

## 7. Database Architecture

The Mongoose models track persistent chat states:
- **User**: Stores `name`, `email`, `passwordHash`, and `role` (enum: 'user', 'admin').
- **Conversation**: Stores `userId` (references User) and `title`. Represents a discrete chat thread.
- **Message**: Stores `conversationId` (references Conversation), `role` (enum: 'user', 'assistant'), and `content`. Represents individual chat bubbles within a thread.

## 8. Gemini Integration

- **Backend-Only**: The `GEMINI_API_KEY` lives in the backend `.env` file and is never sent to the client.
- **Service**: Handled by `services/geminiService.js` using `@google/generative-ai`.
- **Model**: Currently configured to use `gemini-robotics-er-2-preview`.
- **Instructions**: Provided with a strict system instruction to act as "Shivang AI" and generate clear text/code.

## 9. Request/Response Flow & Network Architecture

Important API boundaries:
- `POST /api/auth/login` (Auth validation, returns User)
- `GET /api/auth/me` (Session validation)
- `GET /api/conversations` (Fetches user's history)
- `POST /api/conversations/:id/messages` (Private chat)
- `POST /api/chat/public` (Ephemeral public chat)

### Network and CORS
- **Vercel → Render CORS**: The backend enables CORS for the configured Vercel frontend origin (`FRONTEND_URL`) with credentials enabled.
- **Render → MongoDB Atlas**: The backend establishes a secure connection to MongoDB Atlas, which is configured to allow the Render outbound IP ranges required by the deployed service (`74.220.48.0/24`, `74.220.56.0/24`).
- **Backend-Only Gemini API**: The Gemini API key is completely isolated to the Render backend environment and never exposed to the client.

## 10. Security Boundaries

- **HttpOnly Cookies**: Protect JWTs against XSS attacks.
- **JWT Validations**: Hardened signature verification on all private routes.
- **Role Authorization**: Admin endpoints explicitly enforce role constraints.
- **API Key Protection**: Strict server-side execution of all Gemini API calls.
- **Safe JSON Parsing**: Frontend explicitly verifies `content-type` headers before invoking `.json()` to gracefully handle server proxy or HTML errors.
