window.onload = function() {
    document.getElementById('crear-rol').style.display = 'none';

    let hasChanges = false;
    let checkboxes = document.querySelectorAll('.privilege-checkbox');
    let saveChangesButton = document.getElementById('crear-rol');

    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            hasChanges = true;
            if (saveChangesButton) {
                saveChangesButton.style.display = 'block';
            }
        });
    });

    
    document.getElementById('crear-rol').addEventListener('click', function(e) {
        e.preventDefault();
        let checkboxes = document.querySelectorAll('.privilege-checkbox');
        let nombreRol = document.getElementById('nombreRol').value; // Recoger el valor del campo de entrada del nombre del rol
        let changes = {
            nombreRol: nombreRol,
            privileges: []
        };
        changes.privileges.push({privilegeID:'1', checked:true});
        changes.privileges.push({privilegeID:'2', checked:true});
        // Recorrer todos los checkboxes y obtener los datos de los checkboxes
        // y agregarlos al objeto changes
        checkboxes.forEach(function(checkbox) {
            let privilegeID = checkbox.getAttribute('data-privilege');
            let checked = checkbox.checked;
            changes.privileges.push({privilegeID, checked});
        });
    
        // Verificar si al menos un privilegio fue seleccionado, a excepción de los dos primeros
        let atLeastOneChecked = false;
        for (let i = 2; i < changes.privileges.length; i++) {
            if (changes.privileges[i].checked) {
                atLeastOneChecked = true;
                break;
            }
        }
        
        
        if (!atLeastOneChecked) {
            swal({
                title: 'Error',
                text: 'Selecciona por lo menos un privilegio.',
                icon: 'error',
            });
        } else if (nombreRol == '') {
            swal({
                title: 'Error',
                text: 'El nombre del rol no puede estar vacio.',
                icon: 'error',
            });
        } else {
            fetch('/Roles/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changes),
            })
            .then(data => {
                swal('Guardado', 'El rol ha sido guardado.', 'success')
                .then(() => {
                    window.location.href = '/Roles/consultas';
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                swal('Error', 'Ocurrió un error al crear el rol.', 'error');
            });
        
        }
    });


    document.getElementById('close-button').addEventListener('click', function() {
        if (hasChanges) {
            swal({
                title: "¿Salir?",
                text: "No se han guardado los cambios.",
                icon: "warning",
                buttons: {
                    cancel: "Cancelar",
                    confirm: "Salir sin guardar"
                },
                dangerMode: true,
            })
            .then((willLeave) => {
                if (willLeave) {
                    window.location.href = '/Roles/consultas';
                }
            });
        } else {
            window.location.href = '/Roles/consultas';
        }
    });
};