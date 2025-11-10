document.addEventListener('DOMContentLoaded', function() {
    
    const formTurno = document.getElementById('formTurno');
    const inputId = document.getElementById('turnoId');
    const selectMedico = document.getElementById('turnoMedico');
    const inputFechaHora = document.getElementById('turnoFechaHora');
    const tablaBody = document.getElementById('tablaTurnosBody');
    const btnCancelarEdicion = document.getElementById('btnCancelarEdicionTurno');

    function obtenerTurnos() {
        return JSON.parse(localStorage.getItem('turnos')) || [];
    }

    function guardarTurnos(turnos) {
        localStorage.setItem('turnos', JSON.stringify(turnos));
    }

    function obtenerMedicos() {
        return JSON.parse(localStorage.getItem('medicos')) || [];
    }

    function generarNuevoId() {
        const turnos = obtenerTurnos();
        if (turnos.length === 0) {
            return 1;
        }
        const maxId = Math.max(...turnos.map(t => t.id));
        return maxId + 1;
    }

    function cargarMedicosSelect() {
        const medicos = obtenerMedicos();
        selectMedico.innerHTML = '<option value="" selected disabled>-- Seleccione un médico --</option>';
        
        if (medicos.length === 0) {
             selectMedico.innerHTML = '<option value="" disabled>No hay médicos cargados</option>';
             return;
        }

        medicos.forEach(medico => {
            const option = document.createElement('option');
            option.value = medico.id;
            option.textContent = `${medico.nombre} ${medico.apellido} (Mat: ${medico.matricula})`;
            selectMedico.appendChild(option);
        });
    }

    function resetFormulario() {
        formTurno.reset();
        inputId.value = '';
        btnCancelarEdicion.classList.add('d-none');
    }

    function formatearFecha(fechaISO) {
        if (!fechaISO) return 'N/A';
        try {
            const fecha = new Date(fechaISO);
            const dia = fecha.getDate().toString().padStart(2, '0');
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            const anio = fecha.getFullYear();
            const hora = fecha.getHours().toString().padStart(2, '0');
            const minutos = fecha.getMinutes().toString().padStart(2, '0');
            return `${dia}/${mes}/${anio} ${hora}:${minutos} hs`;
        } catch (error) {
            console.error("Error al formatear fecha:", fechaISO, error);
            return 'Fecha inválida';
        }
    }


    function renderTablaTurnos() {
        const turnos = obtenerTurnos();
        const medicos = obtenerMedicos();
        tablaBody.innerHTML = '';

        if (turnos.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay turnos registrados.</td></tr>';
            return;
        }

        turnos.forEach(turno => {
            const medico = medicos.find(m => m.id == turno.medicoId);
            const nombreMedico = medico ? `${medico.nombre} ${medico.apellido}` : 'Médico no encontrado';
            
            const disponibleTexto = turno.disponible ? '<span class="badge bg-success">Sí</span>' : '<span class="badge bg-danger">No</span>';

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="vertical-align: middle;">${turno.id}</td>
                <td style="vertical-align: middle;">${nombreMedico}</td>
                <td style="vertical-align: middle;">${formatearFecha(turno.fechaHora)}</td>
                <td style="vertical-align: middle;">${disponibleTexto}</td>
                <td style="vertical-align: middle;">
                    <button class="btn btn-sm btn-warning me-2 btn-editar-turno" data-id="${turno.id}" ${!turno.disponible ? 'disabled' : ''}>Editar</button>
                    <button class="btn btn-sm btn-danger btn-eliminar-turno" data-id="${turno.id}" ${!turno.disponible ? 'disabled' : ''}>Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    function manejarSubmit(event) {
        event.preventDefault();
        
        const id = inputId.value;
        const medicoId = selectMedico.value;
        const fechaHora = inputFechaHora.value;
        const fechaSeleccionada = new Date(fechaHora);
        const fechaActual = new Date();

        if (!medicoId || !fechaHora) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        if (fechaSeleccionada <= fechaActual) {
            alert('La fecha y hora del turno deben ser futuras.');
            return;
        }

        const turnos = obtenerTurnos();

        if (id) {
            const index = turnos.findIndex(t => t.id == id);
            if (index !== -1) {
                if (!turnos[index].disponible) {
                    alert('No se puede editar un turno que ya ha sido reservado.');
                    return;
                }
                turnos[index].medicoId = parseInt(medicoId);
                turnos[index].fechaHora = fechaHora;
                alert('Turno actualizado con éxito.');
            }
        } else {
            const nuevoTurno = {
                id: generarNuevoId(),
                medicoId: parseInt(medicoId),
                fechaHora: fechaHora,
                disponible: true
            };
            turnos.push(nuevoTurno);
            alert('Turno registrado con éxito.');
        }

        guardarTurnos(turnos);
        renderTablaTurnos();
        resetFormulario();
    }

    function cargarFormularioEdicion(id) {
        const turnos = obtenerTurnos();
        const turno = turnos.find(t => t.id == id);

        if (turno) {
            if (!turno.disponible) {
                alert('Este turno ya fue reservado y no se puede editar.');
                return;
            }
            inputId.value = turno.id;
            selectMedico.value = turno.medicoId;
            inputFechaHora.value = turno.fechaHora;
            
            btnCancelarEdicion.classList.remove('d-none');
            window.scrollTo(0, 0);
        }
    }

    function eliminarTurno(id) {
        const turnos = obtenerTurnos();
        const turno = turnos.find(t => t.id == id);

        if (turno && !turno.disponible) {
            alert('No se puede eliminar un turno que ya ha sido reservado.');
            return;
        }

        if (confirm(`¿Estás seguro que deseas eliminar este turno?`)) {
            const nuevosTurnos = turnos.filter(t => t.id != id);
            guardarTurnos(nuevosTurnos);
            renderTablaTurnos();
            
            if (inputId.value == id) {
                resetFormulario();
            }
        }
    }

    function manejarClicsTabla(event) {
        if (event.target.classList.contains('btn-editar-turno')) {
            const id = Number(event.target.dataset.id);
            cargarFormularioEdicion(id);
        }
        
        if (event.target.classList.contains('btn-eliminar-turno')) {
            const id = Number(event.target.dataset.id);
            eliminarTurno(id);
        }
    }

    cargarMedicosSelect();
    renderTablaTurnos();

    formTurno.addEventListener('submit', manejarSubmit);
    tablaBody.addEventListener('click', manejarClicsTabla);
    btnCancelarEdicion.addEventListener('click', resetFormulario);

    document.getElementById('turnos-tab').addEventListener('click', () => {
        cargarMedicosSelect();
    });
});