# Inkwell — a Medium/Hashnode-style blogging platform

Full-stack MERN blogging app: React (Vite + Tailwind) frontend, Node/Express + MongoDB (Mongoose) backend, JWT auth, rich-text editor, likes, comments, follows, tags, search, and profiles.

## Features

- Email/password auth with JWT (register, login, persistent session)
- Create / edit / delete posts with a rich text editor (headings, images, links, code blocks, lists)
- Cover images and inline images (stored as base64 — swap in S3/Cloudinary for production)
- Tags, full-text search, sort controls (latest / trending / most liked), pagination
- Likes, threaded comments, bookmarking with a dedicated "Saved" reading-list page
- Follow / unfollow authors, public profile pages with bio + stories
- In-app notifications (bell icon) for likes, comments, and new followers
- Share buttons (X/Twitter, LinkedIn, native share sheet, copy link) on every story
- "More like this" related-posts strip at the end of each article, based on shared tags
- Light/dark mode toggle (persisted, respects system preference by default)
- Reading time estimate, view counter, reading-progress bar
- Fully responsive, editorial-styled UI — matte pink & lavender palette, serif display type, drop caps

## Project structure

```
blog-platform/
  backend/     Express API + Mongoose models
  frontend/    React app (Vite)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set `MONGO_URI` to your MongoDB connection string:

- Local MongoDB: `mongodb://127.0.0.1:27017/inkwell`
- MongoDB Atlas (free tier works fine): `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/inkwell`

Also set `JWT_SECRET` to any long random string.

Then run:

```bash
npm run dev        # starts the API on http://localhost:5000 with nodemon
```

Optional — seed the database with demo users and posts:

```bash
npm run seed
# Demo login: ava@example.com / password123
```

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev         # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so both servers need to be running together. Open **http://localhost:5173**.

## 3. Production build

```bash
cd frontend
npm run build        # outputs static files to frontend/dist
```

Serve `frontend/dist` with any static host (Vercel, Netlify, Nginx) and deploy `backend/` to any Node host (Render, Railway, Fly.io, EC2), setting the same environment variables from `.env.example`. Update `CLIENT_URL` in the backend `.env` to your deployed frontend URL, and point the frontend's API calls at your deployed backend (edit `frontend/vite.config.js` proxy for dev, or set an `axios` baseURL env var for prod).

## API overview

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET  | /api/auth/me | Current user (auth required) |
| GET  | /api/posts | List posts (page, limit, tag, author, search, sort) |
| GET  | /api/posts/meta/tags | Tag list with counts |
| GET  | /api/posts/:slug | Single post |
| POST | /api/posts | Create post (auth) |
| PUT  | /api/posts/:id | Update post (auth, owner only) |
| DELETE | /api/posts/:id | Delete post (auth, owner only) |
| PUT  | /api/posts/:id/like | Toggle like (auth) |
| PUT  | /api/posts/:id/save | Toggle bookmark (auth) |
| GET  | /api/comments/:postId | List comments for a post |
| POST | /api/comments/:postId | Add comment (auth) |
| DELETE | /api/comments/:id | Delete own comment (auth) |
| GET  | /api/users/:username | Public profile |
| PUT  | /api/users/me | Update own profile (auth) |
| PUT  | /api/users/:id/follow | Toggle follow (auth) |
| GET  | /api/users/me/saved | List saved/bookmarked posts (auth) |
| GET  | /api/notifications | List your notifications (auth) |
| GET  | /api/notifications/unread-count | Unread notification count (auth) |
| PUT  | /api/notifications/:id/read | Mark one notification read (auth) |
| PUT  | /api/notifications/read-all | Mark all notifications read (auth) |

## Notes

- Images (cover + avatar) are uploaded as base64 data URLs for simplicity so there's no external storage dependency. For production, replace the file inputs in `Editor.jsx` / `Profile.jsx` with uploads to S3/Cloudinary/Supabase Storage and store the returned URL instead.
- The rich text editor (`react-quill`) outputs HTML, which is stored as-is in `Post.content` and rendered with the `.prose-article` styles in `index.css`.
