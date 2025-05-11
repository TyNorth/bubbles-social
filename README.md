
---

# 🫧 Bubbles – Curiosity Has a Place
Next-Gen Social Media App

**Bubbles** is a social discovery platform designed to gently pull people out of their echo chambers and into idea spaces — called *bubbles* — where curiosity, creativity, and thoughtful conversation thrive.

It's not just a feed — it's a **living field of thought**.

---

## ✨ Features

### 🌐 Platform Foundation
- Built with [Quasar](https://quasar.dev) + [Supabase](https://supabase.com)
- Fully PWA-enabled (installable + offline support)
- Secure auth flow (register, login, reset, onboarding)
- Row-level security (RLS) with typed schema + enum support

### 🧠 Core Experiences
- **Bubbles**: user-curated topic spaces with proto → public lifecycle
- **Posts**: markdown + media, edit support, dynamic feed scoring
- **Comments**: threaded replies, mentions, notifications
- **Reactions**: like, dislike, save, peek, expand — unified per-user interaction model
- **Feed**: personalized by interest tags, joined bubbles, and engagement scores
- **Explore**: list + floating D3-based bubble field
- **Profiles**: tabbed interface (Posts, Saves, Bubbles, Activity, About)

### 📊 Interaction System
- Single-row per user/post interaction
- `affinity`: `like` | `dislike` | `neutral`
- `saved`, `peeked`, `expanded`: individual booleans
- Built-in moderation-ready schema

---

## 🛠 Tech Stack

| Layer        | Tech                                   |
|--------------|----------------------------------------|
| Frontend     | Vue 3 + Quasar Framework               |
| Backend      | Supabase (PostgreSQL + Auth + Storage) |
| State Mgmt   | Pinia                                  |
| Styling      | Tailwind (via Quasar)                  |
| Animation    | D3 (for Bubble Field view)             |
| Markdown     | Quasar Markdown Renderer               |

---

## 🧪 Local Dev Setup

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/bubbles.git
cd bubbles

````

### 2. Install Dependencies

```bash
npm install
```

### 3. Add `.env` File

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Start the Dev Server

```bash
quasar dev
```

---

## 🧬 Data Model Highlights

### `posts` table

* `id`, `user_id`, `bubble_id`, `content`, `media_url`, `tags`, `level_tag`, `created_at`

### `interactions` table

* `user_id`, `post_id` (unique)
* `affinity`: `'like' | 'dislike' | 'neutral'`
* `saved`, `peeked`, `expanded`: `boolean`

### `bubbles` table

* `name`, `status`: `'proto' | 'public'`, `creator_id`, `tags`, `description`

---

## 🔮 Roadmap

* [ ] Real-time feed updates via Supabase channels
* [ ] Proto → public promotion logic
* [ ] AI summarization + tone detection per post
* [ ] Admin dashboard for bubble health + moderation
* [ ] Feed tuning with custom prompt inputs

---

## 🧠 Philosophy

You're not just building a social app — you're shaping a **living curiosity graph**.

Bubbles rise, drift, and pop based on engagement, vibe, and intentional exploration.

> 🫧 *Let thought float.*

---

## 📄 License

MIT © Ty North




### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
