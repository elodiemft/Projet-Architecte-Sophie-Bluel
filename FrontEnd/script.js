fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((works) => {
    const gallery = document.querySelector(".gallery");

    works.forEach((work) => {
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
    filters.appendChild(allButton);

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      filters.appendChild(button);
    });
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des catégories :", error);
  });
