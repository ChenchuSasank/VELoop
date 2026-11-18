# VELOOP Rewards – Level-Up Dashboard

Gamified level progress, next-level reward, level roadmap, XP Catcher mini-game, earning cards and XP activity.
**All values are DEMO data** (see `src/data/levelData.js`) until the backend and product rules are approved.

## Run it
```
npm install
npm run dev      # open http://localhost:5173/Lvl-Dashboard
npm run build    # production build
```
Open `/Lvl-Dashboard?error=1` to see the error state.

## Stack
React, Vite, Bootstrap, CSS Modules, React Hooks, lucide-react, react-router-dom.

## Folder structure
`src/components/*` (one folder per section), `src/pages/LevelDashboard`, `src/data`, `src/hooks`, `src/styles`.

## Game rules (XP Catcher)
20-second skill game. Move the basket to catch XP orbs (10), VE coins (5) and gems (15).
Reward = score ÷ 4 XP (max 30); score 80+ also shows +12 VEs. Demo only, local state, no backend.

## Deploy
Push to GitHub, import in Vercel. `vercel.json` makes `/Lvl-Dashboard` work.

## Still to add
Screenshots, live demo link, GitHub link, author name.
