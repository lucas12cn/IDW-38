function obtenerMedicos() {
  // toma los medicos guardados en el local, si no hay devuelve un array vacio
  const medicosGuardados = localStorage.getItem('medicos');
  const medicosNuevos = medicosGuardados ? JSON.parse(medicosGuardados) : [];
  
  // une los medicos harcodeados con los medicos del local. Para que los del local no pisen los inciales
  return [...medicosIniciales, ...medicosNuevos];
}

function mostrarMedicos() {
  const contenedor = document.getElementById('contenedor-medicos');
  contenedor.innerHTML = '';

  const medicos = obtenerMedicos();

  for (let i = 0; i < medicos.length; i++) {
    const medico = medicos[i];

    const card = document.createElement('div');
    
    card.className = 'col-12 col-sm-6 col-md-6 col-lg-4 mb-4';

    card.innerHTML = `
      
        <div class="card shadow-sm">
          <img src="${medico.imagen}" class="card-img-top object-fit-scale" alt="${medico.nombre}" style="max-height: 410px;">
          <div class="card-body">
            <h5 class="card-title text-center">${medico.nombre}</h5>
            <p class="card-text card-text lh-lg mt-3">
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