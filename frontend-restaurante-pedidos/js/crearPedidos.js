document.addEventListener("DOMContentLoaded", function () {
  const formularios = document.querySelectorAll("form");

  if (formularios.length === 0) {
    console.error("No se encontraron formularios.");
    return;
  }

  formularios.forEach((formulario) => {
    const boton = formulario.querySelector(".btn-pedido");
    if (boton) {
      boton.addEventListener("click", function () {
        const platillo = formulario.querySelector(".platillo")?.value || "";
        const cliente = formulario.querySelector(".cliente")?.value || "";
        const cantidad = parseInt(formulario.querySelector(".cantidad")?.value) || 0;
        const fechaRaw = formulario.querySelector(".fecha")?.value || "";
        // Convertir la fecha de formato "YYYY-MM-DDTHH:MM" a "YYYY-MM-DD HH:MM:00"
        const fecha = fechaRaw ? fechaRaw.replace("T", " ") + ":00" : "";
        const observaciones = formulario.querySelector(".observaciones")?.value || "";
        const preciosContainer = formulario.closest(".menu").querySelector(".precios");
        const precioTexto = preciosContainer?.textContent.replace(/[^0-9]/g, "") || "0";
        const precio = parseInt(precioTexto);

        const pedido = {
          platillo,
          precio,
          cantidad,
          observaciones,
          cliente,
          fecha,
          estado: "preparar",
          mesa: 0 // Por defecto
        };

        fetch("http://localhost:3005/pedido", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pedido),
        })
          .then((res) => {
            console.log("Respuesta del servidor, status:", res.status);
            if (!res.ok) {
              return res.text().then(text => {
                throw new Error(`Error HTTP: ${res.status} - ${text}`);
              });
            }
            return res.json();
          })
          .then((res) => {
            console.log("Respuesta JSON:", res);
            if (res.success) {
              alert("✅ Pedido creado correctamente");
              formulario.reset();
            } else {
              alert("❌ No se pudo crear el pedido");
              console.error("Respuesta del servidor:", res);
            }
          })
          .catch((error) => {
            console.error("Error al crear el pedido:", error);
            alert("❌ Error al enviar el pedido");
          });
      });
    }
  });
});
