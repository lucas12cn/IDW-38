document.addEventListener('DOMContentLoaded', function() {
    
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

    const formReserva = document.getElementById('formReserva');
    const steps = document.querySelectorAll('.step');
    const selEspecialidad = document.getElementById('reservaEspecialidad');
    const selMedico = document.getElementById('reservaMedico');
    const selObraSocial = document.getElementById('reservaObraSocial');
    const selTurno = document.getElementById('reservaTurno');
    const btnNext1 = document.getElementById('btnNextStep1');
    const btnPrev2 = document.getElementById('btnPrevStep2');
    const btnNext2 = document.getElementById('btnNextStep2');
    const btnPrev3 = document.getElementById('btnPrevStep3');
    const btnNext3 = document.getElementById('btnNextStep3');
    const btnPrev4 = document.getElementById('btnPrevStep4');
    const btnNext4 = document.getElementById('btnNextStep4');
    const btnPrev5 = document.getElementById('btnPrevStep5');
    const btnConfirmar = document.getElementById('btnConfirmarReserva');
    const inputDNI = document.getElementById('reservaDNI');
    const inputNombrePaciente = document.getElementById('reservaNombrePaciente');
    const resumenDiv = document.getElementById('resumenReserva');
    const valorTotalSpan = document.getElementById('valorTotalReserva');
    const exitoDiv = document.getElementById('datosReservaExitosa');
    
    const formBuscar = document.getElementById('formBuscarTurno');
    const inputBusqueda = document.getElementById('inputBusqueda');
    const divResultados = document.getElementById('resultadosBusqueda');

    let currentStep = 1;
    let reservaActual = {};

    async function buscarMisTurnos(event) {
        event.preventDefault();
        const query = inputBusqueda.value.trim();
        
        if (!query) {
            alert('Por favor, ingrese un documento o ID de reserva.');
            return;
        }

        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
        const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
        const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
        const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];

        divResultados.innerHTML = '';

        const misReservas = reservas.filter(r => r.documento === query || r.id == query);

        if (misReservas.length === 0) {
            divResultados.innerHTML = '<div class="alert alert-warning">No se encontraron turnos para su búsqueda.</div>';
            return;
        }

        misReservas.forEach(reserva => {
            const turno = turnos.find(t => t.id == reserva.turnoId);
            const medico = turno ? medicos.find(m => m.id == turno.medicoId) : null;
            const especialidad = especialidades.find(e => e.id == reserva.especialidadId);
            const obraSocial = reserva.obraSocialId == 0 
                ? { nombre: 'Privado' } 
                : obrasSociales.find(os => os.id == reserva.obraSocialId);

            if (!turno || !medico || !especialidad) {
                divResultados.innerHTML += `<div class="alert alert-danger">Error: Los datos para la reserva ID ${reserva.id} (Paciente: ${reserva.paciente}) parecen estar corruptos o fueron eliminados (ej. médico o turno borrado por un admin).</div>`;
                return;
            }
            
            const estadoTurno = new Date(turno.fechaHora) > new Date() ? 
                '<span class="badge bg-success">Pendiente</span>' : 
                '<span class="badge bg-secondary">Pasado</span>';


            const card = document.createElement('div');
            card.className = 'card mb-3 shadow-sm';
            card.innerHTML = `
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span class="fw-bold">Reserva ID: ${reserva.id}</span>
                    ${estadoTurno}
                </div>
                <div class="card-body">
                    <p><strong>Paciente:</strong> ${reserva.paciente} (DNI: ${reserva.documento})</p>
                    <p><strong>Médico:</strong> ${medico.nombre} ${medico.apellido}</p>
                    <p><strong>Especialidad:</strong> ${especialidad.nombre}</p>
                    <p><strong>Fecha y Hora:</strong> ${formatearFecha(turno.fechaHora)}</p>
                    <p><strong>Obra Social:</strong> ${obraSocial ? obraSocial.nombre : 'N/A'}</p>
                    <p class="fw-bold fs-5"><strong>Valor:</strong> $${reserva.valorTotal.toFixed(2)}</p>
                </div>
            `;
            divResultados.appendChild(card);
        });
    }

    function showStep(stepNumber) {
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.remove('d-none');
            } else {
                step.classList.add('d-none');
            }
        });
        currentStep = stepNumber;
    }

    function cargarEspecialidades() {
        selEspecialidad.innerHTML = '<option value="" selected disabled>-- Seleccione una especialidad --</option>';
        if (especialidades.length === 0) {
            selEspecialidad.innerHTML = '<option value="" disabled>No hay especialidades disponibles</option>';
            return;
        }
        especialidades.forEach(esp => {
            selEspecialidad.innerHTML += `<option value="${esp.id}">${esp.nombre}</option>`;
        });
    }

    function cargarMedicos(especialidadId) {
        selMedico.innerHTML = '<option value="" selected disabled>-- Seleccione un médico --</option>';
        btnNext2.disabled = true;
        const medicosFiltrados = medicos.filter(m => m.especialidadId == especialidadId);
        if (medicosFiltrados.length === 0) {
            selMedico.innerHTML = '<option value="" disabled>No hay médicos para esta especialidad</option>';
            return;
        }
        medicosFiltrados.forEach(med => {
            selMedico.innerHTML += `<option value="${med.id}">${med.nombre} ${med.apellido}</option>`;
        });
    }

    function cargarObrasSociales(medicoId) {
        selObraSocial.innerHTML = '<option value="" selected disabled>-- Seleccione una obra social --</option>';
        selObraSocial.innerHTML += '<option value="0">Privado (Sin Obra Social)</option>';
        btnNext3.disabled = true;
        const medico = medicos.find(m => m.id == medicoId);
        if (!medico || !medico.obrasSocialesIds || medico.obrasSocialesIds.length === 0) {
            return;
        }
        medico.obrasSocialesIds.forEach(osId => {
            const os = obrasSociales.find(o => o.id == osId);
            if (os) {
                selObraSocial.innerHTML += `<option value="${os.id}">${os.nombre}</option>`;
            }
        });
    }

    function cargarTurnos(medicoId) {
        selTurno.innerHTML = '<option value="" selected disabled>-- Seleccione un turno --</option>';
        btnNext3.disabled = true;
        const turnosFiltrados = turnos.filter(t => t.medicoId == medicoId && t.disponible === true);
        if (turnosFiltrados.length === 0) {
            selTurno.innerHTML = '<option value="" disabled>No hay turnos disponibles para este médico</option>';
            return;
        }
        turnosFiltrados.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
        turnosFiltrados.forEach(turno => {
            selTurno.innerHTML += `<option value="${turno.id}">${formatearFecha(turno.fechaHora)}</option>`;
        });
    }

    function generarResumen() {
        const especialidad = especialidades.find(e => e.id == selEspecialidad.value);
        const medico = medicos.find(m => m.id == selMedico.value);
        const obraSocial = obrasSociales.find(o => o.id == selObraSocial.value);
        const turno = turnos.find(t => t.id == selTurno.value);
        
        const valorBase = medico.valorConsulta;
        let valorFinal = valorBase;
        let nombreOS = "Privado";
        
        if (selObraSocial.value != "0" && obraSocial) {
            nombreOS = obraSocial.nombre;
            const descuentoPorcentaje = obraSocial.descuento || 0;
            
            if (descuentoPorcentaje > 0) {
                const descuento = valorBase * (descuentoPorcentaje / 100);
                valorFinal = valorBase - descuento;
            }
            
        } else if (selObraSocial.value != "0" && !obraSocial) {
            console.warn("Obra social no encontrada, se cobra como privado.");
            nombreOS = "Error OS - Se cobra Privado";
        }

        reservaActual = {
            id: generarNuevoIdReserva(),
            documento: inputDNI.value.trim(),
            paciente: inputNombrePaciente.value.trim(),
            turnoId: parseInt(turno.id),
            especialidadId: parseInt(especialidad.id),
            obraSocialId: parseInt(selObraSocial.value),
            valorTotal: valorFinal
        };

        resumenDiv.innerHTML = `
            <strong>Paciente:</strong> ${reservaActual.paciente} (DNI: ${reservaActual.documento})<br>
            <strong>Especialidad:</strong> ${especialidad.nombre}<br>
            <strong>Médico:</strong> ${medico.nombre} ${medico.apellido}<br>
            <strong>Obra Social:</strong> ${nombreOS}<br>
            <strong>Fecha y Hora:</strong> ${formatearFecha(turno.fechaHora)}
        `;
        
        valorTotalSpan.textContent = `$${reservaActual.valorTotal.toFixed(2)}`;
    }

    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();
        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
        return `${dia}/${mes}/${anio} ${hora}:${minutos} hs`;
    }

    function generarNuevoIdReserva() {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        if (reservas.length === 0) {
            return 1;
        }
        const maxId = Math.max(...reservas.map(r => r.id));
        return maxId + 1;
    }

    function confirmarReserva(event) {
        event.preventDefault();
        try {
            const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
            reservas.push(reservaActual);
            localStorage.setItem('reservas', JSON.stringify(reservas));

            const turnosActuales = JSON.parse(localStorage.getItem('turnos')) || [];
            
            const turnosActualizados = turnosActuales.map(turno => {
                if (turno.id === reservaActual.turnoId) {
                    return { ...turno, disponible: false };
                }
                return turno;
            });

            localStorage.setItem('turnos', JSON.stringify(turnosActualizados));

            exitoDiv.innerHTML = `ID de Reserva: <strong>${reservaActual.id}</strong><br>
                                 ${resumenDiv.innerHTML}`;
            showStep(6);

        } catch (error) {
            console.error("Error al guardar reserva:", error);
            alert("Ocurrió un error al confirmar su reserva. Por favor, intente de nuevo.");
            showStep(5);
        }
    }

    if (formBuscar) {
        formBuscar.addEventListener('submit', buscarMisTurnos);
    }

    if (formReserva) {
        btnNext1.addEventListener('click', () => showStep(2));
        btnPrev2.addEventListener('click', () => showStep(1));
        btnNext2.addEventListener('click', () => showStep(3));
        btnPrev3.addEventListener('click', () => showStep(2));
        btnNext3.addEventListener('click', () => showStep(4));
        btnPrev4.addEventListener('click', () => showStep(3));
        btnNext4.addEventListener('click', () => {
            if (!inputDNI.value.trim() || !inputNombrePaciente.value.trim()) {
                alert('Debe completar sus datos de paciente.');
                return;
            }
            generarResumen();
            showStep(5);
        });
        btnPrev5.addEventListener('click', () => showStep(4));
        
        selEspecialidad.addEventListener('change', () => {
            cargarMedicos(selEspecialidad.value);
            selMedico.value = "";
            selObraSocial.innerHTML = '<option value="" selected disabled>-- Seleccione una obra social --</option>';
            selTurno.innerHTML = '<option value="" selected disabled>-- Seleccione un turno --</option>';
            btnNext1.disabled = false;
            btnNext2.disabled = true;
            btnNext3.disabled = true;
        });

        selMedico.addEventListener('change', () => {
            cargarObrasSociales(selMedico.value);
            cargarTurnos(selMedico.value);
            selObraSocial.value = "";
            selTurno.value = "";
            btnNext2.disabled = false;
            btnNext3.disabled = true;
        });

        selObraSocial.addEventListener('change', () => {
            if (selTurno.value) { btnNext3.disabled = false; }
        });

        selTurno.addEventListener('change', () => {
            if (selObraSocial.value) { btnNext3.disabled = false; }
        });

        formReserva.addEventListener('submit', confirmarReserva);

        cargarEspecialidades();
        showStep(1);
    }
});