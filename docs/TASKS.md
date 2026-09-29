# Tasks

## Completed
- [x] Basic Chat Interface with User/AI message bubbles
- [x] Integration with Google Gemini API (backend service)
- [x] Light/Dark mode toggling and CSS variable system
- [x] Markdown parsing and Syntax Highlighting (with copy button) for AI responses
- [x] User Authentication (Registration, Login, HttpOnly JWT cookies)
- [x] MongoDB integration for persisting Users, Conversations, and Messages
- [x] Sidebar navigation with history grouping (Today, Yesterday, Older)
- [x] Conversation management (Rename, Delete, Pin to top)
- [x] Admin Role and protected Backend Admin Endpoints
- [x] Mobile responsiveness (Sidebar hamburger menu overlay)
- [x] Light Mode contrast improvements (darker text, visible composer borders, softer glowing backgrounds)
- [x] Optional Public Chat functionality (ability to use Gemini without creating an account or polluting the database)
- [x] Safe JSON parsing on the frontend to gracefully handle unexpected server HTML errors
- [x] Deploy frontend to Vercel (Production URL: https://chatbot-mocha-six-11.vercel.app)
- [x] Deploy backend to Render (Production URL: https://chatbot-f3rk.onrender.com)
- [x] Configure MongoDB Atlas network access for Render outbound IPs
- [x] Fix cross-origin cookie storage issue for production authentication (credentials: 'include')

## In Progress
- [ ] No major features currently in active development.

## Planned
- [ ] Implement actual admin dashboard UI capabilities (view user metrics, manage accounts).
- [ ] Consider adding markdown support for image rendering if Gemini Vision capabilities are leveraged.
- [ ] Improve frontend testing and type safety (e.g., migrating to TypeScript or adding Jest tests).

## Known Issues
- No verified blocking bugs currently known in production.
