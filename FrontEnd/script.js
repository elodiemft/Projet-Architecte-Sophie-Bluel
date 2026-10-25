const token = sessionStorage.getItem("token");
const estConnecte = token !== null;

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

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    tousLesProjets = works;
    afficherProjets(works);
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
