const axios = require("axios");

class MistralClient {
  constructor(model = "mistral:latest", baseUrl = "http://localhost:11434/api/generate") {
    this.model = model;
    this.baseUrl = baseUrl;
  }

  async ask(systemMessage, userPrompt) {
    const promptText = `SYSTEM: ${systemMessage}\nUSER: ${userPrompt}`;

    const payload = {
      model: this.model,
      prompt: promptText,
      stream: false
    };

    try {

      const response = await axios.post(this.baseUrl, payload);
      return response.data?.response || "";
    } catch (error) {
      console.error("Erro ao chamar modelo: ", error.message);
      throw error;
    }
  }
}

module.exports = MistralClient;
