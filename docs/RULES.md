# Project Rules

## 1. Code Rules
- **Follow existing conventions**: Write code that matches the existing file structure and architectural paradigms. 
- **Keep components focused**: React components should represent distinct UI modules. If a file becomes too large (like `Sidebar.jsx`), strongly consider whether it can be broken down.
- **Avoid unnecessary duplication**: Use CSS variables for repeated styles across components.
- **No unnecessary dependencies**: Rely on built-in browser APIs (e.g., native `fetch` over Axios) and existing libraries (`react-router-dom`, `react-markdown`) unless a new tool adds undeniable value.

## 2. React Rules
- **Context API**: Rely on `UserContext` and `AuthContext` for global application state rather than introducing complex alternatives like Redux.
- **Local State**: Keep UI toggles (e.g., `extend` sidebar, `menuOpen` popovers) isolated within their respective components.
- **Graceful Error Handling**: Do not let network fetch errors crash the UI. Safely check headers (e.g., `content-type`) before attempting to parse JSON payloads.

## 3. Backend Rules
- **Layered Architecture**: Stick to the standard Express architecture by keeping Controllers, Routes, Middlewares, and Services separated.
- **Consistent Responses**: Always return JSON. Avoid letting Express default to HTML responses for 404s or error bounds.
- **Input Validation**: Check for expected data payloads (e.g., `messages` array in `/public`, `content` in `/messages`) before processing logic.

## 4. Security Rules
- **Never commit `.env`**: Environment files contain sensitive keys and must remain listed in `.gitignore`.
- **Never expose `GEMINI_API_KEY`**: AI API calls must be proxied exclusively through the backend `geminiService`.
- **Stateless/Cookie Auth**: JWT tokens must be stored solely as `HttpOnly` cookies. Do not attempt to read or store JWTs in frontend `localStorage`.
- **Admin Authorization**: Administrative endpoints must always be wrapped with the `requireAdmin` middleware.

## 5. Git Rules
- **Verify Changes**: Check `git status` and review staged files carefully before committing.
- **Never Commit Secrets**: Actively verify that no hardcoded credentials or API keys have been introduced.
- **Meaningful Commits**: Use short but highly descriptive commit messages indicating what was changed and why.

## 6. UI Rules
- **Maintain Theme Consistency**: Any new CSS must support both `.lightmode` and `.darkmode`. Use CSS variables for dynamic colors.
- **Preserve Responsiveness**: Verify that the application continues to look correct on mobile viewport sizes (under 768px). Avoid creating horizontal overflow outside of scrollable code blocks.
- **Avoid Unnecessary Redesigns**: Stick to the established glassmorphism layout and styling instead of introducing clashing aesthetic choices.
