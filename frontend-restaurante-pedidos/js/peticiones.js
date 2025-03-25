document.addEventListener("DOMContentLoaded", () => {
  const btnIniciar = document.querySelector(".btn-iniciar");

  if (btnIniciar) {
    btnIniciar.addEventListener("click", async () => {
      const user = document.getElementById("user").value;
      const password = document.getElementById("password").value;

      if (!user || !password) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      try {
        const res = await fetch("http://localhost:3005/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user, password })
        });

        const data = await res.json();
        console.log("Respuesta recibida del login:", data); // 🕵️

        if (data.success) {
          // Se accede a la información del usuario a través de data.user
          const rol = data.user.rol.toLowerCase();
          const nombre = data.user.name;

          localStorage.setItem("usuario", user);
          localStorage.setItem("rol", rol);
          localStorage.setItem("nombre", nombre);

          alert("Inicio de sesión exitoso 🚀");

          if (rol === "cajero") {
            window.location.href = "cajero.html";
          } else if (rol === "chef") {
            window.location.href = "chef.html";
          } else if (rol === "mesero") {
            window.location.href = "mesero.html";
          } else {
            alert("Rol no reconocido ❌");
            console.log("Rol recibido:", rol);
          }

        } else {
          alert("⚠️ " + data.message);
        }

      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("❌ Error al conectar con el servidor.");
      }
    });
  }
});
