window.electronAPI.onElementSelected((data) => {
  const resultsContainer = document.getElementById("results");

  // cria um card para o XPath
  const item = document.createElement("div");
  item.classList.add("xpath-item");

  // header com seta e título
  const header = document.createElement("div");
  header.classList.add("xpath-header");
  header.innerHTML = `
    <span>XPath sugerido</span>
    <span class="arrow">▶</span>
  `;

  // conteúdo (XPath do modelo)
  const content = document.createElement("div");
  content.classList.add("xpath-content");
  content.textContent = data.xpath || "Erro ao gerar XPath";

  // toggle expand/collapse
  header.addEventListener("click", () => {
    item.classList.toggle("expanded");
    const arrow = header.querySelector(".arrow");
    arrow.textContent = item.classList.contains("expanded") ? "▼" : "▶";
  });

  // monta o painel
  item.appendChild(header);
  item.appendChild(content);
  resultsContainer.appendChild(item);
});
