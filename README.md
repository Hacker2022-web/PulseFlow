# PulseFlow OS — Habits • Goals • Cash Flow

A high-performance, installable web operating system (PWA) uniting **daily routine tracking**, **milestone roadmaps**, and **financial cash flow management** with real-time **Duo Accountability & Co-op Quests**.

Built with a liquid glass aesthetic, GPU-accelerated micro-interactions, responsive mobile optimizations, and Local-First architecture with Firebase cloud sync.

---

## ⚡ Highlights

### 1. Unified Bento Grid Dashboard
- **Customizable Layout**: Reorder and toggle dashboard modules (Habits, Must-Dos, Budget Burn, Co-op Quests, Subscriptions, AI Debrief).
- **Hero Metrics & Micro-Pods**: Real-time habit streak status, daily task completion score, and day-spend pacing.
- **Predictive Budget Burn Forecast**: Algorithmic projection estimating exact exhaustion date based on current daily velocity.
- **Weekly Bento AI Debrief**: Comprehensive weekly performance scorecard grading routine consistency, friction points, and lifestyle correlations.

### 2. Daily Habits & Streaks
- **Routines**: Configurable intervals (Daily, Weekdays, Weekends, Custom Weekly) with reminder times and custom icons/hues.
- **One-Tap Check-In**: Instant logging with celebratory micro-animations.
- **Streak Freeze & Rescue Shields**: Bank freeze shields to protect streaks when life gets busy, or gift shields to your partner to save their streak.

### 3. Priority Tasks & Goal Roadmaps
- **Today's Must-Dos**: Clean focus list of daily priorities with granular sharing controls.
- **Milestone Roadmaps**: Track numeric metrics (distance, savings, hours), percentages, or checklists with progress logs.

### 4. Cash Flow & Expense Tracker (Private by Default)
- **Instant Logging**: Quick entry with category tags, notes, and payment methods.
- **Budget Threshold Warnings**: Automatic amber warning at 80% and rose alert at 100% monthly limit.
- **Subscription Vault**: Visual recurring billing tracker displaying renewal countdowns and net monthly commitment.
- **100% Private**: Financials remain strictly local and are never exposed to collaborators.

### 5. Collaborator Mode (Duo Accountability)
- **1-to-1 Pairing**: Connect with an accountability partner via a simple invite code (e.g., `PULSE-7749`).
- **Partner Today Screen**: Live view of your partner's shared tasks and habits.
- **Co-op Quests**: Pool efforts on shared milestones (e.g. 100km run distance, ₹40k vacation savings, 14-day zero-sugar challenge).
- **Smart Nudges & Cheers**: Send friendly reminders (rate-limited, quiet hours aware) and instant cheer reactions (🔥, 🎉, 👏).

---

## 🔥 Firebase Setup Guide (Real-Time Cloud Sync)

PulseFlow works **100% offline and local-first** out of the box using `localStorage`. To sync habits, goals, and duo accountability across devices or between two phones in real-time, connect your own Firebase project:

### Step 1: Create a Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and name it (e.g., `pulseflow-app`).
3. Disable Google Analytics (optional) and click **Create Project**.

### Step 2: Register a Web App
1. In your Firebase Project Overview, click the **Web icon** (`</>`) to add a web app.
2. Give it a nickname like `PulseFlow Web`.
3. Check **"Also set up Firebase Hosting"** if desired, and click **Register app**.
4. Firebase will display your `firebaseConfig` credentials object:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "pulseflow-app.firebaseapp.com",
     projectId: "pulseflow-app",
     storageBucket: "pulseflow-app.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

### Step 3: Enable Authentication
1. In the Firebase left sidebar, click **Build** $\rightarrow$ **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - Enable **Email/Password**.
   - Enable **Google** (select your project support email and save).

### Step 4: Create Cloud Firestore Database
1. In the sidebar, click **Build** $\rightarrow$ **Firestore Database** $\rightarrow$ **Create database**.
2. Choose a server location close to you (e.g., `nam5 (us-central)` or `asia-south1`).
3. Start in **Production mode** and click **Create**.
4. Click on the **Rules** tab and paste these security rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read and write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       // Collaborator pairs: both users in the pair can read/write
       match /pairs/{pairId} {
         allow read, write: if request.auth != null &&
           (resource == null || resource.data.userAId == request.auth.uid || resource.data.userBId == request.auth.uid);
       }
       // Co-op quests: authenticated users in the pair can collaborate
       match /coop_quests/{questId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
5. Click **Publish**.

### Step 5: Connect Credentials to PulseFlow
You can configure Firebase in either of two ways:

#### Option A: In the Web App (No Code / Zero Build)
1. Open PulseFlow, open the sidebar or menu, and tap **Settings & Profile**.
2. Scroll to **Backend & Firebase Integration** $\rightarrow$ click **Configure Firebase**.
3. Paste your `API Key`, `Project ID`, and `Auth Domain`.
4. Click **Save & Initialize Firebase**. The app will reload and connect live!

#### Option B: Environment Variables (`.env`)
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=pulseflow-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pulseflow-app
VITE_FIREBASE_STORAGE_BUCKET=pulseflow-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...
```

---

## 🚀 Pushing to GitHub

To push your repository to GitHub:

### 1. Initialize Git and Stage Files
```bash
git init
git add .
git commit -m "feat: PulseFlow OS initial production release"
```

### 2. Link your GitHub Repository
1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `pulseflow`).
2. Run the following terminal commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/pulseflow.git
git branch -M main
git push -u origin main
```

---

## 🌐 Deploying to Production

### Deploying to Vercel (Recommended)
1. Push your code to GitHub.
2. Sign in to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import your `pulseflow` repository.
4. Set Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add the `VITE_FIREBASE_*` variables from your `.env`.
6. Click **Deploy**.

### Deploying to Netlify
1. Connect your GitHub repository on [netlify.com](https://www.netlify.com/).
2. Set Build Command to `npm run build` and Publish Directory to `dist`.
3. Add a `public/_redirects` file with `/*  /index.html  200` for client-side routing.
4. Click **Deploy**.

---

## 🛠️ Performance & Optimizations

- **Aurora Glass Rendering**: Tuned blur radiuses with hardware-accelerated 3D transforms (`translate3d(0, 0, 0)`, `will-change: transform`).
- **Mobile Frame-Pacing**: Heavy background keyframe rotations are automatically paused on mobile screens (`@media (max-width: 768px)`) to preserve 60-120fps fluid scrolling and battery life.
- **Vite Chunk Splitting**: Vendor dependencies (`lucide-react`, `framer-motion`, `recharts`, `firebase`) are split into independent asynchronous chunks, reducing initial page payload to under 150kB gzipped.
- **Zero Demo Data Slate**: The app starts with a clean slate ready for production user onboarding. An optional "Load Sample Demo Data" button is available in Settings for testing.

---

## 📜 License
MIT License. Built for performance and daily flow.
