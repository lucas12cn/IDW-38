document.addEventListener('DOMContentLoaded', function() {
    const formObraSocial = document.getElementById('formObraSocial');
    const inputId = document.getElementById('obraSocialId');
    const inputNombre = document.getElementById('obraSocialNombre');
    const inputDescuento = document.getElementById('obraSocialDescuento');
    const inputDescripcion = document.getElementById('obraSocialDescripcion');
    const tablaBody = document.getElementById('tablaObrasSocialesBody');
    const btnCancelarEdicion = document.getElementById('btnCancelarEdicionOS');

    function obtenerObrasSociales() {
        return JSON.parse(localStorage.getItem('obrasSociales')) || [];
    }

    function guardarObrasSociales(obrasSociales) {
        localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
    }

    function generarNuevoId() {
        const obrasSociales = obtenerObrasSociales();
        if (obrasSociales.length === 0) {
            return 1;
        }
        const maxId = Math.max(...obrasSociales.map(os => os.id));
        return maxId + 1;
    }

    function resetFormulario() {
        formObraSocial.reset();
        inputId.value = '';
        btnCancelarEdicion.classList.add('d-none');
    }

    function renderTablaObrasSociales() {
        const obrasSociales = obtenerObrasSociales();
        tablaBody.innerHTML = '';

        if (obrasSociales.length === 0) {
            tablaBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay obras sociales registradas.</td></tr>';
            return;
        }

        obrasSociales.forEach(os => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="vertical-align: middle;">${os.id}</td>
                <td style="vertical-align: middle;">${os.nombre}</td>
                <td style="vertical-align: middle;"><strong>${os.descuento || 0}%</strong></td>
                <td style="vertical-align: middle;">${os.descripcion || 'N/A'}</td>
                <td style="vertical-align: middle;">
                    <button class="btn btn-sm btn-warning me-2 btn-editar-os" data-id="${os.id}">Editar</button>
                    <button class="btn btn-sm btn-danger btn-eliminar-os" data-id="${os.id}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    function manejarSubmit(event) {
        event.preventDefault();
        
        const nombre = inputNombre.value.trim();
        const descripcion = inputDescripcion.value.trim();
        const descuento = parseFloat(inputDescuento.value) || 0;
        const id = inputId.value;
        
        if (!nombre) {
            alert('Por favor, ingrese un nombre para la obra social.');
            return;
        }
        
        if (descuento < 0 || descuento > 100) {
            alert('El porcentaje de descuento debe estar entre 0 y 100.');
            return;
        }

        const obrasSociales = obtenerObrasSociales();

        if (id) {
            const index = obrasSociales.findIndex(os => os.id == id);
            if (index !== -1) {
                obrasSociales[index].nombre = nombre;
                obrasSociales[index].descripcion = descripcion;
                obrasSociales[index].descuento = descuento;
                alert('Obra Social actualizada con éxito.');
            }
        } else {
            const nuevaObraSocial = {
                id: generarNuevoId(),
                nombre: nombre,
                descripcion: descripcion,
                descuento: descuento
            };
            obrasSociales.push(nuevaObraSocial);
            alert('Obra Social registrada con éxito.');
        }

        guardarObrasSociales(obrasSociales);
        renderTablaObrasSociales();
        resetFormulario();
    }

    function cargarFormularioEdicion(id) {
        const obrasSociales = obtenerObrasSociales();
        const obraSocial = obrasSociales.find(os => os.id == id);

        if (obraSocial) {
            inputId.value = obraSocial.id;
            inputNombre.value = obraSocial.nombre;
            inputDescripcion.value = obraSocial.descripcion;
            inputDescuento.value = obraSocial.descuento || 0;
            btnCancelarEdicion.classList.remove('d-none');
            window.scrollTo(0, 0); 
        }
    }

    function eliminarObraSocial(id) {
        const obrasSociales = obtenerObrasSociales();
        const obraSocial = obrasSociales.find(os => os.id == id);

        if (confirm(`¿Estás seguro que deseas eliminar la obra social "${obraSocial.nombre}"?`)) {
            const nuevasObrasSociales = obrasSociales.filter(os => os.id != id);
            guardarObrasSociales(nuevasObrasSociales);
            renderTablaObrasSociales();
            
            if (inputId.value == id) {
                resetFormulario();
            }
        }
    }

    function manejarClicsTabla(event) {
        if (event.target.classList.contains('btn-editar-os')) {
            const id = Number(event.target.dataset.id);
            cargarFormularioEdicion(id);
        }
        
        if (event.target.classList.contains('btn-eliminar-os')) {
            const id = Number(event.target.dataset.id);
            eliminarObraSocial(id);
        }
    }

    renderTablaObrasSociales();
    formObraSocial.addEventListener('submit', manejarSubmit);
    tablaBody.addEventListener('click', manejarClicsTabla);
    btnCancelarEdicion.addEventListener('click', resetFormulario);

});