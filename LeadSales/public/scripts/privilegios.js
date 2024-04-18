window.onload = function() {
    
    //se evita que el boton de guardar cambios se muestre al inicio
    document.getElementById('save-changes').style.display = 'none';

    var hasChanges = false;

    //se obtienen todos los datos de los checkboxes
    //se recorren todos los checkboxes y se les agrega un evento change
    //para que se muestre el boton de guardar cambios
    var checkboxes = document.querySelectorAll('.privilege-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            hasChanges = true;
            document.getElementById('save-changes').style.display = 'block';
        });
    });
    //se muestra un mensaje de confirmacion al guardar los cambios
    document.getElementById('save-changes').addEventListener('click', function() {
        var changes = {
            roleID: null,
            privileges: []
        };
        changes.privileges.push({privilegeID:'1', checked:true});
        changes.privileges.push({privilegeID:'2', checked:true});
        //con la variable que habiamos creado anteriormente, se recorren todos los checkboxes
        //y se obtienen los datos de los checkboxes
        checkboxes.forEach(function(checkbox) {
            let roleID = checkbox.getAttribute('data-role');
            let privilegeID = checkbox.getAttribute('data-privilege');
            let checked = checkbox.checked;
            if (!changes.roleID) {
                changes.roleID = roleID;
            }
            changes.privileges.push({privilegeID, checked});
        });
        //se muestra un mensaje de confirmacion al guardar los cambios
        swal({
            title: '¿Estás seguro?',
            text: 'Los cambios se guardarán en la base de datos.',
            icon: 'warning',
            buttons: {
                cancel: 'No, cancelar',
                confirm: 'Sí, guardar cambios',
            },
            dangerMode: true,
             })
            //si el usuario confirma, se envian los datos al servidor en formato JSON
        .then((isConfirm) => {
            if (isConfirm) {
                fetch('/privilegios/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(changes),
                })
                //.then(console.log(JSON.stringify(changes)))
                .then(response => response.json())
                .then(data => {
                    swal('Guardado', 'Los cambios se han guardado.', 'success')
                    .then(() => {
                        window.location.href = '/Roles/consultas';
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    swal('Error', 'Ocurrió un error al guardar los cambios.', 'error');
                });
            } 
        });
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