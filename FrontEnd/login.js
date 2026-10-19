const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      document.querySelector("#login-error").textContent =
        "E-mail ou mot de passe incorrect";
    }

    const data = await response.json();

    if (!data.token) {
      console.error("Aucun token reçu");
      return;
    }

    sessionStorage.setItem("token", data.token);

    window.location.href = "index.html";
  } catch (error) {
    console.error("Erreur de connexion au serveur :", error);
  }
});
