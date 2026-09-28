# Product Requirements Document

## 1. Product Overview
Shivang AI is a full-stack AI chatbot built using the React/Node.js/MongoDB (MERN) stack. It leverages the Google Gemini API to provide intelligent responses in a clean, modern, responsive chat interface. 

## 2. Problem Statement
The application solves the need for a customizable, self-hosted, secure AI chat assistant. It provides users with a platform to ask questions, brainstorm ideas, and debug code while managing conversation histories securely.

## 3. Goals
- Deliver a seamless, highly responsive, and aesthetically modern chat experience.
- Provide secure user and admin authentication.
- Persist authenticated user conversations and messages.
- Allow optional, unauthenticated public usage of the chatbot without polluting the database.
- Keep all API interactions with Gemini securely on the backend server.

## 4. Target Users
- **Guest Users**: Visitors who want quick access to the chatbot without registering for an account.
- **Authenticated Users**: Registered users who need access to their personal conversation history, the ability to organize chats (pin/rename/delete), and persistent user profiles.
- **Admins**: Elevated users with access to an administrative dashboard for monitoring or managing the application.

## 5. Core Features
- **Public & Authenticated Chat Interface**: A dual-mode chat interface allowing unauthenticated users to use Gemini, and authenticated users to persist their chats. (Completed)
- **Rich AI Responses**: Full support for Markdown, tables, and syntax-highlighted code blocks with copy buttons. (Completed)
- **Conversation Management**: Sidebar interface allowing authenticated users to create new chats, rename them, delete them, and pin important conversations. (Completed)
- **Dark/Light Themes**: A responsive glassmorphism UI that supports toggling between light and dark visual aesthetics. (Completed)
- **Mobile Responsive Design**: A sidebar that collapses into a hamburger menu on smaller screens, ensuring readability and usability on mobile devices. (Completed)
- **Prompt Suggestions**: Clickable prompt cards on empty screens to jumpstart conversations. (Completed)

## 6. Authentication Requirements
- **Registration & Login**: Dedicated `/login` and `/register` pages for creating accounts.
- **HttpOnly Cookies**: JSON Web Tokens (JWT) are stored in secure HttpOnly cookies, ensuring they cannot be accessed by client-side scripts.
- **Role-based Access**: Users are classified as either `user` or `admin`.
- **Admin Protection**: Admin routes require strict backend authorization (`requireAdmin` middleware) verifying the user's role before granting access.
- **Logout**: Secure session termination by clearing cookies.

## 7. Chat Requirements
- **Sending Messages**: Users type in a composer and send messages; UI displays loading indicators ("Shivang AI is thinking...") while waiting for responses.
- **Gemini Integration**: Interactions leverage a specifically tailored Gemini system prompt guiding the AI to be concise and accurate.
- **History Behavior**: Authenticated chats are saved to a MongoDB backend; their histories are re-loaded automatically when selected. Unauthenticated chats are ephemeral and are not stored in the database.
- **Regenerate Responses**: Users can easily trigger a regeneration of the latest response.

## 8. Admin Requirements
- **Dashboard Access**: Access to the `/admin` path is exclusively granted to authenticated users with the `admin` role.
- **Backend Authorization**: The API validates the admin token on every protected administrative request.

## 9. Non-Functional Requirements
- **Security**: The `GEMINI_API_KEY` must never be exposed to the frontend.
- **Performance**: The frontend uses Vite for fast module replacement and optimized builds. 
- **Responsive UI**: CSS and layout are designed for cross-device compatibility (desktop, tablet, mobile).
- **Maintainability**: React Context is strictly used for global state management; modular API routing is used in Express.
