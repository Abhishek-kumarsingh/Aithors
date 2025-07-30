const fs = require('fs');
const axios = require('axios');

const GITHUB_USERNAME = 'abhishek';
const REPO_NAME = 'aithor';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function updateContributors() {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contributors`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const contributors = response.data.map(contributor => 
      `<a href="${contributor.html_url}"><img src="${contributor.avatar_url}" width="50" height="50" alt="${contributor.login}" title="${contributor.login} - ${contributor.contributions} contributions"/></a>`
    ).join(' ');

    let readme = fs.readFileSync('README.md', 'utf8');
    
    const contributorsSection = `### Contributors

Thanks goes to these wonderful people:

<div align="center">

${contributors}

</div>

*Contributions: commits, issues, pull requests, and discussions.*`;

    readme = readme.replace(
      /<!-- AUTO-GENERATED-CONTENT:START \(CONTRIBUTORS\) -->[\s\S]*?<!-- AUTO-GENERATED-CONTENT:END -->/,
      `<!-- AUTO-GENERATED-CONTENT:START (CONTRIBUTORS) -->\n${contributorsSection}\n<!-- AUTO-GENERATED-CONTENT:END -->`
    );

    fs.writeFileSync('README.md', readme);
    console.log('Contributors section updated!');
  } catch (error) {
    console.error('Error updating contributors:', error.message);
  }
}

updateContributors();
