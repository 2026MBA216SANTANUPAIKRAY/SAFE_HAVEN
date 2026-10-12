# SafeHaven Institutional Companion
### Apartment 402 · Tower A | Sovereign Residential Safety & Care

SafeHaven is an institutional residential safety, zero-optical mmWave fall-detection, and voice-masked doorstep security companion built for modern high-security residences and eldercare monitoring.

---

## ⚡ Direct Offline File (Zero Internet / Zero Server Required)

SafeHaven includes a fully self-contained standalone offline HTML distribution:

📁 **`public/SafeHaven_Apartment402_Offline.html`**

- **Zero dependencies:** Open directly via `file://` by double-clicking in Chrome, Firefox, Safari, or Edge.
- **Embedded JavaScript, Styles & Assets:** All SVG graphics, 24-hour mmWave radar charts (Recharts), IndexedDB sovereign audit storage, siren synthesizer, and voice-masking algorithms are bundled directly inside this single file.
- **Offline Reliability:** Operates with 100% functionality with no WiFi, cellular data, or local Node.js server.

---

## 🚀 How to Run and Host in Your GitHub Repository

### Step 1: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `safehaven-companion`).
3. Leave it public or private, without initializing a README.

### Step 2: Push This Project to GitHub
In your terminal in this project root, run:

```bash
# Add your GitHub repository as origin
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# Rename branch to main
git branch -M main

# Add all files and make the commit
git add .
git commit -m "feat: complete SafeHaven companion with offline HTML and GitHub Pages workflow"

# Push to your GitHub repository
git push -u origin main
```

### Step 3: Enable Free GitHub Pages Hosting (1 Click)
1. On GitHub, go to your repository **Settings** → **Pages** (under Code and automation).
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. That's it! The included `.github/workflows/deploy.yml` workflow will automatically trigger, build the application, and publish your live web app to:
   ```
   https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/
   ```
4. The offline HTML will also be hosted directly at:
   ```
   https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPO-NAME>/SafeHaven_Apartment402_Offline.html
   ```

---

## 💻 Local Development Setup

To run or develop locally with Vite:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (runs at http://localhost:3000)
npm run dev

# 3. Build project & regenerate standalone offline HTML file
npm run build
```

---

## 🛡️ Core Features
- **Zero-Optical mmWave Fall & Vitality Monitoring:** Non-invasive radar telemetry with radar gating margin alerts.
- **24-Hour Global Activity Chart:** Multi-room telemetry overview with peak surge tracking.
- **Doorstep Intercom with Voice Masking:** Intercom simulator with Deep Male, Distorted Sentinel, and Pitch-Shift filters.
- **Hardware Mesh Integrity:** Real-time pod battery telemetry, RF latency, and mesh health status.
- **Sovereign Local Vault (DPDP 2023):** Cryptographic on-device IndexedDB log storage with statutory export & audit compliance.
