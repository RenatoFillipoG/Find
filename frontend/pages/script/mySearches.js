import { showToast } from "../../index.js";

const container = document.getElementById("my-pets-list");

async function loadMySearches() {
  const token = localStorage.getItem("userToken");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("https://find-zga8.onrender.com/my-searches", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Falha ao carregar anúncios");

    const pets = await response.json();

    if (pets.length === 0) {
      container.innerHTML =
        "<p class='loading'>Você ainda não publicou nenhum anúncio.</p>";
      return;
    }

    container.innerHTML = pets
      .map(
        (pet) => `
            <div class="card">
                <img src="https://find-zga8.onrender.com/uploads/${pet.img}" alt="${pet.surname}">
                <div class="card-info">
                    <h3 class="surname">${pet.surname}</h3>
                    <p class="zone"><i class="icon-location"></i> ${pet.community} - ${pet.city}</p>
                <div class="card-actions">
                <button class="btn-edit" onclick='openEditModal(${JSON.stringify(pet)})'>
                    Editar
                </button>
                <button class="button-delete" onclick="deletePet(${pet.id})">
                    Excluir
                </button>
            </div>
                </div>
            </div>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Erro:", error);
    container.innerHTML =
      "<p class='loading'>Erro ao conectar com o servidor.</p>";
  }
}

async function deletePet(id) {
  if (!confirm("O pet foi encontrado ou você deseja remover o anúncio?"))
    return;

  const token = localStorage.getItem("userToken");

  try {
    const response = await fetch(`https://find-zga8.onrender.com/search/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      showToast("Anúncio removido com sucesso!");
      loadMySearches();
    } else {
      showToast("Erro ao remover o anúncio.");
    }
  } catch (error) {
    showToast("Erro de conexão.");
  }
}

loadMySearches();

function displayPets(pets) {
  const container = document.getElementById("my-pets-list");
  container.innerHTML = pets
    .map(
      (pet) => `
        <div class="card">
            <img src="https://find-zga8.onrender.com/uploads/${pet.img}" alt="${pet.surname}">
            <div class="card-info">
                <h3 class="surname">${pet.surname}</h3>
                <p class="zone">${pet.community} - ${pet.city}</p>
                <div class="card-buttons">
                    <button class="btn-edit" onclick='openEditModal(${JSON.stringify(pet)})'>Editar</button>
                    <button class="button-delete" onclick="deletePet(${pet.id})">Excluir</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function openEditModal(pet) {
  document.getElementById("edit-modal").style.display = "flex";
  document.getElementById("edit-id").value = pet.id;
  document.getElementById("edit-surname").value = pet.surname;
  document.getElementById("edit-city").value = pet.city;
  document.getElementById("edit-community").value = pet.community || "";
  document.getElementById("edit-contact").value = pet.contact || "";
  document.getElementById("edit-description").value = pet.description || "";
}

function closeModal() {
  document.getElementById("edit-modal").style.display = "none";
}

document.getElementById("edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("edit-id").value;
  const token = localStorage.getItem("userToken");

  const formData = new FormData();
  formData.append("surname", document.getElementById("edit-surname").value);
  formData.append("city", document.getElementById("edit-city").value);
  formData.append("community", document.getElementById("edit-community").value);
  formData.append("contact", document.getElementById("edit-contact").value);
  formData.append(
    "description",
    document.getElementById("edit-description").value,
  );

  const fileInput = document.getElementById("edit-img");
  if (fileInput.files[0]) {
    formData.append("img", fileInput.files[0]);
  }

  try {
    const response = await fetch(`https://find-zga8.onrender.com/search/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      showToast("Atualizado com sucesso!");
      closeModal();
      loadMySearches();
    } else {
      showToast("Erro ao atualizar.");
    }
  } catch (err) {
    console.error(err);
  }
});

window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.deletePet = deletePet;