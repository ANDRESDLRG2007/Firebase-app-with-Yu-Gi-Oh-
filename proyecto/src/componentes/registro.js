import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseconfig.js';  // ← minúscula

export default function mostrarRegistro() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="auth-title">Registro</h2>
        <p class="auth-subtitle">Crea tu cuenta de Yu-Gi-Oh! Deck Manager</p>
        
        <div class="auth-form">
          <div class="form-group">
            <label class="auth-label">Nombre</label>
            <input type="text" id="nombre" class="auth-input" placeholder="Tu nombre">
          </div>
          
          <div class="form-group">
            <label class="auth-label">Correo Electrónico</label>
            <input type="email" id="correo" class="auth-input" placeholder="tu@email.com">
          </div>
          
          <div class="form-group">
            <label class="auth-label">Contraseña</label>
            <input type="password" id="contrasena" class="auth-input" placeholder="••••••••">
          </div>
          
          <div class="form-group">
            <label class="auth-label">Fecha de Nacimiento</label>
            <input type="text" id="fecha" class="auth-input" placeholder="DD/MM/AAAA">
          </div>
          
          <div class="form-group">
            <label class="auth-label">Teléfono</label>
            <input type="tel" id="telefono" class="auth-input" placeholder="+57 300 123 4567">
          </div>
          
          <button id="btnRegistro" class="auth-button">
            <span>📝 Registrarse</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("btnRegistro").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const fecha = document.getElementById("fecha").value;
    const telefono = document.getElementById("telefono").value;
    let mazosGuardados = 0;
    let cartasFavoritas = 0;

    if (!nombre || !correo || !contrasena || !fecha || !telefono) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        correo,
        fecha,
        telefono,
        mazosGuardados,
        cartasFavoritas
      });

      alert('✅ Usuario registrado correctamente');
      window.location.reload();
    } catch (error) {
      alert('Error al registrarse: ' + error.message);
    }
  });
}