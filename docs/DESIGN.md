# Design System

## 1. Design Goals
The goal of Shivang AI is to deliver a highly interactive, modern, and aesthetically premium user interface. The application relies on rich aesthetics, glassmorphism, dynamic background elements, and smooth interactions to foster an engaging environment.

## 2. Visual Direction
Shivang AI utilizes a dynamic blue and purple aesthetic. The visual layer involves moving radial gradients behind the main chat interface, creating a "living" glowing background. Content panes use glassmorphism techniques (`backdrop-filter: blur()`) to float above this background.

## 3. Layout
- **Sidebar**: Positioned on the left. Houses the logo, a "New Chat" button, a search bar, a history grouped by timeline (Pinned, Today, Yesterday, Older), and a user profile/login section at the bottom.
- **Main Chat Area**: Occupies the remaining width on the right, housing the chat headers, the message list, and the composer.
- **Chat Composer**: A fixed element at the bottom center of the screen inside the chat area, ensuring it is always accessible.

## 4. Light Theme
Recent contrast improvements govern the Light Theme behavior:
- **Primary Text**: Deep slate (`#0f172a`) for maximum readability.
- **Secondary Text**: Muted blue-grey (`#334155`).
- **Background Elements**: Off-white panels (`#f8fafc`) with slightly opaque borders (`rgba(0, 0, 0, 0.15)`) for clear visual separation.
- **Glow & Grid**: Kept subtle (opacity 0.08 and 0.06 respectively) to avoid washing out foreground text.
- **Composer Shadow**: Uses a distinct shadow (`0 4px 24px rgba(0, 0, 0, 0.12)`) to lift the input field above the light background.
- **Online Indicator**: Specifically uses `#059669` (darker emerald) for clear visibility against bright headers.

## 5. Dark Theme
- **Primary Text**: Off-white (`#e2e8f0`).
- **Background Elements**: Deep slate (`#0f172a`) with transparent paneling.
- **Glow & Grid**: Intensified (opacity 0.15 and 0.12) because dark backgrounds naturally absorb glowing accents better without hindering readability.

## 6. Typography
The application uses the `Inter` font family from Google Fonts, providing clean, highly legible neo-grotesque sans-serif characters optimal for reading long chunks of AI-generated text or code.

## 7. Components
- **Prompt Cards**: Rounded, clickable cards displayed on the empty state screen featuring icons and hover lift effects to encourage immediate interaction.
- **Glass Containers**: Used for the input field and headers, adding blur to background elements passing underneath them.
- **Avatar Icons**: User messages use a solid background initial, while AI messages use a branded robot icon (`FaRobot`).

## 8. Chat Message Design
- **User Messages**: Aligned to the right inside rounded bubbles with a distinct background color (grey/slate).
- **Assistant Messages**: Aligned to the left without a constraining bubble, allowing Markdown to fill the space cleanly.
- **Markdown & Code**: 
  - Heavily utilizes `react-markdown` to format tables, bold text, and lists.
  - Code blocks are parsed using `react-syntax-highlighter` (Atom Dark theme), complete with a custom language header and an interactive `Copy` button.

## 9. Responsive Behavior
- The main sidebar is resizable on desktop via a draggable handle.
- On screens under 768px, the sidebar is hidden by default and accessible via an absolute-positioned hamburger menu (`GiHamburgerMenu`).
- A semi-transparent overlay darkens the main chat area when the mobile sidebar is active.

## 10. Accessibility / Contrast
- Interactive elements (send buttons, copy buttons, hover menus) offer clear visual feedback upon interaction.
- Color contrast ratios in Light Mode were strictly adjusted to prevent text from washing out against bright glowing elements.
