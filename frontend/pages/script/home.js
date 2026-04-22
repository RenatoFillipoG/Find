import URL_API from '../../config.js';
import { showToast } from '../../index.js';

let allAnuncios = [];

function checkLogin() {
    const token = localStorage.getItem("userToken");
    const logoutBtn = document.getElementById("logout-btn");
    const userIcon = document.getElementById("user-icon");

    if (!token) {
        if (logoutBtn) logoutBtn.classList.add("hidden");
        if (userIcon) userIcon.classList.add("hidden");
    } else {

        if (logoutBtn) logoutBtn.classList.remove("hidden");
        if (userIcon) userIcon.classList.remove("hidden");
    }
}

async function loadHome() {
  const nomeSalvo = localStorage.getItem("userName");
  const h1Nome = document.getElementById("user-Name");

  if (nomeSalvo) {
    h1Nome.innerText = `Olá, ${nomeSalvo}!`;
  } else {
    h1Nome.innerText = "Olá, visitante!";
  }

  try {
    const response = await fetch(`${URL_API}/search`);
    allAnuncios = await response.json();

    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    allAnuncios.forEach((anuncio) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
                <div class="cardSearch">
                    <h3 class="surname">${anuncio.surname}</h3>
                    <img src="${URL_API}/uploads/${anuncio.img}" alt="Foto de ${anuncio.surname}" />
                    <div class="location">
                        <p class="zone">${anuncio.city}</p>
                        <p class="comunity">${anuncio.community}</p>
                    </div>
                </div>
                <button class="button" onclick="handleOpenModal(${anuncio.id})">Ver Informações</button>
            `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar pets:", error);
  }
}

function handleOpenModal(id) {
    const pet = allAnuncios.find(p => p.id === id);
    if (pet) {
        openInfoModal(pet);
    }
}

function openInfoModal(pet) {
    const modal = document.getElementById("info-modal");
    const content = document.getElementById("info-content");
    
    if (!modal || !content) return;

    modal.style.display = "block";
    content.innerHTML = `
        <img src="${URL_API}/uploads/${pet.img}" style="width:100%; border-radius:8px; height: 250px; object-fit: cover;">
        <h2 style="margin-top:15px; color:#8f1eae">${pet.surname}</h2>
        <p><strong>Local:</strong> ${pet.community} - ${pet.city}</p>
        <p><strong>Contato:</strong> ${pet.contact || 'Não informado'}</p>
        <hr style="margin:10px 0; border:0; border-top:1px solid #eee">
        <p><strong>Descrição:</strong></p>
        <p>${pet.description || 'Sem descrição adicional.'}</p>
        <button onclick="closeInfoModal()" class="btn-save button" style="margin-top:20px; width: 100%; padding: 10px; cursor: pointer;">Fechar</button>
    `;
}

function closeInfoModal() {
    document.getElementById("info-modal").style.display = "none";
}

window.onload = loadHome; 

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userToken");
  localStorage.setItem("userName", "");
  window.location.href = "login.html";
});

const inputSearch = document.getElementById("search");
inputSearch.addEventListener("input", () => {
  const filterText = inputSearch.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const petName = card.querySelector(".surname").innerText.toLowerCase();
    const petCity = card.querySelector(".zone").innerText.toLowerCase();

    if (petName.includes(filterText) || petCity.includes(filterText)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
});

const userIcon = document.getElementById("user-icon");
const userModal = document.getElementById("user-modal");

userIcon.addEventListener("click", () => {
  userModal.classList.toggle("show");
});

window.addEventListener("click", (event) => {
  if (userIcon && !userIcon.contains(event.target) && userModal && !userModal.contains(event.target)) {
    userModal.classList.remove("show");
  }
});

window.addEventListener("DOMContentLoaded", checkLogin);

window.handleOpenModal = handleOpenModal
window.openInfoModal = openInfoModal
window.closeInfoModal = closeInfoModal
