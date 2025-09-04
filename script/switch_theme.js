const toggleThemeBtn = document.getElementById('toggle-theme');

document.body.classList.remove('light'); 

toggleThemeBtn.addEventListener('click', () => {
  if (document.body.classList.contains('dark')) {
    // Se já está escuro → volta para claro
    document.body.classList.remove('dark');
    toggleThemeBtn.textContent = 'Tema Escuro';
  } else {
    // Se está claro → ativa escuro
    document.body.classList.add('dark');
    toggleThemeBtn.textContent = 'Tema Claro';
  }
});


// window.electronAPI.onElementSelected((data) => {
//   const domDisplay = document.getElementById('dom-display');
//   domDisplay.textContent = `XPath:\n${data.xpath}`;
// });