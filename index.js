const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/action");

const octokit = new Octokit();

async function createChatGPTAPI(sessionToken) {
  // To use ESM in CommonJS, you can use a dynamic import
  const { ChatGPTAPI } = await import("chatgpt");

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
  return `Please comment on the following pull request:\n
PR title: ${title}
PR body: ${body}`;
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const context = github.context;
    const pr = parseInt(core.getInput("pr"));
    const sessionToken = core.getInput("sessionToken");

    // Read PR title and body
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    const {
      data: { title, body },
    } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pr,
    });
    core.info(`title: ${title}`);
    core.info(`body:  ${body}`);
    // Create ChatGPT API
    const api = await createChatGPTAPI(sessionToken);

    const response = await callChatGPT(api, genCommentPRPrompt(title, body));
    core.setOutput("comment", response);

    await octokit.issues.createComment({
      ...context.repo,
      issue_number: pr,
      body: response,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
