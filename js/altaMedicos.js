document.addEventListener('DOMContentLoaded', function() {

    const formAltaMedico = document.getElementById('altaMedicoForm');
    const tablaMedicosBody = document.getElementById('tablaMedicosBody');
    const btnCancelarEdicion = document.getElementById('btnCancelarEdicionMedico');

    const inputMedicoId = document.getElementById('medicoId');
    const inputNombre = document.getElementById('medicoNombre');
    const inputApellido = document.getElementById('medicoApellido');
    const inputMatricula = document.getElementById('medicoMatricula');
    const selectEspecialidad = document.getElementById('medicoEspecialidad');
    const inputDescripcion = document.getElementById('medicoDescripcion');
    const divObrasSociales = document.getElementById('medicoObrasSocialesCheckboxes');
    const inputValorConsulta = document.getElementById('medicoValorConsulta');
    const inputImagen = document.getElementById('medicoImagen');

    function cargarEspecialidades() {
        const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
        selectEspecialidad.innerHTML = '<option value="" selected disabled>-- Seleccione una especialidad --</option>';
        
        especialidades.forEach(esp => {
            const option = document.createElement('option');
            option.value = esp.id;
            option.textContent = esp.nombre;
            selectEspecialidad.appendChild(option);
        });
    }

    function cargarObrasSociales() {
        const obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
        divObrasSociales.innerHTML = ''; 

        if (obrasSociales.length === 0) {
            divObrasSociales.innerHTML = '<p class="text-muted small m-0">No hay obras sociales cargadas. Agregue obras sociales en su pestaña correspondiente.</p>';
            return;
        }

        obrasSociales.forEach(os => {
            const div = document.createElement('div');
            div.className = 'form-check';
            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${os.id}" id="os-${os.id}">
                <label class="form-check-label" for="os-${os.id}">
                    ${os.nombre}
                </label>
            `;
            divObrasSociales.appendChild(div);
        });
    }

    function obtenerMedicos() {
        return JSON.parse(localStorage.getItem('medicos')) || [];
    }

    function guardarMedicos(medicos) {
        localStorage.setItem('medicos', JSON.stringify(medicos));
    }

    function generarNuevoIdMedico() {
        const medicos = obtenerMedicos();
        if (medicos.length === 0) {
            return 1;
        }
        const maxId = Math.max(...medicos.map(m => m.id));
        return maxId + 1;
    }

    function resetFormulario() {
        formAltaMedico.reset();
        inputMedicoId.value = '';
        btnCancelarEdicion.classList.add('d-none');
        
        const checkboxes = divObrasSociales.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
    }

    function actualizarTabla() {
        const medicos = obtenerMedicos();
        const especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
        
        tablaMedicosBody.innerHTML = '';

        if (medicos.length === 0) {
            tablaMedicosBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay médicos registrados.</td></tr>';
            return;
        }

        medicos.forEach((medico, index) => {
            const especialidad = especialidades.find(e => e.id == medico.especialidadId);
            const nombreEspecialidad = especialidad ? especialidad.nombre : 'N/A';

            let fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="vertical-align: middle;">${medico.nombre} ${medico.apellido}</td>
                <td style="vertical-align: middle;">${medico.matricula}</td>
                <td style="vertical-align: middle;">${nombreEspecialidad}</td>
                <td style="vertical-align: middle;">$${medico.valorConsulta}</td>
                <td style="vertical-align: middle;"><img src="${medico.imagen || 'https://via.placeholder.com/60'}" width="60" height="60" style="border-radius:50%; object-fit: cover;"></td>
                <td style="vertical-align: middle;">
                    <button class="btn btn-sm btn-warning me-2 btn-editar-medico" data-index="${index}">Editar</button>
                    <button class="btn btn-sm btn-danger btn-eliminar-medico" data-index="${index}">Eliminar</button>
                </td>
            `;
            tablaMedicosBody.appendChild(fila);
        });
    }

    function altaMedicos(event) {
        event.preventDefault();

        const id = inputMedicoId.value;
        const nombre = inputNombre.value.trim();
        const apellido = inputApellido.value.trim();
        const matricula = inputMatricula.value.trim();
        const especialidadId = selectEspecialidad.value;
        const descripcion = inputDescripcion.value.trim();
        const valorConsulta = parseFloat(inputValorConsulta.value);
        const imagenArchivo = inputImagen.files[0];

        const obrasSocialesChecks = divObrasSociales.querySelectorAll('input[type="checkbox"]:checked');
        const obrasSocialesIds = Array.from(obrasSocialesChecks).map(cb => parseInt(cb.value));

        if (!nombre || !apellido || !matricula || !especialidadId || isNaN(valorConsulta) || valorConsulta <= 0) {
            alert('Por favor completa todos los campos requeridos (Nombre, Apellido, Matrícula, Especialidad y Valor de Consulta válido).');
            return;
        }

        const medicos = obtenerMedicos();

        const guardarMedico = (imagenBase64) => {
            
            const medico = {
                id: id ? parseInt(id) : generarNuevoIdMedico(),
                nombre,
                apellido,
                matricula,
                especialidadId: parseInt(especialidadId),
                descripcion,
                obrasSocialesIds,
                valorConsulta,
                imagen: imagenBase64
            };

            if (id) {
                const index = medicos.findIndex(m => m.id == id);
                if (index !== -1) {
                    medicos[index] = medico;
                    alert('Médico actualizado con éxito.');
                }
            } else {
                medicos.push(medico);
                alert('Médico registrado con éxito.');
            }
            
            guardarMedicos(medicos);
            actualizarTabla();
            resetFormulario();
        };

        if (imagenArchivo) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagenBase64 = e.target.result;
                guardarMedico(imagenBase64);
            };
            reader.readAsDataURL(imagenArchivo);
        } else {
            let imagenParaGuardar;
            if (id) {
                const medicoExistente = medicos.find(m => m.id == id);
                imagenParaGuardar = medicoExistente.imagen;
            } else {
                imagenParaGuardar = 'https://via.placeholder.com/60';
            }
            guardarMedico(imagenParaGuardar);
        }
    }

    function editarMedicos(index) {
        let medicos = obtenerMedicos();
        let medico = medicos[index];
        
        inputMedicoId.value = medico.id;
        inputNombre.value = medico.nombre;
        inputApellido.value = medico.apellido;
        inputMatricula.value = medico.matricula;
        selectEspecialidad.value = medico.especialidadId;
        inputDescripcion.value = medico.descripcion;
        inputValorConsulta.value = medico.valorConsulta;
        
        const checkboxes = divObrasSociales.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        if (medico.obrasSocialesIds && medico.obrasSocialesIds.length > 0) {
            medico.obrasSocialesIds.forEach(id => {
                const checkbox = document.getElementById(`os-${id}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        btnCancelarEdicion.classList.remove('d-none');
        inputImagen.value = null; 
        window.scrollTo(0, 0); 
    }

    function eliminarMedicos(index) {
        let medicos = obtenerMedicos();
        const medico = medicos[index];

        if (confirm(`¿Estás seguro que deseas eliminar al médico ${medico.nombre} ${medico.apellido}?`)) {
            
            medicos.splice(index, 1);
            guardarMedicos(medicos);
            actualizarTabla();
            
            if (inputMedicoId.value == medico.id) {
                resetFormulario();
            }
        }
    }

    function manejarClicsTabla(event) {
        if (event.target.classList.contains('btn-editar-medico')) {
            const index = Number(event.target.dataset.index);
            editarMedicos(index);
        }
        if (event.target.classList.contains('btn-eliminar-medico')) {
            const index = Number(event.target.dataset.index);
            eliminarMedicos(index);
        }
    }

    cargarEspecialidades();
    cargarObrasSociales();
    actualizarTabla();

    formAltaMedico.addEventListener('submit', altaMedicos);
    tablaMedicosBody.addEventListener('click', manejarClicsTabla);
    btnCancelarEdicion.addEventListener('click', resetFormulario);

    document.getElementById('medicos-tab').addEventListener('click', () => {
        cargarEspecialidades();
        cargarObrasSociales();
    });
});