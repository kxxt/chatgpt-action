const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

async function createChatGPTAPI(sessionToken) {
  // To use ESM in CommonJS, you can use a dynamic import
  const { ChatGPTAPI } = await require("chatgpt");

  const api = new ChatGPTAPI({ sessionToken });

  // ensure the API is properly authenticated
  await api.ensureAuth();

  return api;
}

async function callChatGPT(api, content) {
  const response = await api.sendMessage(content);
  return response;
}

function genCommentPRPrompt(title, body) {
  return `Here is a pull request, please comment:\n
title: ${title}
body: ${body}
changes: `;
}

function genReviewPRPrompt(title, body, diff) {
  return `Can you tell me the problems with the following pull request and your suggestions?
title: ${title}
body: ${body}
The following diff is the changes made in this PR.
${diff}`;
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const context = github.context;
    const number = parseInt(core.getInput("number"));
    const sessionToken = core.getInput("sessionToken");
    const mode = core.getInput("mode");

    // Read PR title and body
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    // Create ChatGPT API
    const api = await createChatGPTAPI(sessionToken);

    if (mode == "pr") {
      const {
        data: { title, body },
      } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: number,
      });
      const response = await callChatGPT(api, genCommentPRPrompt(title, body));
      core.setOutput("comment", response);

      await octokit.issues.createComment({
        ...context.repo,
        issue_number: number,
        body: response,
      });
    } else if (mode == "issue") {
    } else if (mode == "review") {
      const { data: diff } = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: number,
        mediaType: {
          format: "diff",
        },
      });
      core.info(diff);
      const response = await callChatGPT(api, genReviewPRPrompt(diff));
      await octokit.issues.createComment({
        ...context.repo,
        issue_number: number,
        body: response,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
