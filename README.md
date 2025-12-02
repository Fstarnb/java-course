# Introduction to Java

This your copy of the code for the java-course. The course itself is located in the issues of this repository.

## Love Story Backend (Node + TypeScript)

A lightweight Express API that powers the couple-themed front-end shown in the mockups. It includes photo uploads, chat history with playful bot replies, preset hero/banner text, love-letter storage, and simple game card metadata.

### Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (watch mode with TypeScript):
   ```bash
   npm run dev
   ```
3. Or build and run the compiled server:
   ```bash
   npm run build
   npm start
   ```

The API listens on `http://localhost:8080` by default and serves uploaded photos from `/uploads`.

### Key endpoints
- `GET /api/health` – health probe.
- `GET /api/hero` – banner names, subtitle, and badge text.
- `GET /api/stats` – summary counts for love days, photos, chats, and letter date.
- `GET /api/game-cards` – metadata for the three game cards.
- `GET /api/memories` – list of uploaded photos (in memory during runtime).
- `POST /api/memories` – upload a photo (`photo` field) with optional `caption`.
- `GET /api/chat/history` – conversation history.
- `POST /api/chat/message` – send a message and receive a contextual bot reply.
- `GET /api/love-letter` / `PUT /api/love-letter` – retrieve or update the shared letter.

Uploads are stored on disk under `uploads/` (created automatically) and served as static files. The service keeps data in memory for simplicity; restart the server to reset state.
