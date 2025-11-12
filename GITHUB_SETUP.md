# GitHub Setup Guide

Follow these steps to set up Git and GitHub authentication on this computer.

## Step 1: Configure Git (One-time setup)

Set your name and email (this will be used for all commits):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and the email associated with your GitHub account.

## Step 2: Choose Authentication Method

You have two options for authenticating with GitHub:

### Option A: Personal Access Token (Recommended for beginners)

1. **Create a Personal Access Token on GitHub:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name like "DetailedAnalysis Project"
   - Select expiration (90 days, or no expiration)
   - Check the `repo` scope (this gives full control of private repositories)
   - Click "Generate token"
   - **IMPORTANT**: Copy the token immediately - you won't see it again!

2. **Use the token when pushing:**
   - When you run `git push`, it will ask for username and password
   - Username: Your GitHub username
   - Password: Paste the Personal Access Token (not your GitHub password)

3. **Or store credentials (optional):**
   ```bash
   git config --global credential.helper osxkeychain
   ```
   This will save your credentials in macOS Keychain so you don't have to enter them every time.

### Option B: SSH Keys (More secure, better for long-term)

1. **Check if you already have SSH keys:**
   ```bash
   ls -al ~/.ssh
   ```
   Look for files named `id_rsa` or `id_ed25519`

2. **Generate a new SSH key (if needed):**
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```
   - Press Enter to accept default file location
   - Enter a passphrase (or leave empty for no passphrase)
   - This creates two files: `~/.ssh/id_ed25519` (private) and `~/.ssh/id_ed25519.pub` (public)

3. **Add SSH key to ssh-agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

4. **Copy your public key:**
   ```bash
   pbcopy < ~/.ssh/id_ed25519.pub
   ```
   This copies the key to your clipboard.

5. **Add the key to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Title: "MacBook" (or whatever you want)
   - Key: Paste the key from clipboard
   - Click "Add SSH key"

6. **Test the connection:**
   ```bash
   ssh -T git@github.com
   ```
   You should see: "Hi username! You've successfully authenticated..."

7. **Use SSH URL for your repository:**
   When adding the remote, use:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
   (Instead of the HTTPS URL)

## Step 3: Initialize and Push Your Repository

Once authentication is set up:

```bash
cd /Users/zinzan/Desktop/Code/DetailedAnalysis

# Initialize git (if not already done)
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: Excess Mortality Analysis web app"

# Rename branch to main (if needed)
git branch -M main

# Add your GitHub repository as remote
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Troubleshooting

### If you get "Permission denied" errors:
- Make sure you're using the Personal Access Token (not your password) if using HTTPS
- Or make sure your SSH key is added to GitHub if using SSH

### If you get "repository not found":
- Make sure you've created the repository on GitHub first
- Check that the repository name and username are correct
- Make sure you have access to the repository

### If credentials keep asking:
- For HTTPS: `git config --global credential.helper osxkeychain`
- For SSH: Make sure `ssh-add ~/.ssh/id_ed25519` was run and the key is in GitHub

## Quick Start (If you just want to get started quickly)

1. Set Git config:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. Create a Personal Access Token at https://github.com/settings/tokens

3. Initialize and push:
   ```bash
   cd /Users/zinzan/Desktop/Code/DetailedAnalysis
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
   (Use your token as the password when prompted)

