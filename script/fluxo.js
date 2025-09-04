const qaBtn = document.getElementById("qa-manual");
const qaStatus = document.getElementById("qa-indicator");
const originalQaBtnBg = qaBtn.style.background;
let qaManualActive = false;

qaBtn.addEventListener("click", () => {
  qaManualActive = !qaManualActive;
  qaStatus.style.display = qaManualActive ? "block" : "none"; 

  if (qaManualActive) {
    qaBtn.textContent = "Desativar fluxo Manual QA inspect";
    qaBtn.style.background = "red";
    webview.addEventListener("dom-ready", () => {
      webview.executeJavaScript(`
        window.qaManualActive = true;
        window.__qaClickHandler = function(e){
          if(!window.qaManualActive) return;
          e.stopPropagation();
          e.preventDefault();
          const el = e.target;
          window.ipc.sendToHost("qa-manual", {
            acao: "click",
            elemento: { tagName: el.tagName, id: el.id, classes: el.className },
            timestamp: new Date().toISOString()
          });
        };

        window.__qaInputHandler = function (e) {
          if (!window.qaManualActive) return;
          const el = e.target;
          window.ipc.sendToHost("qa-manual", {
            acao: "input",
            elemento: { tagName: el.tagName, id: el.id, classes: el.className },
            valor: el.value,
            timestamp: new Date().toISOString()
          });
        };

        window.__qaScrollHandler = function () {
          if (!window.qaManualActive) return;
          window.ipc.sendToHost("qa-manual", {
            acao: "scroll",
            scrollY: window.scrollY,
            timestamp: new Date().toISOString()
          });
        };

        document.addEventListener('click', window.__qaClickHandler, true);
        document.addEventListener('input', window.__qaInputHandler, true);
        window.addEventListener('scroll', window.__qaScrollHandler);
     `);
      webview.addEventListener("ipc-message", (event) => {
      if (event.channel === "qa-manual") {
        const payload = event.args[0];
        console.log("Evento QA Manual recebido:", event.args[0]);
        window.electronAPI.sendEvent(payload);
        }
      });
    });
  } else {
    qaBtn.textContent = "Ativar fluxo Manual QA inspect";
    qaBtn.style.background = originalQaBtnBg;
    webview.executeJavaScript(`
      (() => {
        window.qaManualActive = false;

        // Remove listeners ao desativar
        if(window.__qaClickHandler) {
          document.removeEventListener('click', window.__qaClickHandler, true);
          window.__qaClickHandler = null;
        }
        if(window.__qaInputHandler) {
          document.removeEventListener('input', window.__qaInputHandler, true);
          window.__qaInputHandler = null;
        }
        if(window.__qaScrollHandler) {
          window.removeEventListener('scroll', window.__qaScrollHandler);
          window.__qaScrollHandler = null;
        }
      })();
    `);
  }
});

// Recebe os eventos do webview
window.addEventListener("message", (event) => {
  if(event.data.type === "qa-manual"){
    window.electronAPI.sendQAEvent(event.data.data);
  }
});
