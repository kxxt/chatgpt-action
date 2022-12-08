const core = require("@actions/core");
const { genReviewPRPrompt } = require("./prompt");
const { callChatGPT } = require("./chatgpt");
const { Octokit } = require("@octokit/action");
const github = require("@actions/github");
const octokit = new Octokit();
const context = github.context;

async function runPRReview({ api, repo, owner, number, split }) {
  const {
    data: { title, body },
  } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: number,
  });
  const { data: diff } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: number,
    mediaType: {
      format: "diff",
    },
  });
  let reply;
  if (split == "yolo") {
    const prompt = genReviewPRPrompt(title, body, diff);
    core.info(`The prompt is: ${prompt}`);
    const response = await callChatGPT(api, prompt, 5);
    reply = response;
  } else {
    reply = "";
  }
  await octokit.issues.createComment({
    ...context.repo,
    issue_number: number,
    body: reply,
  });
}

module.exports = { runPRReview };
