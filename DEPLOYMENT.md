# 🚀 Quick Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account
- Account on Railway/Vercel/Netlify (free tier works)

## Step 1: Prepare Your Code

```bash
# Navigate to the project folder
cd wpl-oracle-fixed

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial deployment"
```

## Step 2: Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/wpl-oracle.git
git branch -M main
git push -u origin main
```

## Step 3A: Deploy to Railway (Recommended)

### Why Railway?
- ✅ Best for real-time data sync
- ✅ Automatic HTTPS
- ✅ Free 500 hours/month
- ✅ Easy environment variables

### Steps:
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects settings from `railway.toml`
6. Click "Add Variables" and add:
   ```
   VITE_RAPIDAPI_KEY=your_api_key_here
   ```
7. Click "Deploy"
8. Wait 2-3 minutes
9. Click the generated URL to view your app!

### After Deployment:
- Your app URL: `https://your-app-name.up.railway.app`
- Updates automatically when you push to GitHub
- Monitor logs in Railway dashboard

## Step 3B: Deploy to Vercel (Fastest)

### Why Vercel?
- ✅ Lightning-fast CDN
- ✅ Instant deployments
- ✅ Free tier is generous
- ✅ Best for static sites

### Steps:
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow prompts:
   - Link to existing project? No
   - Project name: wpl-oracle
   - Directory: ./
   - Build command: (auto-detected)

4. Add environment variable:
   - Go to dashboard.vercel.com
   - Select your project
   - Settings → Environment Variables
   - Add `VITE_RAPIDAPI_KEY`

5. Redeploy:
   ```bash
   vercel --prod
   ```

### After Deployment:
- Your app URL: `https://your-app-name.vercel.app`
- Custom domain available in settings
- Preview deployments for each PR

## Step 3C: Deploy to Netlify

### Why Netlify?
- ✅ Simple drag-and-drop option
- ✅ Great free tier
- ✅ Built-in forms and functions
- ✅ Easy custom domains

### Steps:
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Build settings (auto-detected from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Show advanced" → "New variable"
   - Key: `VITE_RAPIDAPI_KEY`
   - Value: your_api_key
7. Click "Deploy site"
8. Wait 2-3 minutes

### After Deployment:
- Your app URL: `https://your-app-name.netlify.app`
- Site settings for custom domain
- Branch deploys available

## Getting Your API Key

### RapidAPI (Recommended)
1. Go to https://rapidapi.com/cricketapilive/api/cricbuzz-cricket
2. Click "Sign Up" (free)
3. Subscribe to "Basic" plan (500 requests/month free)
4. Copy your API key from the "Code Snippets" section
5. Paste it as `VITE_RAPIDAPI_KEY` in your deployment platform

### Alternative: Use Fallback Mode
- The app works without an API key
- Uses mock data for demonstration
- Perfect for testing before getting an API key

## Testing Your Deployment

1. **Open your deployed URL**
2. **Check these features:**
   - ✅ Page loads within 3 seconds
   - ✅ Mobile view works (resize browser)
   - ✅ Sync button updates data
   - ✅ Tabs switch correctly
   - ✅ No console errors

3. **Mobile Testing:**
   - Open on your phone
   - Test touch interactions
   - Check if data updates
   - Verify layout doesn't break

## Troubleshooting

### Build Fails
```bash
# Check Node version
node --version  # Should be 18+

# Install dependencies locally first
npm install
npm run build

# If successful, push and redeploy
```

### Environment Variables Not Working
- Make sure variable name is exactly: `VITE_RAPIDAPI_KEY`
- Redeploy after adding variables
- Check deployment logs for errors

### API Rate Limit Exceeded
- Free tier: 500 requests/month
- Each sync uses 1 request
- Monitor usage in RapidAPI dashboard
- Increase `SYNC_INTERVAL` in App.tsx if needed

### Mobile Layout Broken
- Clear browser cache
- Check if CSS is loading (DevTools → Network)
- Try different mobile device sizes
- Check for JavaScript errors

## Monitoring Your App

### Railway
- Dashboard → Your Project → Metrics
- View CPU, Memory, Network usage
- Check deployment logs

### Vercel
- Dashboard → Your Project → Analytics
- View page views, performance
- Real User Monitoring available

### Netlify
- Site Overview → Analytics
- View bandwidth usage
- Check deploy status

## Updating Your App

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push

# App automatically redeploys!
```

## Custom Domain (Optional)

### Railway
1. Settings → Domains → Add Custom Domain
2. Update DNS records as shown
3. Wait for SSL certificate

### Vercel
1. Settings → Domains → Add
2. Follow DNS instructions
3. Automatic SSL

### Netlify
1. Domain Settings → Add Custom Domain
2. Configure DNS
3. Free SSL included

## Cost Estimates

All platforms offer generous free tiers:

- **Railway**: Free 500 hours/month (~$0/month for this app)
- **Vercel**: Free 100GB bandwidth/month (~$0/month)
- **Netlify**: Free 100GB bandwidth/month (~$0/month)
- **RapidAPI**: Free 500 requests/month (~$0/month)

**Total cost for hobby project: $0/month** 🎉

## Need Help?

- Check deployment logs in your platform dashboard
- Search Stack Overflow for specific errors
- Open an issue on GitHub
- Check README.md for more details

---

**Congratulations!** 🎊 Your WPL Playoff Oracle is now live!

Share the URL and start predicting matches! 🏏
