document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3005/pedidos");
    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      throw new Error("Formato de respuesta inválido");
    }

    const tabla = document.querySelector("tbody");
    tabla.innerHTML = "";

    data.forEach((pedido) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${pedido.id}</td>
        <td>${pedido.platillo}</td>
        <td>${pedido.mesa}</td>
        <td>${pedido.estado}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editarPedido(${pedido.id}, '${pedido.platillo}', ${pedido.mesa}, '${pedido.estado}')">✏️ Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${pedido.id})">❌ Eliminar</button>
        </td>
      `;

      tabla.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
  }
});

async function editarPedido(id, platillo, mesa, estado) {
  const nuevoPlatillo = prompt("Nuevo nombre del platillo:", platillo);
  const nuevaMesa = prompt("Nuevo número de mesa:", mesa);
  const nuevoEstado = prompt("Nuevo estado (preparar, preparando, entregar, entregado):", estado);

  if (!nuevoPlatillo || !nuevaMesa || !nuevoEstado) return;

  try {
    const response = await fetch("http://localhost:3005/pedido", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        platillo: nuevoPlatillo,
        mesa: parseInt(nuevaMesa),
        estado: nuevoEstado,
      }),
    });

    const result = await response.json();
    console.log(result);
    alert(result.message || "Pedido actualizado");
    location.reload();
  } catch (error) {
    console.error("Error al editar el pedido:", error);
  }
}

async function eliminarPedido(id) {
  const confirmacion = confirm("¿Estás seguro de eliminar este pedido?");
  if (!confirmacion) return;

  try {
    const response = await fetch("http://localhost:3005/pedido", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    const result = await response.json();
    console.log(result);
    alert(result.message || "Pedido eliminado");
    location.reload();
  } catch (error) {
    console.error("Error al eliminar el pedido:", error);
  }
}
