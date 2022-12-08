const core = require("@actions/core");
const { genReviewPRPrompt } = require("./prompt");
const { callChatGPT } = require("./chatgpt");
const { Octokit } = require("@octokit/action");
const octokit = new Octokit();

async function runPRReview({ api, repo, owner, number, context }) {
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
  const prompt = genReviewPRPrompt(title, body, diff);
  core.info(`The prompt is: ${prompt}`);
  const response = await callChatGPT(api, prompt, 5);
  await octokit.issues.createComment({
    ...context.repo,
    issue_number: number,
    body: response,
  });
}

module.exports = { runPRReview };
