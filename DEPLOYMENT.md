# ACCA Master — Deployment Guide

This guide describes how to build and deploy **ACCA Master** to production using **Firebase Hosting** or alternative free tier platforms (Vercel, Netlify, Cloudflare Pages).

---

## 1. Prerequisites

- Node.js `v18+` or `v20+` (Developed and tested with Node `v26.8.1`).
- NPM `v10+`.
- A free Firebase project created at [console.firebase.google.com](https://console.firebase.google.com).

---

## 2. Environment Variables Configuration

In production, set the following environment variables in your deployment dashboard (or in `.env.production`):

```bash
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef..."
```

---

## 3. Deploying to Firebase Hosting (Recommended Free Tier)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login and Initialize
```bash
firebase login
firebase init hosting
```
- Select your Firebase Project.
- Specify public directory: `dist`.
- Configure as single-page app (rewrite all URLs to `/index.html`): `Yes`.
- Set up automatic builds and deploys with GitHub: Optional (`No`).

### Step 3: Deploy Firestore Security Rules & Indexes
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### Step 4: Build & Deploy Web Application
```bash
npm run build
firebase deploy --only hosting
```

---

## 4. Deploying to Vercel (One-Click / Free Tier)

1. Push your repository to GitHub.
2. In Vercel, click **"Add New Project"** and import the `ACCA-Master` repository.
3. Select **Vite** framework preset.
4. Set Build Command: `npm run build`.
5. Set Output Directory: `dist`.
6. Add the `VITE_FIREBASE_*` environment variables in the project settings.
7. Click **Deploy**.

---

## 5. Deploying to Netlify

1. Link your GitHub repository in Netlify.
2. Set Build Command: `npm run build`.
3. Set Publish directory: `dist`.
4. Ensure single-page app routing is handled: create `public/_redirects`:
   ```text
   /*    /index.html   200
   ```
5. Deploy site.

---

## 6. Post-Deployment Verification Checklist

- [ ] Verify homepage loads cleanly over HTTPS.
- [ ] Test student registration and login flows.
- [ ] Test paper syllabus navigation (`/papers/fa1`).
- [ ] Attempt practice question submission and verify answer explanations.
- [ ] Complete timed mock examination and verify that the results diagnostic page displays obtained marks and pass/fail status.
- [ ] Log in with administrator account and verify `/admin` console controls.
