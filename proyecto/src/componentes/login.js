import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseconfig.js';  // ← minúscula

export default function mostrarLogin() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="auth-title">Iniciar Sesión</h2>
        <p class="auth-subtitle">Accede a tu cuenta de Yu-Gi-Oh! Deck Manager</p>
        
        <div class="auth-form">
          <div class="form-group">
            <label class="auth-label">Correo Electrónico</label>
            <input type="email" id="correo" class="auth-input" placeholder="tu@email.com" />
          </div>
          
          <div class="form-group">
            <label class="auth-label">Contraseña</label>
            <input type="password" id="contrasena" class="auth-input" placeholder="••••••••" />
          </div>
          
          <button id="btnLogin" class="auth-button">
            <span>Ingresar</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("btnLogin").addEventListener("click", async () => {
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    if (!correo || !contrasena) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
      window.location.reload();
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  });
}