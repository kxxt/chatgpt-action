const core = require("@actions/core");

async function createChatGPTAPI(sessionToken) {
  // To use ESM in CommonJS, you can use a dynamic import
  const { ChatGPTAPI } = await import("chatgpt");

  const api = new ChatGPTAPI({ sessionToken });

  // ensure the API is properly authenticated
  await api.ensureAuth();

  return api;
}

async function callChatGPT(api, content, retryOn503) {
  let cnt = 0;
  while (cnt++ <= retryOn503) {
    try {
      const response = await api.sendMessage(content);
      return response;
    } catch (err) {
      if (!toString(err).includes("503")) throw err;
    }
  }
}

function startConversation(api, retryOn503) {
  const conversation = api.getConversation();
  return {
    conversation,
    retryOn503,
    async sendMessage(message) {
      let cnt = 0;
      while (cnt++ <= retryOn503) {
        try {
          const response = await conversation.sendMessage(message);
          return response;
        } catch (err) {
          core.warning("Got 503, sleep for 10s now!");
          if (!toString(err).includes("503")) throw err;
          await new Promise((r) => setTimeout(r, 10000));
        }
      }
    },
  };
}

module.exports = { createChatGPTAPI, callChatGPT, startConversation };
