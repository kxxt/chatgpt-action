async function createChatGPTAPI(sessionToken) {
  // To use ESM in CommonJS, you can use a dynamic import
  const { ChatGPTAPI } = await import("chatgpt");

  const api = new ChatGPTAPI({ sessionToken });

  // ensure the API is properly authenticated
  await api.ensureAuth();

  return api;
}

function is503Error(err) {
  return toString(err).includes("503");
}

async function callChatGPT(api, content, retryOn503) {
  let cnt = 0;
  while (cnt++ <= retryOn503) {
    try {
      const response = await api.sendMessage(content);
      return response;
    } catch (err) {
      if (!is503Error(err)) throw err;
    }
  }
}

async function startConversation(api, retryOn503) {
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
          if (!is503Error(err)) throw err;
        }
      }
    },
  };
}

module.exports = { createChatGPTAPI, callChatGPT, startConversation };
