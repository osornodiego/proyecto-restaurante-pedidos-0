document.addEventListener("DOMContentLoaded", function () {
  const porEntregarTable = document.getElementById("porEntregarTable");
  const entregadoTable = document.getElementById("entregadoTable");

  if (!porEntregarTable || !entregadoTable) {
    console.error("No se encontraron los contenedores de tabla.");
    return;
  }

  // Se corrige la URL para coincidir con la ruta del backend: GET /mesero
  fetch("http://localhost:3005/mesero")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((respuesta) => {
      console.log("Respuesta recibida:", respuesta);

      const porEntregar = respuesta.data.porEntregar || [];
      const entregado = respuesta.data.entregado || [];

      porEntregar.forEach((pedido) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${pedido.platillo}</td>
          <td>${pedido.mesa}</td>
          <td>
            <button class="btn btn-success" onclick="cambiarEstado(${pedido.id})">Entregado</button>
          </td>
        `;
        porEntregarTable.appendChild(row);
      });

      entregado.forEach((pedido) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${pedido.platillo}</td>
          <td>${pedido.mesa}</td>
          <td>Entregado</td>
        `;
        entregadoTable.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error al cargar pedidos:", error);
    });
});

function cambiarEstado(id) {
  // Se actualiza la URL para que haga PUT a /entregado
  fetch("http://localhost:3005/entregado", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.error("Error al actualizar estado:", error);
    });
}
