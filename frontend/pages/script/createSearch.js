import { showToast } from "../../index.js";

const form = document.getElementById("create-search-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("userToken");

  if (!token) {
    showToast("Você precisa estar logado para criar um anúncio!");
    window.location.href = "login.html";
    return;
  }

  const formData = new FormData(form);

  try {
    const response = await fetch("http://localhost:3000/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      showToast("Pet cadastrado com sucesso!");
      window.location.href = "home.html";
    } else {
      showToast("Erro: " + data.message);
    }
  } catch (error) {
    console.error("Erro ao enviar:", error);
    showToast("Erro na conexão com o servidor.");
  }
});

const fileInput = document.getElementById("img");
const fileLabel = document.getElementById("file-label");
const fileNameDisplay = document.getElementById("file-name");

if (fileInput) {
  fileInput.addEventListener("change", function () {
    if (this.files && this.files.length > 0) {
      const fileName = this.files[0].name;

      fileLabel.innerHTML = '<i class="icon-check"></i> Imagem Adicionada!';
      fileLabel.style.backgroundColor = "#2ecc71";
      fileLabel.style.color = "white";

      fileNameDisplay.innerText = `Arquivo: ${fileName}`;

      if (typeof showToast === "function") {
        showToast("Imagem carregada com sucesso!");
      }
    }
  });
}
