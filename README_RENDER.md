# Deploying Exam-Prep100 to Render.com

## 1. Prerequisites
- Push your code to GitHub, GitLab, or Bitbucket (public or private repo).
- Remove `.env` from your repo and add it to `.gitignore` (already done).

## 2. Create a Web Service on Render
1. Go to https://dashboard.render.com/
2. Click **New +** → **Web Service**
3. Connect your repo and select the branch to deploy (e.g., `fix/secure-credentials`)
4. Set the following options:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js` (or `npm start`)
   - **Root Directory:** (leave blank if `server.js` is in the root)
5. Click **Create Web Service**

## 3. Add Environment Variables
- In the Render dashboard, go to your service’s **Environment** tab.
- Add the following variables:
  - `GEMINI_API_KEY`
  - `ELEVEN_API_KEY`
  - `ELEVEN_VOICE_ID`
  - (Add any other secrets you need)

### Set env via Render CLI (optional)
If you prefer the CLI, install the Render CLI and set env vars (you'll need a Render API key):

```bash
# install render CLI
npm install -g @render/cli

# login (follow the interactive prompt)
render login

# set env var for service (replace <service-id> and values)
render services env:set <service-id> GEMINI_API_KEY "your_gemini_key"
render services env:set <service-id> ELEVEN_API_KEY "your_eleven_key"
render services env:set <service-id> ELEVEN_VOICE_ID "alloy"
```

## 4. Deploy and Test
- Click **Manual Deploy** or push to your repo to trigger a deploy.
- Once live, visit your Render URL and test all features (chat, TTS, etc).

## 5. (Optional) Static Site for Assets
- If you want to serve static files separately for speed:
  - Click **New +** → **Static Site**
  - Set the publish directory (e.g., `students/` or your static folder)
  - Connect to the same repo/branch

## 6. Notes
- Your `server.js` already uses `process.env.PORT` (Render sets this automatically).
- CORS is enabled for all origins by default in `server.js`.
- All static files in `/students` and `/assets` are served by Express.
- No `.env` file is needed in the repo or on Render; use the dashboard for secrets.

---

**If you need to update environment variables, do it in the Render dashboard and redeploy.**

**For any issues, check the Render logs for errors.**
