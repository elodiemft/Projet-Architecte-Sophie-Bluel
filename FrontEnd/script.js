const token = sessionStorage.getItem("token");
const estConnecte = token !== null;

if (estConnecte) {
  document.querySelector(".filters").style.display = "none";
  document.querySelector("#edit-button").style.display = "block";
}

const loginLink = document.querySelector("#login-link");

if (estConnecte) {
  loginLink.textContent = "logout";
  loginLink.href = "#";

  loginLink.addEventListener("click", (event) => {
    event.preventDefault();

    sessionStorage.removeItem("token");

    window.location.href = "index.html";
  });
}

if (estConnecte) {
  document.querySelector("#edition-banner").style.display = "block";
}

console.log("Utilisateur connecté :", estConnecte);

let tousLesProjets = [];

const gallery = document.querySelector(".gallery");

function afficherProjets(projets) {
  gallery.innerHTML = "";

  projets.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const caption = document.createElement("figcaption");

    image.src = work.imageUrl;
    image.alt = work.title;
    caption.textContent = work.title;

    figure.appendChild(image);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

async function supprimerProjet(id) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Erreur lors de la suppression du projet");
      return;
    }

    tousLesProjets = tousLesProjets.filter((work) => work.id !== id);

    afficherProjets(tousLesProjets);
    afficherPhotosModale(tousLesProjets);
  } catch (error) {
    console.error("Erreur de connexion au serveur :", error);
  }
}

function afficherPhotosModale(projets) {
  const modalPhotos = document.querySelector(".modal-photos");

  modalPhotos.innerHTML = "";

  projets.forEach((work) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const deleteButton = document.createElement("button");

    image.src = work.imageUrl;
    image.alt = work.title;

    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => {
      supprimerProjet(work.id);
    });

    figure.appendChild(image);
    figure.appendChild(deleteButton);
    modalPhotos.appendChild(figure);
  });
}

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    tousLesProjets = works;
    afficherProjets(works);
    afficherPhotosModale(works);
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des projets :", error);
  });

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    const filters = document.querySelector(".filters");

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("active");

    allButton.addEventListener("click", () => {
      afficherProjets(tousLesProjets);
      activerBouton(allButton);
    });
    filters.appendChild(allButton);

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.addEventListener("click", () => {
        const projetsFiltres = tousLesProjets.filter(
          (work) => work.categoryId === category.id,
        );

        afficherProjets(projetsFiltres);
        activerBouton(button);
      });
      filters.appendChild(button);
    });
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des catégories :", error);
  });

function activerBouton(boutonSelectionne) {
  const boutons = document.querySelectorAll(".filters button");

  boutons.forEach((button) => {
    button.classList.remove("active");
  });

  boutonSelectionne.classList.add("active");
}

const editButton = document.querySelector("#edit-button");
const modal = document.querySelector("#modal");

editButton.addEventListener("click", () => {
  modal.style.display = "flex";
  document.querySelector("#modal-gallery").style.display = "block";
  document.querySelector("#modal-add").style.display = "none";
});

const closeModal = document.querySelector("#close-modal");

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

const addPhotoButton = document.querySelector("#add-photo-button");

addPhotoButton.addEventListener("click", () => {
  document.querySelector("#modal-gallery").style.display = "none";
  document.querySelector("#modal-add").style.display = "block";
});

const backButton = document.querySelector("#back-button");

backButton.addEventListener("click", () => {
  document.querySelector("#modal-add").style.display = "none";
  document.querySelector("#modal-gallery").style.display = "block";
});

const photoInput = document.querySelector("#photo");
const photoPreview = document.querySelector("#photo-preview");
const photoUpload = document.querySelector(".photo-upload");

photoInput.addEventListener("change", () => {
  const fichier = photoInput.files[0];

  if (fichier) {
    photoPreview.src = URL.createObjectURL(fichier);
    photoPreview.style.display = "block";

    photoUpload.querySelector("i").style.display = "none";
    photoUpload.querySelector("label").style.display = "none";
    photoUpload.querySelector("p").style.display = "none";
  }
});
