document.addEventListener('DOMContentLoaded', function() {
    
    const tablaReservasBody = document.getElementById('tablaReservasBody');
    const tabTurnos = document.getElementById('turnos-tab');

    function cargarReservasEnAdmin() {
        
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
        const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
        const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
        const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

        tablaReservasBody.innerHTML = '';
        
        const tablaReservasHead = document.querySelector('#tablaReservas thead tr');
        if (tablaReservasHead.children.length === 7) {
             const th = document.createElement('th');
             th.scope = 'col';
             th.innerText = 'Acciones';
             tablaReservasHead.appendChild(th);
        }

        if (reservas.length === 0) {
            tablaReservasBody.innerHTML = '<tr><td colspan="8" class="text-center">No hay reservas registradas.</td></tr>';
            return;
        }

        reservas.forEach(reserva => {
            const turno = turnos.find(t => t.id == reserva.turnoId);
            const medico = turno ? medicos.find(m => m.id == turno.medicoId) : null;
            const especialidad = especialidades.find(e => e.id == reserva.especialidadId);
            const obraSocial = reserva.obraSocialId == 0 
                ? { nombre: 'Privado' } 
                : obrasSociales.find(os => os.id == reserva.obraSocialId);

            const pacienteNombre = reserva.paciente || 'N/A';
            const pacienteDNI = reserva.documento || 'N/A';
            const turnoInfo = turno && medico 
                ? `${medico.nombre} ${medico.apellido} (${formatearFecha(turno.fechaHora)})`
                : `<span class="text-danger">Turno ID: ${reserva.turnoId} (Eliminado)</span>`;
            const especialidadNombre = especialidad ? especialidad.nombre : 'N/A';
            const obraSocialNombre = obraSocial ? obraSocial.nombre : 'N/A';
            const valor = reserva.valorTotal ? `$${reserva.valorTotal.toFixed(2)}` : 'N/A';

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="vertical-align: middle;">${reserva.id}</td>
                <td style="vertical-align: middle;">${pacienteDNI}</td>
                <td style="vertical-align: middle;">${pacienteNombre}</td>
                <td style="vertical-align: middle;">${turnoInfo}</td>
                <td style="vertical-align: middle;">${especialidadNombre}</td>
                <td style="vertical-align: middle;">${obraSocialNombre}</td>
                <td style="vertical-align: middle;">${valor}</td>
                <td style="vertical-align: middle;">
                    <button class="btn btn-sm btn-danger btn-cancelar-reserva" 
                            data-id="${reserva.id}" 
                            data-turno-id="${reserva.turnoId}"
                            title="Cancelar Reserva">
                        Cancelar
                    </button>
                </td>
            `;
            tablaReservasBody.appendChild(fila);
        });
    }

    function cancelarReserva(reservaId, turnoId) {
        
        if (!confirm(`¿Está seguro que desea cancelar la reserva ID ${reservaId}? \nEsta acción liberará el turno asociado.`)) {
            return;
        }

        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        const nuevasReservas = reservas.filter(r => r.id != reservaId);
        localStorage.setItem('reservas', JSON.stringify(nuevasReservas));

        let turnos = JSON.parse(localStorage.getItem('turnos')) || [];
        const turnosActualizados = turnos.map(t => {
            if (t.id == turnoId) {
                return { ...t, disponible: true };
            }
            return t;
        });
        localStorage.setItem('turnos', JSON.stringify(turnosActualizados));

        cargarReservasEnAdmin();

        document.dispatchEvent(new CustomEvent('reservasActualizadas'));
    }

    function manejarClicsTablaReservas(event) {
        if (event.target.classList.contains('btn-cancelar-reserva')) {
            const reservaId = event.target.dataset.id;
            const turnoId = event.target.dataset.turnoId;
            cancelarReserva(reservaId, turnoId);
        }
    }

    function formatearFecha(fechaISO) {
        if (!fechaISO) return 'N/A';
        const fecha = new Date(fechaISO);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();
        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
        return `${dia}/${mes}/${anio} ${hora}:${minutos} hs`;
    }

    if (tabTurnos) {
        tabTurnos.addEventListener('click', cargarReservasEnAdmin);
    }
    
    if (document.getElementById('turnos').classList.contains('show')) {
        cargarReservasEnAdmin();
    }

    tablaReservasBody.addEventListener('click', manejarClicsTablaReservas);
});