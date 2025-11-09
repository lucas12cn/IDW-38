import { login } from './auth.js';

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
  function updateUIForAdmin(isLoggedIn) {                             
    if (isLoggedIn) {                                                 
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
      const isUsuarios = await login(user, pass);

      if (isUsuarios) {                                               
        // Guarda el token y usuario (NOTA: la API devuelve 'accessToken' con T mayúscula)
        sessionStorage.setItem('token', isUsuarios.accessToken);
        sessionStorage.setItem('usuarioLogueado', isUsuarios.username);
        
        // Actualiza la interfaz
        updateUIForAdmin(true);

        console.log(`Usuario ${isUsuarios.username} logueado`);
        canal.postMessage({ tipo: 'login', usuario: isUsuarios.username });

        // Cierra el modal después de loguear
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) { modal.hide(); }
        
      } else {                                                      
        mostrarMensaje('Error en credenciales', 'danger');
      }                                                             
    });                                                             
  }                                                                 

  // botón de logout
  if (logoutBtn) {                                                  
    logoutBtn.addEventListener('click', function () {               
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('usuarioLogueado');
      updateUIForAdmin(false);

      // Notifica a otras pestañas
      canal.postMessage({ tipo: 'logout' });

      window.location.href = 'index.html'; // redirige
    });                                                             
  }                                                                 

  // recibir mensajes de otras pestañas
  canal.onmessage = function (evento) {                            
    if (evento.data.tipo === 'login') {                             
      updateUIForAdmin(true);
    } else if (evento.data.tipo === 'logout') {                     
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('usuarioLogueado');
      updateUIForAdmin(false);
    }                                                               
  };                                                                

  // Impide que se ingrese a administrar.html por ruta si no está logueado
  function verificarAccesoAdmin() {                                 
    const estaLogueado = sessionStorage.getItem('token') !== null;
    const estaEnAdmin = window.location.pathname.includes('administrar.html');

    if (estaEnAdmin && !estaLogueado) {                                  
      window.location.href = 'index.html';
    }                                                               
  }                                                                

  verificarAccesoAdmin();

  // al cargar la página, actualizar la UI según el estado
  const estaLogueado = sessionStorage.getItem('token') !== null;
  updateUIForAdmin(estaLogueado);
});





    