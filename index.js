const core = require("@actions/core");
const github = require("@actions/github");

const { createChatGPTAPI } = require("./chatgpt");
const { runPRReview } = require("./run");

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
      runPRReview({ api, owner, repo, number, context });
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
