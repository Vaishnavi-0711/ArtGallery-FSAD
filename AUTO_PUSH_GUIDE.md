# Automatic Git Push - Setup Guide

This guide explains how to automatically push changes to GitHub.

## 3 Ways to Push Changes

### 1. **NPM Script (Quick & Easy)** ✨ RECOMMENDED

Push all changes with one command:

```bash
npm run push
```

This automatically:
- Stages all changes (`git add .`)
- Creates a commit with message "Auto: Update changes"
- Pushes to main branch

**Or push with a custom message:**

```bash
npm run push-with-message "Your commit message here"
```

### 2. **Helper Scripts (Windows/Mac/Linux)**

**Windows (PowerShell or CMD):**
```bash
./push.bat "Your commit message"
```

**Mac/Linux (Bash):**
```bash
./push.sh "Your commit message"
```

Example:
```bash
./push.bat "Add dark mode feature"
```

### 3. **GitHub Actions (Fully Automatic)** 🚀

Every time you push to GitHub, automatic CI/CD runs:

✅ **Builds frontend**  
✅ **Runs tests**  
✅ **Deploys to Vercel** (if configured)  
✅ **Shows build status**

**Setup (One-time):**

1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Add these secrets (for Vercel auto-deploy):
   - `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` - From your Vercel account
   - `VERCEL_PROJECT_ID` - From your Vercel project settings

4. Push any code change - GitHub Actions runs automatically!

**View CI/CD Status:**
- Go to your repository
- Click **Actions** tab
- See all build/deploy runs
- Each push shows build logs

## Workflow Examples

### Scenario 1: Quick Daily Updates
```bash
# Make changes...
npm run push
# Done! Changes are on GitHub
```

### Scenario 2: Meaningful Commits
```bash
# Make changes...
./push.bat "Update artwork gallery component"
# Changes pushed with descriptive message
```

### Scenario 3: Using GitHub Web UI
```bash
# Make local changes
git add .
git commit -m "Refactor API service"
git push origin main
# GitHub Actions automatically runs CI/CD
```

## Check Push Status

```bash
# See current git status
npm run status

# View git log (recent commits)
git log --oneline -10

# View branches
git branch -a
```

## Troubleshooting

### "Push failed - Authentication error"
- Verify GitHub credentials are saved
- Check if token expired
- Use: `git credential fill` to reset auth

### "Push failed - Branch diverged"
```bash
git pull origin main    # Get latest changes
git push origin main    # Push your changes
```

### "Nothing to commit"
- Make sure you have unsaved changes
- Check `npm run status` to see what changed

### GitHub Actions not running
- Push must be to `main` branch
- Check repository Settings → Actions → Permissions
- Ensure workflow file is in `.github/workflows/`

## Disable Auto-Deploy (Optional)

If you don't want Vercel to auto-deploy, remove or disable the deploy step in `.github/workflows/ci-cd.yml`

## Best Practices

1. **Commit frequently** - Easier to track changes
2. **Use meaningful messages** - Helps future you understand changes
3. **Pull before push** - Avoid conflicts
   ```bash
   git pull origin main
   npm run push
   ```
4. **Test before push** - Run `npm run build` first
5. **Review on GitHub** - Check Actions tab for build status

## Quick Commands Reference

| Command | What it does |
|---------|-------------|
| `npm run push` | Push with default message |
| `npm run status` | Show git status |
| `git log --oneline -5` | Show last 5 commits |
| `git pull origin main` | Get latest from GitHub |
| `git diff` | See what changed locally |
| `./push.bat "msg"` | Windows: push with custom message |
| `./push.sh "msg"` | Mac/Linux: push with custom message |

## Next Steps

1. Make a test change to any file
2. Run `npm run push` 
3. Go to GitHub and verify your change appeared
4. Click **Actions** tab to see CI/CD run
5. If Vercel is configured, your site auto-updates! 🎉

---

That's it! You now have multiple ways to automatically push and deploy your code.
