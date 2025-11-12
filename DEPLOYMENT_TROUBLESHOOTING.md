# GitHub Pages Deployment Troubleshooting

## Step 1: Enable GitHub Pages in Repository Settings

This is the most common issue! You need to enable GitHub Pages first:

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions** (NOT "Deploy from a branch")
5. Click **Save**

## Step 2: Check GitHub Actions Permissions

1. In the same **Settings** page
2. Go to **Actions** → **General**
3. Under **Workflow permissions**, make sure:
   - "Read and write permissions" is selected
   - "Allow GitHub Actions to create and approve pull requests" is checked (optional)

## Step 3: Re-run the Workflow

After enabling GitHub Pages:

1. Go to **Actions** tab in your repository
2. Find the failed workflow run
3. Click on it
4. Click **Re-run all jobs** (or **Re-run failed jobs**)

Or simply push a new commit:
```bash
git add .
git commit -m "Fix deployment"
git push
```

## Step 4: Check the Workflow Logs

If it still fails:

1. Go to **Actions** tab
2. Click on the failed workflow
3. Click on the **deploy** job
4. Expand each step to see error messages
5. Common errors:
   - "Environment not found" → Make sure GitHub Pages is enabled (Step 1)
   - "Permission denied" → Check permissions (Step 2)
   - "Path not found" → The workflow should work with path: '.'

## Alternative: Manual Deployment (If Actions Don't Work)

If GitHub Actions continues to fail, you can use the simpler branch-based deployment:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: **main** (or **master**)
4. Folder: **/ (root)**
5. Click **Save**

This will automatically deploy from your main branch without needing Actions.

## Verify Your Site is Live

Once deployed successfully:
- Your site URL will be: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- It may take 1-2 minutes after deployment completes
- Check the **Pages** section in Settings to see the URL

