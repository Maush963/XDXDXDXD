function cambiarRol(idUsuario) {
    console.log('La función cambiarRol se ha llamado');
    var idRol = document.getElementById('rol-' + idUsuario).value;
    fetch('/Roles/cambiarRol', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idUsuario: idUsuario, idRol: idRol }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        location.reload(); 
    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

const buscar = () => {
    const input = document.getElementById('search');
    console.log("Buscando: " + input.value);

    fetch('/Roles/buscar/' + input.value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        let table = document.getElementById('tabla');
        let html = '';
        data.data.forEach(function(item) {
            html += `
            <tr class="hover:bg-gray-100" >
                <td class="py-4 px-6 border-b border-gray-200" >${item.UserName}</td>
                <td class="py-4 border-b border-gray-200" style="padding-right: 40px;">
                    <select id="rol-${item.IDUsuario}" onchange="cambiarRol('${item.IDUsuario}')" class="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <option value="${item.IDRol}" selected>${item.TipoRol}</option>
                    </select>
                </td>
                <td class="py-4 border-b border-gray-200" style="padding-left: 70px;">${item.FechaUsuarioRolActualizacion}</td>
                <td class="py-4 px-6 border-b border-gray-200">
                    <form action="/Roles/editar/${item.IDUsuario}" method="GET">
                        <input type="hidden" name="IDUsuario" value="${item.IDUsuario}">
                        <button type="submit" class="px-4 py-2 text-white font-bold bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Modificar
                        </button>
                    </form>
                </td>
            </tr>
            `;
        });
        console.log(html);
        table.innerHTML = html;
    }).catch((error) => {
        console.log(error);
    });
};

document.getElementById('search').addEventListener('input', buscar);

