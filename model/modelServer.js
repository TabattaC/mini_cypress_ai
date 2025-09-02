/**
 * Este módulo cria um servidor que conversa com o modelo de IA (Mistral).
 * 
 * O que ele faz:
 * Recebe requisições HTTP (POST) com o DOM de um elemento.
 * Junta esse DOM com um texto base (prompt) para enviar ao modelo de IA.
 * Usa o modelo Mistral para analisar o elemento e gerar uma resposta.
 * Devolve a resposta para quem fez a requisição.

 */


const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const MistralClient = require("./mistralClient");

const app = express();
app.use(bodyParser.json());

const client = new MistralClient();

app.post("/process-element", async (req, res) => {
  try {
    const { elementDOM } = req.body;
    const promptBase = fs.readFileSync("./prompt/prompt_inicial.txt", "utf-8");
    const finalPrompt = `${promptBase}\n\n--- DOM do elemento selecionado ---\n${elementDOM}\n`;
    const response = await client.ask(promptBase, finalPrompt);
    res.json({ response });

  } catch (err) {
    console.error("Erro ao processar DOM:", err);
    res.status(500).json({ error: "Erro ao chamar o modelo" });
  }
});

app.listen(4000, () => console.log("ModelServer rodando em http://localhost:4000"));
