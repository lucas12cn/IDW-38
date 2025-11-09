import { login } from './api.js';

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
    loginForm.addEventListener('submit', async function (e) {       
      e.preventDefault();
      const user = usernameInput.value.trim();
      const pass = passwordInput.value;

      // llevar a cabo la verificación del usuario
      const usuarios = await login(usernameInput, passwordInput);

      if (usuarios) {                                               
        // Verifica si es el usuario administrador
        sessionStorage.setItem('token', usuarios.accesstoken);
        sessionStorage.setItem('usuarioLogueado', usuarios.username);
        window.Location.href = 'altaMedicos.html';
      } else {                                                      
        mostrarMensaje('Error en credenciales,danger');
      }                                                             

      // Guarda el estado de sesión
      sessionStorage.setItem('isAdmin', esAdmin ? 'true' : 'false');
      sessionStorage.setItem('usuarioLogueado', user);

      // Actualiza la interfaz según el tipo de usuario
      updateUIForAdmin(esAdmin);

      console.log(esAdmin ? 'Admin logueado' : `Usuario ${user} logueado`);
      canal.postMessage({ tipo: 'login', usuario: user });

      // Cierra el modal después de loguear
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) { modal.hide(); }                                  
    });                                                             
  }                                                                 

  // botón de logout
  if (logoutBtn) {                                                  
    logoutBtn.addEventListener('click', function () {               
      sessionStorage.removeItem('isAdmin');
      updateUIForAdmin(false);

      // Notifica a otras pestañas
      canal.postMessage({ tipo: 'logout' });

      window.location.href = 'index.html'; // redirige
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
    const estaEnAdmin = window.location.pathname.includes('administrar.html') ||
                        window.location.pathname.includes('altaMedicos.html');

    if (estaEnAdmin && !esAdmin) {                                  
      window.location.href = 'index.html';
    }                                                               
  }                                                                

  verificarAccesoAdmin();

  // al cargar la página, actualizar la UI según el estado
  updateUIForAdmin(sessionStorage.getItem('isAdmin') === 'true');
});                                                                  







    