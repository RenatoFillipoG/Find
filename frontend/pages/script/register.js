import { showToast } from "../../index.js";

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameValue = document.getElementById("name").value;
  const emailValue = document.getElementById("email").value;
  const passwordValue = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameValue,
        email: emailValue,
        password: passwordValue,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      showToast("Conta criada com sucesso! Redirecionando...", "success");

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 2500);
    } else {
      showToast(data.message || "Erro ao cadastrar", "error");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    showToast("Erro de conexão com o servidor", "error");
  }
});
