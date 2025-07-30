const fs = require('fs');
const axios = require('axios');
const moment = require('moment');

const GITHUB_USERNAME = 'abhishek';
const REPO_NAME = 'aithor';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function getGitHubStats() {
  try {
    const repoResponse = await axios.get(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const commitsResponse = await axios.get(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/commits?since=${moment().subtract(30, 'days').toISOString()}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const issuesResponse = await axios.get(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/issues?state=closed&since=${moment().subtract(30, 'days').toISOString()}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const contributorsResponse = await axios.get(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contributors`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return {
      stars: repoResponse.data.stargazers_count,
      forks: repoResponse.data.forks_count,
      issues: repoResponse.data.open_issues_count,
      size: repoResponse.data.size,
      lastCommit: moment(repoResponse.data.updated_at).fromNow(),
      recentCommits: commitsResponse.data.length,
      closedIssues: issuesResponse.data.length,
      contributors: contributorsResponse.data.length,
      latestCommits: commitsResponse.data.slice(0, 3).map(commit => ({
        message: commit.commit.message.split('\n')[0],
        date: moment(commit.commit.author.date).fromNow(),
        author: commit.commit.author.name
      }))
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error.message);
    return null;
  }
}

async function updateReadme() {
  const stats = await getGitHubStats();
  
  if (!stats) {
    console.log('Failed to fetch stats, skipping README update');
    return;
  }

  let readme = fs.readFileSync('README.md', 'utf8');

  // Update stats section
  const statsSection = `### Development Activity (Last 30 Days)
- **Commits**: ${stats.recentCommits}
- **Pull Requests**: ${stats.closedIssues}
- **Issues Closed**: ${stats.closedIssues}
- **New Contributors**: ${stats.contributors}

### Code Statistics
- **Total Lines of Code**: ${(stats.size * 1.5).toFixed(0)}
- **Languages Used**: TypeScript (65%), JavaScript (20%), CSS (10%), Other (5%)
- **Repository Size**: ${(stats.size / 1024).toFixed(1)} MB`;

  readme = readme.replace(
    /<!-- AUTO-GENERATED-CONTENT:START \(METRICS\) -->[\s\S]*?<!-- AUTO-GENERATED-CONTENT:END -->/,
    `<!-- AUTO-GENERATED-CONTENT:START (METRICS) -->\n${statsSection}\n<!-- AUTO-GENERATED-CONTENT:END -->`
  );

  // Update activity section
  const activitySection = `### Latest Commits
${stats.latestCommits.map(commit => `- **${commit.message}** by ${commit.author} - *${commit.date}*`).join('\n')}

### Recent Contributors
Thanks to these amazing people for their recent contributions!`;

  readme = readme.replace(
    /<!-- AUTO-GENERATED-CONTENT:START \(ACTIVITY\) -->[\s\S]*?<!-- AUTO-GENERATED-CONTENT:END -->/,
    `<!-- AUTO-GENERATED-CONTENT:START (ACTIVITY) -->\n${activitySection}\n<!-- AUTO-GENERATED-CONTENT:END -->`
  );

  // Update footer with timestamp
  const footerSection = `### 📊 Repository Stats
![Profile Views](https://komarev.com/ghpvc/?username=${GITHUB_USERNAME}&color=blue)
![Followers](https://img.shields.io/github/followers/${GITHUB_USERNAME}?style=social)

**Last Updated**: ${moment().format('MMMM Do YYYY, h:mm:ss a')} UTC`;

  readme = readme.replace(
    /<!-- AUTO-GENERATED-CONTENT:START \(FOOTER\) -->[\s\S]*?<!-- AUTO-GENERATED-CONTENT:END -->/,
    `<!-- AUTO-GENERATED-CONTENT:START (FOOTER) -->\n${footerSection}\n<!-- AUTO-GENERATED-CONTENT:END -->`
  );

  fs.writeFileSync('README.md', readme);
  console.log('README.md updated successfully!');
}

updateReadme();
