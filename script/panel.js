window.electronAPI.onElementSelected((data) => {
  const resultsContainer = document.getElementById("results");


  const item = document.createElement("div");
  item.classList.add("xpath-item");


  const header = document.createElement("div");
  header.classList.add("xpath-header");
  header.textContent = "XPath Sugerido";

  const content = document.createElement("div");
  content.classList.add("xpath-content");
  content.textContent = data.xpath || "Erro ao gerar XPath";
  content.style.display = "none"; // começa fechado

  item.addEventListener("click", (e) => {
    if (e.target.classList.contains("close-btn")) return; 
    const isOpen = content.style.display === "block";
    content.style.display = isOpen ? "none" : "block";
    item.classList.toggle("expanded", !isOpen);
  });

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    item.remove();
  });


  header.appendChild(closeBtn);
  item.appendChild(header);
  item.appendChild(content);
  resultsContainer.appendChild(item);
});
