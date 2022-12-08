const core = require("@actions/core");
const { genReviewPRPrompt, genReviewPRSplitedPrompt } = require("./prompt");
const { callChatGPT, startConversation } = require("./chatgpt");
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
    const { welcomePrompts, diffPrompts, endPrompt } = genReviewPRSplitedPrompt(
      title,
      body,
      diff,
      65536
    );
    const conversation = startConversation(api, 5);
    let cnt = 0;
    const prompts = welcomePrompts.concat(diffPrompts);
    prompts.push(endPrompt);
    for (const prompt of prompts) {
      core.info(`Sending ${prompt}`);
      const response = await conversation.sendMessage(prompt);
      core.info(`Received ${response}`);
      reply += `**ChatGPT#${++cnt}**: ${response}\n\n`;
      // Wait for 10s
      await new Promise((r) => setTimeout(r, 10000));
    }
  }
  await octokit.issues.createComment({
    ...context.repo,
    issue_number: number,
    body: reply,
  });
}

module.exports = { runPRReview };
