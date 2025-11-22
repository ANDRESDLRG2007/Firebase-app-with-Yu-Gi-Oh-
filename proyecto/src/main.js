import './style.css';
import { auth } from './firebaseconfig.js';  // ← minúscula
import { onAuthStateChanged } from 'firebase/auth';
import mostrarHome from './componentes/home.js';
import mostrarLogin from './componentes/login.js';
import mostrarRegistro from './componentes/registro.js';
import mostrarOriginal from './componentes/original.js';
import mostrarLogout from './componentes/logout.js';

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("menu").innerHTML = `
      <nav>
        <button id="menuHome">Home</button>
        <button id="menuOriginal">Mi Mazo</button>
        <button id="menuLogout">Logout</button>
      </nav>
    `;

    document.getElementById("menuHome").addEventListener("click", mostrarHome);
    document.getElementById("menuOriginal").addEventListener("click", mostrarOriginal);
    document.getElementById("menuLogout").addEventListener("click", mostrarLogout);
    
    mostrarHome();
  } else {
    document.getElementById("menu").innerHTML = `
      <nav>
        <button id="menuLogin">Login</button>
        <button id="menuRegistro">Registro</button>
      </nav>
    `;

    document.getElementById("menuLogin").addEventListener("click", mostrarLogin);
    document.getElementById("menuRegistro").addEventListener("click", mostrarRegistro);
    
    mostrarLogin();
  }
});