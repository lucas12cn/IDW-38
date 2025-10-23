const formaltaMedico = document.getElementById('altaMedicoForm')
const inputNombre = document.getElementById('Nombre')
const inputEspecialidad = document.getElementById('Especialidad')
const inputObraS = document.getElementById('obraSocial')
const inputTelefono = document.getElementById('Telefono')
const inputEmail = document.getElementById('Email')
const tablaMedicosBody = document.querySelector('#tablaMedicos tbody')
const inputImagen = document.getElementById('imagen')

let flagIndex = null;
function actualizarTabla(){
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    tablaMedicosBody.innerHTML = '';

    medicos.forEach((medico, index) => {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${medico.nombre}</td>
            <td>${medico.especialidad}</td>
            <td>${medico.telefono}</td>
            <td>${medico.obraSocial}</td>
            <td>${medico.email}</td>
            <td><img src="${medico.imagen || 'https://via.placeholder.com/60'}" width="60" height="60" style="border-radius:50%"></td>
            <td>
            <button class="btn btn-sm btn-warning me-2 btn-editar" data-index="${index}">Editar </button>
            <button class="btn btn-sm btn-warning me-2 btn-eliminar" data-index="${index}">Eliminar </button>
        `;
        tablaMedicosBody.appendChild(fila);
    })
}
tablaMedicosBody.addEventListener('click', function(event){
    if(event.target.classList.contains('btn-editar')){
        const index = Number(event.target.dataset.index);
        editarMedicos(index);
    }    
    if(event.target.classList.contains('btn-eliminar')){
        const index = Number(event.target.dataset.index);
        eliminarMedicos(index);
    } 
})


function altaMedicos(event){
    event.preventDefault();

    let nombre = inputNombre.value.trim();
    let especialidad = inputEspecialidad.value.trim();
    let telefono = inputTelefono.value.trim();
    let obraSocial = inputObraS.value.trim();
    let email = inputEmail.value.trim();
    let imagenArchivo = inputImagen.files[0];
    

    if(!nombre || !especialidad || !telefono || !obraSocial || !email){
        alert('Por favor completa lo cuadros requeridos')
        return;
        const reader = new FileReader();

    reader.onload = function(e) {
        const imagenBase64 = e.target.result || null;
    }
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const medico = { nombre, especialidad, telefono, obraSocial, email, imagen: imagenBase64 };

    if(flagIndex !== null){
        medicos[flagIndex] = medico;
        flagIndex = null;
    } else{
        medicos.push(medico);
    alert(
        `Medico Registrado:\n\n` +
        `Nombre: ${nombre}\n`   +
        `Especialidad: ${especialidad}\n`   +
        `Telefono: ${telefono}\n`   +
        `Obra Social: ${obraSocial}\n`   +
        `Email: ${email}\n`
    );
    }

    localStorage.setItem('medicos', JSON.stringify(medicos))
    actualizarTabla();
    formaltaMedico.reset();
    }
if (imagenArchivo) {
        reader.readAsDataURL(imagenArchivo); 
    } else {
        reader.onload({ target: { result: 'https://via.placeholder.com/60' } }); 
    }
}


formaltaMedico.addEventListener('submit', altaMedicos)
document.addEventListener('DOMContentLoaded', actualizarTabla)