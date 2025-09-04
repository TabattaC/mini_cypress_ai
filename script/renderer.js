/**
 * Este módulo controla a interface do usuário do app.
 * 
 * Principais funções:
 * - Abre o site informado pelo usuário no webview. 
 *   O webview é um componente que permite exibir páginas web dentro do app, como se fosse um navegador.
 * - Ativa/desativa o modo de seleção de elementos na página.
 * - Destaca elementos ao passar o mouse e envia o DOM do elemento selecionado para o backend.
 * - Alterna entre tema claro e escuro.
 * - Exibe o XPath gerado para o elemento selecionado.
 */

const webview = document.getElementById('site');
const openBtn = document.getElementById('open');
const selectBtn = document.getElementById('select');
const domDisplay = document.getElementById('dom-display');
const indicator = document.getElementById("selection-indicator");


let selectionActive = false;

webview.addEventListener("console-message", (e) => {
  console.log("Webview log:", e.message);
});

openBtn.addEventListener('click', () => {
  const url = document.getElementById('url').value;
  webview.src = url;
});

selectBtn.addEventListener('click', () => {
  if (!selectionActive) {
    webview.executeJavaScript(`
      (() => {
        function clickHandler(e) {
          e.preventDefault();
          e.stopPropagation();
          const el = e.target;
          const elementDOM = el.outerHTML;

          let ancestors = [];
          let current = el;
          while (current) {
            ancestors.unshift({
              tag: current.tagName.toLowerCase(),
              id: current.id || null,
              class: current.className || null,
              attrs: Array.from(current.attributes).map(a => ({ name: a.name, value: a.value }))
            });
            current = current.parentElement;
          }

          const payload = { html: el.outerHTML, ancestors };
          window.electronAPI.sendElement(payload);
        }


        document.querySelectorAll("*").forEach(el => {
          if (!el.hasAttribute("data-listener")) {
            el.addEventListener("click", clickHandler, true);
            el.setAttribute("data-listener", "true");
          }
        });

        const observer = new MutationObserver(() => {
          document.querySelectorAll("*").forEach(el => {
            if (!el.hasAttribute("data-listener")) {
              el.addEventListener("click", clickHandler, true);
              el.setAttribute("data-listener", "true");
            }
          });
        });
        observer.observe(document.body, { childList: true, subtree: true });

    
        window.__highlightHandler = function(e) { e.target.style.outline = "2px solid red"; };
        window.__unhighlightHandler = function(e) { e.target.style.outline = ""; };
        document.body.addEventListener("mouseover", window.__highlightHandler);
        document.body.addEventListener("mouseout", window.__unhighlightHandler);

        window.__clickHandler = clickHandler; // salva referência para remover depois
      })();
    `);
    selectionActive = true;
    selectBtn.textContent = "Desativar Seleção";
    selectBtn.style.background = "red";
    selectBtn.style.color = "white";
    indicator.style.display = "block";
  } else {
    webview.executeJavaScript(`
      if (window.__highlightHandler) {
        document.body.removeEventListener("mouseover", window.__highlightHandler);
        document.body.removeEventListener("mouseout", window.__unhighlightHandler);
        window.__highlightHandler = null;
        window.__unhighlightHandler = null;
      }
      if (window.__clickHandler) {
        document.querySelectorAll("*").forEach(el => {
          el.removeEventListener("click", window.__clickHandler, true);
          el.removeAttribute("data-listener");
        });
        window.__clickHandler = null;
      }
    `);

    selectionActive = false;
    selectBtn.textContent = "Ativar Seleção";
    selectBtn.style.background = "";
    selectBtn.style.color = "";
    indicator.style.display = "none";
  }
});


