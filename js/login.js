document.addEventListener('DOMContentLoaded', function () {
  
  const loginForm = document.getElementById('loginForm');
  const adminBtn = document.getElementById('adminBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const modalElement = document.getElementById('login');

  
  const canal = new BroadcastChannel('canalLogin');

  // función que cambia la nav según estado de login
  function updateUIForAdmin(isAdmin) {
    if (isAdmin) {
      adminBtn.classList.remove('d-none');
      logoutBtn.classList.remove('d-none');
      loginBtn.classList.add('d-none');
    } else {
      adminBtn.classList.add('d-none');
      logoutBtn.classList.add('d-none');
      loginBtn.classList.remove('d-none');
      usernameInput.value = '';
      passwordInput.value = '';
    }
  }

  // evento de envío del formulario
  if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = usernameInput.value.trim();
    const pass = passwordInput.value;

    // Busca el usuario dentro del array global "usuarios"
    const usuarioEncontrado = usuarios.find(
      u => u.usuario === user && u.clave === pass
    );
    if (usuarioEncontrado) {
      // Verifica si es el usuario administrador
      const esAdmin = usuarioEncontrado.usuario === "admin";

      // Guarda el estado de sesión
      sessionStorage.setItem('isAdmin', esAdmin ? 'true' : 'false');
      sessionStorage.setItem('usuarioLogueado', user);

      // Actualiza la interfaz según el tipo de usuario
      updateUIForAdmin(esAdmin);

      console.log(esAdmin ? 'Admin logueado' : `Usuario ${user} logueado`);
      canal.postMessage({ tipo: 'login', usuario: user });
      
      // Cerrar el modal de Bootstrap
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {modal.hide();}
    } else {alert('Usuario o contraseña incorrectos');}
  });
}


  // botón de logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('isAdmin');
      updateUIForAdmin(false);
      
      // Notificar a otras pestañas
      canal.postMessage({ tipo: 'logout' });

      window.location.href = 'index.html'; // redirige a la página principal después de cerrar sesión
    });
  }

  // recibir mensajes de otras pestañas
  canal.onmessage = function (evento) {
    if (evento.data.tipo === 'login') {
      sessionStorage.setItem('isAdmin', 'true');
      updateUIForAdmin(true);
    } else if (evento.data.tipo === 'logout') {
      sessionStorage.removeItem('isAdmin');
      updateUIForAdmin(false);
    }
  };

  // Impide que se ingrese a administrar.html por ruta si no es admin
  function verificarAccesoAdmin() {
        const esAdmin = sessionStorage.getItem('isAdmin') === 'true';
        const estaEnAdmin = window.location.pathname.includes('administrar.html');
    
      if (estaEnAdmin && !esAdmin) {
      window.location.href = 'index.html';
      }
      }
  verificarAccesoAdmin();
  // al cargar la página, actualizar la UI según el estado
  updateUIForAdmin(sessionStorage.getItem('isAdmin') === 'true');
});







    