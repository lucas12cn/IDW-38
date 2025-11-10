document.addEventListener('DOMContentLoaded', function() {
    
    const formEspecialidad = document.getElementById('formEspecialidad');
    const inputId = document.getElementById('especialidadId');
    const inputNombre = document.getElementById('especialidadNombre');
    const tablaBody = document.getElementById('tablaEspecialidadesBody');
    const btnCancelarEdicion = document.getElementById('btnCancelarEdicionEsp');

    function obtenerEspecialidades() {
        return JSON.parse(localStorage.getItem('especialidades')) || [];
    }

    function guardarEspecialidades(especialidades) {
        localStorage.setItem('especialidades', JSON.stringify(especialidades));
    }

    function generarNuevoId() {
        const especialidades = obtenerEspecialidades();
        if (especialidades.length === 0) {
            return 1;
        }
        const maxId = Math.max(...especialidades.map(esp => esp.id));
        return maxId + 1;
    }

    function resetFormulario() {
        formEspecialidad.reset();
        inputId.value = '';
        btnCancelarEdicion.classList.add('d-none');
    }

    function renderTablaEspecialidades() {
        const especialidades = obtenerEspecialidades();
        tablaBody.innerHTML = '';

        if (especialidades.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="3" class="text-center">No hay especialidades registradas.</td></tr>';
            return;
        }

        especialidades.forEach(esp => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="vertical-align: middle;">${esp.id}</td>
                <td style="vertical-align: middle;">${esp.nombre}</td>
                <td style="vertical-align: middle;">
                    <button class="btn btn-sm btn-warning me-2 btn-editar-esp" data-id="${esp.id}">Editar</button>
                    <button class="btn btn-sm btn-danger btn-eliminar-esp" data-id="${esp.id}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    function manejarSubmit(event) {
        event.preventDefault();
        
        const nombre = inputNombre.value.trim();
        const id = inputId.value;
        
        if (!nombre) {
            alert('Por favor, ingrese un nombre para la especialidad.');
            return;
        }

        const especialidades = obtenerEspecialidades();

        if (id) {
            const index = especialidades.findIndex(esp => esp.id == id);
            if (index !== -1) {
                especialidades[index].nombre = nombre;
                alert('Especialidad actualizada con éxito.');
            }
        } else {
            const nuevaEspecialidad = {
                id: generarNuevoId(),
                nombre: nombre
            };
            especialidades.push(nuevaEspecialidad);
            alert('Especialidad registrada con éxito.');
        }

        guardarEspecialidades(especialidades);
        renderTablaEspecialidades();
        resetFormulario();
    }

    function cargarFormularioEdicion(id) {
        const especialidades = obtenerEspecialidades();
        const especialidad = especialidades.find(esp => esp.id == id);

        if (especialidad) {
            inputId.value = especialidad.id;
            inputNombre.value = especialidad.nombre;
            btnCancelarEdicion.classList.remove('d-none');
            window.scrollTo(0, 0);
        }
    }

    function eliminarEspecialidad(id) {
        const especialidades = obtenerEspecialidades();
        const especialidad = especialidades.find(esp => esp.id == id);

        if (confirm(`¿Estás seguro que deseas eliminar la especialidad "${especialidad.nombre}"?`)) {
            
            const nuevasEspecialidades = especialidades.filter(esp => esp.id != id);
            guardarEspecialidades(nuevasEspecialidades);
            renderTablaEspecialidades();
            
            if (inputId.value == id) {
                resetFormulario();
            }
        }
    }

    function manejarClicsTabla(event) {
        if (event.target.classList.contains('btn-editar-esp')) {
            const id = Number(event.target.dataset.id);
            cargarFormularioEdicion(id);
        }
        
        if (event.target.classList.contains('btn-eliminar-esp')) {
            const id = Number(event.target.dataset.id);
            eliminarEspecialidad(id);
        }
    }
    
    renderTablaEspecialidades();

    formEspecialidad.addEventListener('submit', manejarSubmit);
    tablaBody.addEventListener('click', manejarClicsTabla);
    btnCancelarEdicion.addEventListener('click', resetFormulario);

});