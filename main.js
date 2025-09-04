const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const MistralClient = require("./model/mistralClient");
const fs = require("fs");
const promptFile = path.join(__dirname, "./prompt/prompt_inicial.txt");
const mistral = new MistralClient();

let systemMessage = "";
let mainWindow;

try {
  systemMessage = fs.readFileSync(promptFile, "utf-8");
  console.log("✅ prompt_inicial.txt carregado com sucesso.");
} catch (err) {
  console.error("❌ Erro ao carregar prompt_inicial.txt:", err.message);
}


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


ipcMain.on('element-selected', async (event, elementData) => {
  console.log("Elemento selecionado no Main:", elementData);

  if (!elementData || !elementData.html) {
    console.warn("⚠️ elementData ou elementData.html está vazio:", elementData);
    return;
  }

  try {
    const userPrompt = "DOM do elemento selecionado: " + elementData.html;
    const responseText = await mistral.ask(systemMessage, userPrompt);

    console.log("Resposta do modelo (texto):", responseText);

    mainWindow.webContents.send('element-selected', {
      ...elementData,
      xpath: responseText 
    });

  } catch (err) {
    console.error("Erro ao chamar modelo:", err);
    mainWindow.webContents.send('element-selected', {
      ...elementData,
      modelResponse: { selectors: [], raw: err.message }
    });
  }
});

