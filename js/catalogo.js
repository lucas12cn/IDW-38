document.addEventListener('DOMContentLoaded', function() {
    
    function inicializarDatosDemo() {
        
        const demoEspecialidades = [
            { id: 1, nombre: "Pediatría" },
            { id: 2, nombre: "Cardiología" },
            { id: 3, nombre: "Dermatología" }
        ];

        const demoObrasSociales = [
            { id: 1, nombre: "OSDE", descripcion: "Obra Social de Ejecutivos", descuento: 30 },
            { id: 2, nombre: "IOMA", descripcion: "Instituto de Obra Médico Asistencial", descuento: 20 },
            { id: 3, nombre: "Swiss Medical", descripcion: "Medicina privada", descuento: 10 }
        ];

        const demoMedicos = [
            {
                id: 1,
                nombre: "Dra. Ana",
                apellido: "López",
                matricula: "12345",
                especialidadId: 1,
                descripcion: "Especialista en atención pediátrica.",
                obrasSocialesIds: [1, 3],
                valorConsulta: 5000,
                imagen: "imagenes/m2.jpg"
            },
            {
                id: 2,
                nombre: "Dr. Carlos",
                apellido: "Gómez",
                matricula: "67890",
                especialidadId: 2,
                descripcion: "Experto en salud cardiovascular.",
                obrasSocialesIds: [2],
                valorConsulta: 6000,
                imagen: "imagenes/m1.jpg"
            },
            {
                id: 3,
                nombre: "Dra. Mariana",
                apellido: "Torres",
                matricula: "11223",
                especialidadId: 3,
                descripcion: "Cuidado de la piel para todas las edades.",
                obrasSocialesIds: [1, 2, 3],
                valorConsulta: 5500,
                imagen: "imagenes/m3.jpg"
            }
        ];

        const demoTurnos = [
            { id: 1, medicoId: 1, fechaHora: "2025-11-20T10:00", disponible: true },
            { id: 2, medicoId: 1, fechaHora: "2025-11-20T10:30", disponible: true },
            { id: 3, medicoId: 1, fechaHora: "2025-11-20T11:00", disponible: true },
            
            { id: 4, medicoId: 2, fechaHora: "2025-11-21T09:00", disponible: true },

            { id: 5, medicoId: 3, fechaHora: "2025-11-22T14:00", disponible: true },
            { id: 6, medicoId: 3, fechaHora: "2025-11-22T14:30", disponible: true },
            { id: 7, medicoId: 3, fechaHora: "2025-11-22T15:00", disponible: true }
        ];


        const medicosExistentes = localStorage.getItem('medicos');
        if (!medicosExistentes) {
            console.log("localStorage vacío. Sembrando datos de demostración...");
            
            localStorage.setItem('especialidades', JSON.stringify(demoEspecialidades));
            localStorage.setItem('obrasSociales', JSON.stringify(demoObrasSociales));
            localStorage.setItem('medicos', JSON.stringify(demoMedicos));
            localStorage.setItem('turnos', JSON.stringify(demoTurnos));
            
            console.log("Datos de demostración cargados (incluyendo turnos).");
        } else {
            console.log("Datos ya existen en localStorage. No se siembran datos.");
        }
    }

    function obtenerMedicos() {
        const medicosGuardados = localStorage.getItem('medicos');
        return medicosGuardados ? JSON.parse(medicosGuardados) : [];
    }

    function mostrarMedicos() {
        const contenedor = document.getElementById('contenedor-medicos');
        contenedor.innerHTML = '';

        const especialidadesDB = JSON.parse(localStorage.getItem('especialidades')) || [];
        const obrasSocialesDB = JSON.parse(localStorage.getItem('obrasSociales')) || [];

        const medicos = obtenerMedicos();
        
        if (medicos.length === 0) {
            contenedor.innerHTML = '<p class="text-center fs-5 mt-4">No hay médicos cargados en el sistema. Ingrese como administrador para añadirlos.</p>';
            return;
        }

        for (let i = 0; i < medicos.length; i++) {
            const medico = medicos[i];

            const nombreCompleto = `${medico.nombre} ${medico.apellido}`;
            
            const esp = especialidadesDB.find(e => e.id == medico.especialidadId);
            const especialidadNombre = esp ? esp.nombre : 'Especialidad no definida';

            let obrasSocialesNombres = 'No acepta';
            if (medico.obrasSocialesIds && medico.obrasSocialesIds.length > 0) {
                obrasSocialesNombres = medico.obrasSocialesIds.map(id => {
                    const os = obrasSocialesDB.find(o => o.id == id);
                    return os ? os.nombre : 'OS no definida';
                }).join(', ');
            } else {
                obrasSocialesNombres = 'Atención Privada';
            }

            const card = document.createElement('div');
            card.className = 'col-12 col-sm-6 col-md-6 col-lg-4 mb-4';

            card.innerHTML = `
                <div class="card shadow-sm">
                    <img src="${medico.imagen}" class="card-img-top object-fit-scale" alt="${nombreCompleto}" style="max-height: 410px;">
                    <div class="card-body">
                        <h5 class="card-title text-center">${nombreCompleto}</h5>
                        <p class="card-text card-text lh-lg mt-3">
                            <strong>Especialidad:</strong> ${especialidadNombre}<br>
                            <strong>Obra social:</strong> ${obrasSocialesNombres}<br>
                        </p>
                    </div>
                </div>
            `;
            
            contenedor.appendChild(card);
        }
    }

    inicializarDatosDemo();
    mostrarMedicos();

});