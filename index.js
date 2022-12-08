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

function genReviewPRPrompt(title, body, diff) {
  const prompt = `Can you tell me the problems with the following pull request and describe your suggestions? 
title: ${title}
body: ${body}
The following diff is the changes made in this PR.
${diff}`;
  return prompt;
}

// most @actions toolkit packages have async methods
function run() {
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
      } = await octokit.pull.get({
        owner,
        repo,
        pull_number: number,
      });
      const { data: diff } = await octokit.rest.pull.get({
        owner,
        repo,
        pull_number: number,
        mediaType: {
          format: "diff",
        },
      });
      const prompt = genReviewPRPrompt(title, body, diff);
      core.info(`The prompt is: ${prompt}`);
      try {
        const response = await callChatGPT(api, prompt);
        await octokit.issues.createComment({
          ...context.repo,
          issue_number: number,
          body: response,
        });
      } catch(error) {
        core.setFailed(JSON.stringify(error))
      }
      
      
    } else if (mode == "issue") {
      throw "Not implemented!";
    } else {
      throw `Invalid mode ${mode}`;
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
