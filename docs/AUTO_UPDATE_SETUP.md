# Auto-Updating README Setup Guide

This document explains how to set up the auto-updating README functionality for your Aithor project.

## 🚀 What's Been Set Up

### 1. Auto-Updating README.md
- ✅ Modern, professional README with auto-updating sections
- ✅ Project stats, recent activity, and contributor information
- ✅ Responsive badges and professional styling
- ✅ Auto-generated timestamps and metrics

### 2. GitHub Actions Workflows
- ✅ **CI/CD Pipeline** (`.github/workflows/ci.yml`)
- ✅ **README Auto-Update** (`.github/workflows/update-readme.yml`)
- ✅ **Automated Testing** and deployment

### 3. Auto-Update Scripts
- ✅ **README Stats Update** (`.github/scripts/update-readme.js`)
- ✅ **Contributors Update** (`.github/scripts/update-contributors.js`)
- ✅ **Package.json Scripts** for manual updates

### 4. GitHub Templates
- ✅ **Bug Report Template** (`.github/ISSUE_TEMPLATE/bug_report.md`)
- ✅ **Feature Request Template** (`.github/ISSUE_TEMPLATE/feature_request.md`)
- ✅ **Pull Request Template** (`.github/PULL_REQUEST_TEMPLATE.md`)

### 5. Contributing Guidelines
- ✅ **CONTRIBUTING.md** with comprehensive guidelines
- ✅ **Code standards** and development workflow
- ✅ **Community guidelines** and support information

## 🔧 Setup Instructions

### Step 1: GitHub Repository Setup

1. **Push all files to GitHub**:
   ```bash
   git add .
   git commit -m "feat: add auto-updating README and GitHub workflows"
   git push origin main
   ```

2. **Update repository settings**:
   - Go to your GitHub repository
   - Update the repository name to `aithor`
   - Add repository description: "AI-Powered Interview Platform"
   - Add topics: `ai`, `interview`, `nextjs`, `typescript`, `mongodb`

### Step 2: GitHub Secrets Configuration

Add these secrets in GitHub Settings > Secrets and variables > Actions:

```bash
# Required for README auto-updates
GITHUB_TOKEN=your_github_personal_access_token

# Optional for CI/CD (if using Vercel)
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_vercel_org_id
PROJECT_ID=your_vercel_project_id

# Optional for test coverage
CODECOV_TOKEN=your_codecov_token
```

### Step 3: GitHub Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic) with these permissions:
   - `repo` (Full control of private repositories)
   - `read:user` (Read user profile data)
   - `user:email` (Access user email addresses)
3. Copy the token and add it as `GITHUB_TOKEN` secret

### Step 4: Enable GitHub Actions

1. Go to repository Settings > Actions > General
2. Set "Actions permissions" to "Allow all actions and reusable workflows"
3. Set "Workflow permissions" to "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"

### Step 5: Update Repository URLs

Update these files with your actual GitHub username:

1. **README.md**: Replace `abhishek` with your GitHub username
2. **Scripts**: Update `GITHUB_USERNAME` in `.github/scripts/update-readme.js`
3. **Workflows**: Update repository references in workflow files

## 📊 Auto-Update Features

### Daily Updates (Automatic)
- Repository statistics (stars, forks, issues)
- Recent commit activity
- Contributor information
- Last updated timestamp

### Manual Updates
```bash
# Update README stats
npm run readme:update

# Update contributors section
npm run readme:contributors

# Validate README links
npm run readme:validate
```

### Auto-Generated Sections

The README includes these auto-updating sections:

1. **Project Stats** - GitHub badges and metrics
2. **Recent Activity** - Latest commits and contributors
3. **Project Metrics** - Development activity and code statistics
4. **Contributors** - Contributor avatars and information
5. **Footer Stats** - Profile views and last updated timestamp

## 🎯 Customization

### Update Repository Information

1. **Repository Name**: Change `aithor` to your repository name
2. **GitHub Username**: Change `abhishek` to your username
3. **Live Demo URL**: Update with your deployment URL
4. **Contact Information**: Update email and social links

### Modify Auto-Update Frequency

Edit `.github/workflows/update-readme.yml`:

```yaml
on:
  schedule:
    # Change this cron expression
    - cron: '0 0 * * *'  # Daily at midnight
    # Examples:
    # - cron: '0 */6 * * *'  # Every 6 hours
    # - cron: '0 0 * * 1'    # Weekly on Monday
```

### Add Custom Metrics

Edit `.github/scripts/update-readme.js` to add custom metrics:

```javascript
// Add custom API calls
const customMetrics = await getCustomMetrics();

// Update README sections
const customSection = `### Custom Metrics
- **Metric 1**: ${customMetrics.value1}
- **Metric 2**: ${customMetrics.value2}`;
```

## 🔍 Troubleshooting

### Common Issues

1. **GitHub Token Error (401)**:
   - Ensure `GITHUB_TOKEN` secret is set correctly
   - Check token permissions include `repo` access

2. **Workflow Not Running**:
   - Check GitHub Actions are enabled
   - Verify workflow permissions are set to "Read and write"

3. **README Not Updating**:
   - Check workflow logs in Actions tab
   - Ensure auto-generated content markers are present

### Debug Commands

```bash
# Test README update locally (requires GITHUB_TOKEN env var)
GITHUB_TOKEN=your_token npm run readme:update

# Validate README links
npm run readme:validate

# Check workflow syntax
# Use GitHub's workflow validator in the Actions tab
```

## 📈 Benefits

### Professional Appearance
- Modern, responsive README design
- Professional badges and statistics
- Consistent branding and styling

### Community Engagement
- Easy contribution process
- Clear issue and PR templates
- Automated contributor recognition

### Maintenance Efficiency
- Automated updates reduce manual work
- Consistent information across repository
- Professional project presentation

## 🚀 Next Steps

1. **Push to GitHub** and verify workflows run
2. **Test auto-updates** by making commits
3. **Customize content** for your specific project
4. **Add custom metrics** as needed
5. **Monitor and maintain** the automation

Your Aithor project now has a professional, auto-updating GitHub presence! 🎉
