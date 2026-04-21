import { showToast } from "../../index.js";

const form = document.getElementById("login-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userName", data.user.name);

      window.location.href = "home.html";
    } else {
      showToast(data.message || "Erro ao fazer login");
    }
  } catch (error) {
    console.error("Erro:", error);
    showToast("Servidor fora do ar!");
  }
});

const btnRecruiter = document.getElementById("btn-recruiter");

if (btnRecruiter) {
  btnRecruiter.addEventListener("click", async () => {
    const recruiterData = {
      email: "recrutador@email.com",
      password: "recrutador123",
    };

    document.getElementById("email").value = recruiterData.email;
    document.getElementById("password").value = recruiterData.password;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recruiterData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("userToken", result.token);
        localStorage.setItem("userName", result.user.name);

        window.location.href = "home.html";
      } else {
        showToast("Erro: A conta de recrutador ainda não foi criada no banco.");
      }
    } catch (error) {
      console.error("Erro no login automático:", error);
      showToast("Erro ao conectar com o servidor.");
    }
  });
}
