# Memory Map 🌍 — Global Memory Intelligence & Visual Life Archive

**Memory Map** is an interactive, location-driven visual archive that connects your personal journeys, companions, collections, and stories across a worldwide canvas.

Built with **React**, **TypeScript**, **Tailwind CSS**, and backed by **Firebase Firestore** with **Firebase Authentication**, Memory Map transforms everyday memories and global travel into an interconnected web of people, places, and milestones.

---

## ✨ Features

- 🗺️ **Interactive Worldwide Map**: Explore memories pinned across global landmarks (Paris, Tokyo, New York, London, Dubai, Sydney, Mumbai, etc.) with Leaflet map layers (Dark, Light, Satellite) and travel journey polylines.
- 📍 **Worldwide Geocoding & Search**: Live place lookup and coordinate reverse-geocoding powered by OpenStreetMap Nominatim.
- 👥 **Companion & People Network**: Track friends, colleagues, and travel partners with bi-directional relationship graphs and shared memory counts.
- 📅 **Interactive Timeline View**: Chronological life journey feed grouped by year and month with category badges and location tags.
- 🕸️ **D3 Memory Relationship Graph**: Visual node-link network visualizing the connectivity between you, your companions, and your pinned locations.
- 🖼️ **Media Gallery & Mood Analytics**: Grid gallery with photo lightbox and categorical mood/story summaries.
- 🔐 **Firebase Cloud Database & Authentication**: Real-time cloud sync with Firestore and user authentication (Email/Password, Google Sign-In, and Guest mode).
- 💾 **Offline Cache & JSON Backup**: Full local storage caching with export/import capabilities for peace of mind.

---

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Motion (Framer Motion)
- **Maps & Visualization**: Leaflet, React-Leaflet, D3.js, Recharts
- **Backend & Cloud Persistence**: Firebase Authentication, Google Cloud Firestore
- **Geocoding**: OpenStreetMap Nominatim API (Global reverse geocoding & search)

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The application runs on `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```

---

## 📁 Project Structure

```
├── src/
│   ├── components/       # UI Components (Map, Timeline, Graph, Gallery, AuthModal, etc.)
│   ├── data/             # Preset worldwide demo datasets
│   ├── lib/              # Firebase configuration and initialization
│   ├── services/         # Storage, Geocoding, and Auth business logic
│   ├── types.ts          # Global TypeScript interfaces & definitions
│   ├── App.tsx           # Main application state and layout shell
│   └── main.tsx          # Application entry point
├── firestore.rules       # Cloud Firestore security rules
└── package.json          # Dependencies and scripts
```

---

## 🛡️ License

MIT License. Crafted for storytellers, explorers, and builders.
