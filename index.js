const core = require("@actions/core");

const { createChatGPTAPI } = require("./chatgpt");
const { runPRReview } = require("./run");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const number = parseInt(core.getInput("number"));
    const sessionToken = core.getInput("sessionToken");
    const mode = core.getInput("mode");
    const split = core.getInput("split");

    // Get current repo.
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    // Create ChatGPT API
    const api = await createChatGPTAPI(sessionToken);

    if (mode == "pr") {
      runPRReview({ api, owner, repo, number, split });
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
