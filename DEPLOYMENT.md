# Deployment Guide - Brainbox AI

## Deploy on Render

### Prerequisites
- GitHub account with your code pushed to a repository
- Render account (free tier available)

### Step-by-Step Deployment

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/Brainbox-AI.git
   git push -u origin main
   ```

2. **Connect to Render**:
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the `Brainbox-AI` repository

3. **Configure the Service**:
   - **Name**: `brainbox-ai` (or your preferred name)
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python run_server.py`
   - **Plan**: `Free` (or upgrade as needed)

4. **Environment Variables** (if needed):
   - `PORT`: Will be automatically set by Render
   - `PYTHON_VERSION`: `3.11.4` (optional)

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for the build and deployment process to complete
   - Your app will be available at `https://your-app-name.onrender.com`

### Important Notes

- **Free Tier Limitations**: 
  - Apps sleep after 15 minutes of inactivity
  - 750 hours/month of runtime
  - First request after sleep may take 30+ seconds

- **WebLLM Considerations**:
  - Models are downloaded on the client-side (browser)
  - Large models may take time to download initially
  - Consider using smaller models for better performance

- **HTTPS Required**: WebLLM requires HTTPS for some features. Render provides HTTPS by default.

### Troubleshooting

- **Build Fails**: Check that `requirements.txt` is properly formatted
- **App Won't Start**: Verify the start command and PORT environment variable
- **WebLLM Issues**: Ensure proper CORS headers are set (already configured)

### Alternative Deployment Options

1. **Vercel** (for static deployment with serverless functions)
2. **Netlify** (for static sites)
3. **Railway** (similar to Render)
4. **Heroku** (paid plans only)

### Local Development

To run locally:
```bash
python run_server.py
```

Then open `http://localhost:8000` in your browser.
