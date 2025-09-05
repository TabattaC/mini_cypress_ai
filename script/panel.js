window.electronAPI.onElementSelected((data) => {
  const resultsContainer = document.getElementById("results");

  // cria um card para o XPath
  const item = document.createElement("div");
  item.classList.add("xpath-item");

  // header com título
  const header = document.createElement("div");
  header.classList.add("xpath-header");
  header.textContent = "XPath Sugerido";

  // conteúdo (XPath do modelo)
  const content = document.createElement("div");
  content.classList.add("xpath-content");
  content.textContent = data.xpath || "Erro ao gerar XPath";
  content.style.display = "none"; // começa fechado

  // abre/fecha ao clicar no card inteiro (header + content)
  item.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-btn")) return; // ignora click no fechar
    const isOpen = content.style.display === "block";
    content.style.display = isOpen ? "none" : "block";
    item.classList.toggle("expanded", !isOpen);
  });

  // botão fechar
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    item.remove();
  });

  // monta o card
  header.appendChild(closeBtn);
  item.appendChild(header);
  item.appendChild(content);
  resultsContainer.appendChild(item);
});
