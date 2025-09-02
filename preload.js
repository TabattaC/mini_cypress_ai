/**
 * Este módulo conecta o frontend (renderer.js) com o backend (main.js) no Electron.
 * 
 * Usa dois recursos do Electron:
 * contextBridge: Permite expor funções específicas do backend para o frontend de forma segura.
 * ipcRenderer: : Permite enviar e receber mensagens entre o frontend e o backend.
 * 
 * Cria uma API chamada 'electronAPI' que pode ser usada no navegador,
 * permitindo enviar e receber dados de forma segura entre as duas partes do app.
 * 
 * Métodos disponíveis:
 * - sendElement(payload): Envia informações do elemento selecionado para o backend.
 * - onElementSelected(callback): Recebe informações do backend quando um elemento é selecionado.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendElement: (payload) => ipcRenderer.send('element-selected', payload),
  onElementSelected: (callback) =>ipcRenderer.on('element-selected', (event, data) => callback(data))
});
 