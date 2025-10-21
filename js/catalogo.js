function obtenerMedicos() {
  // toma los medicos guardados en el local, si no hay devuelve un array vacio
  const medicosGuardados = localStorage.getItem('medicos');
  const medicosNuevos = medicosGuardados ? JSON.parse(medicosGuardados) : [];
  
  // une los medicos arcodeados con los medicos del local. Para que los del local no piden los inciales
  return [...medicosIniciales, ...medicosNuevos];
}

function mostrarMedicos() {
  const contenedor = document.getElementById('contenedor-medicos');
  contenedor.innerHTML = '';

  const medicos = obtenerMedicos();

  for (let i = 0; i < medicos.length; i++) {
    const medico = medicos[i];

    const card = document.createElement('div');
    
    card.className = 'col-md-4 mb-4';

    card.innerHTML = `
      
        <div class="card h-100 shadow-sm">
        <img src="${medico.imagen}" class="card-img-top" alt="${medico.nombre}">
        <div class="card-body">
          <h5 class="card-title">${medico.nombre}</h5>
          <p class="card-text">
            <strong>Especialidad:</strong> ${medico.especialidad}<br>
            <strong>Obra social:</strong> ${medico.obraSocial}<br>
          </p>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  mostrarMedicos();
});