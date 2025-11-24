import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseconfig.js';

export default async function mostrarMisMazos() {
  const contenedor = document.getElementById("app");
  contenedor.innerHTML = "<h2 class='deck-title'>Cargando tus mazos...</h2>";

  try {
    const user = auth.currentUser;
    
    if (!user) {
      contenedor.innerHTML = "<p class='error-message'>Debes iniciar sesión para ver tus mazos</p>";
      return;
    }

    // Consultar los mazos del usuario actual
    const q = query(collection(db, "mazos"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    
    const mazos = [];
    querySnapshot.forEach((doc) => {
      mazos.push({ id: doc.id, ...doc.data() });
    });

    // Limpiar contenedor
    contenedor.innerHTML = "";

    // Título
    const titulo = document.createElement("h2");
    titulo.textContent = "🎴 Mis Mazos Guardados";
    titulo.className = "deck-title";
    contenedor.appendChild(titulo);

    if (mazos.length === 0) {
      const mensajeVacio = document.createElement("div");
      mensajeVacio.className = "empty-mazos-message";
      mensajeVacio.innerHTML = `
        <p>Aún no tienes mazos guardados</p>
        <p class="subtitle-empty">¡Crea tu primer mazo en la sección "Mi Mazo"!</p>
      `;
      contenedor.appendChild(mensajeVacio);
      return;
    }

    const subtitulo = document.createElement("p");
    subtitulo.textContent = `Tienes ${mazos.length} mazo${mazos.length > 1 ? 's' : ''} guardado${mazos.length > 1 ? 's' : ''}`;
    subtitulo.className = "mazos-subtitle";
    contenedor.appendChild(subtitulo);

    // Contenedor de mazos
    const contenedorMazos = document.createElement("div");
    contenedorMazos.className = "mazos-grid";

    mazos.forEach((mazo) => {
      const mazoCard = document.createElement("div");
      mazoCard.className = "mazo-card";

      // Fecha de creación formateada
      const fecha = mazo.fechaCreacion ? new Date(mazo.fechaCreacion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Fecha no disponible';

      mazoCard.innerHTML = `
        <div class="mazo-header">
          <h3 class="mazo-nombre">${mazo.nombreMazo}</h3>
          <button class="mazo-delete-btn" data-id="${mazo.id}">🗑️</button>
        </div>
        <p class="mazo-descripcion">${mazo.descripcion}</p>
        <div class="mazo-info">
          <p><span class="info-label">Fecha:</span> ${fecha}</p>
          <p><span class="info-label">Cartas:</span> ${mazo.numeroCartas || mazo.cartas.length}</p>
        </div>
        <div class="mazo-cartas-preview">
          ${mazo.cartas.slice(0, 8).map(carta => `
            <img src="${carta.image}" alt="${carta.name}" class="carta-preview-img" title="${carta.name}">
          `).join('')}
          ${mazo.cartas.length > 8 ? `<div class="carta-preview-more">+${mazo.cartas.length - 8}</div>` : ''}
        </div>
        <button class="mazo-view-btn" data-mazo-id="${mazo.id}">Ver Mazo Completo</button>
      `;

      contenedorMazos.appendChild(mazoCard);
    });

    contenedor.appendChild(contenedorMazos);

    // Event listeners para botones de eliminar
    document.querySelectorAll('.mazo-delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const mazoId = e.target.getAttribute('data-id');
        const confirmar = confirm('¿Estás seguro de que quieres eliminar este mazo?');
        
        if (confirmar) {
          try {
            await deleteDoc(doc(db, "mazos", mazoId));
            alert('✅ Mazo eliminado correctamente');
            mostrarMisMazos(); // Recargar la vista
          } catch (error) {
            console.error("Error al eliminar:", error);
            alert('❌ Error al eliminar el mazo: ' + error.message);
          }
        }
      });
    });

    // Event listeners para ver mazo completo
    document.querySelectorAll('.mazo-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mazoId = e.target.getAttribute('data-mazo-id');
        const mazo = mazos.find(m => m.id === mazoId);
        if (mazo) {
          mostrarMazoCompleto(mazo);
        }
      });
    });

  } catch (error) {
    console.error("Error al cargar mazos:", error);
    contenedor.innerHTML = "<p class='error-message'>❌ Error al cargar tus mazos</p>";
  }
}

// Función para mostrar el mazo completo en un modal
function mostrarMazoCompleto(mazo) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  
  const fecha = mazo.fechaCreacion ? new Date(mazo.fechaCreacion).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Fecha no disponible';

  modal.innerHTML = `
    <div class="modal-content modal-mazo-completo">
      <button class="modal-close">✕</button>
      <div class="modal-mazo-header">
        <h2 class="modal-title">${mazo.nombreMazo}</h2>
        <p class="modal-mazo-descripcion">${mazo.descripcion}</p>
        <div class="modal-mazo-stats">
          <div class="stat-item">
            <span class="stat-icon">🎴</span>
            <span class="stat-value">${mazo.cartas.length}</span>
            <span class="stat-label">Cartas</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📅</span>
            <span class="stat-value">${fecha.split(',')[0]}</span>
            <span class="stat-label">Creado</span>
          </div>
        </div>
      </div>
      <hr class="modal-divider">
      <h3 class="modal-subtitle">Todas las Cartas del Mazo</h3>
      <div class="modal-cartas-grid">
        ${mazo.cartas.map((carta, index) => `
          <div class="modal-carta-item" data-index="${index}">
            <img src="${carta.image}" alt="${carta.name}">
            <p class="modal-carta-name">${carta.name}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  modal.onclick = (e) => {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
      modal.remove();
    }
  };

  // Event listeners para ver cartas en grande
  document.body.appendChild(modal);
  
  setTimeout(() => {
    document.querySelectorAll('.modal-carta-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = item.getAttribute('data-index');
        const carta = mazo.cartas[index];
        mostrarCartaGrande(carta);
      });
    });
  }, 100);
}

// Función para mostrar carta en grande
function mostrarCartaGrande(carta) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay modal-carta-grande";
  
  modal.innerHTML = `
    <div class="modal-content modal-simple">
      <button class="modal-close">✕</button>
      <img src="${carta.imageLarge}" alt="${carta.name}" class="modal-card-image">
      <h3 class="modal-card-title">${carta.name}</h3>
      <p class="modal-card-hint">Click para cerrar</p>
    </div>
  `;
  
  modal.onclick = (e) => {
    if (e.target.classList.contains('modal-overlay') || 
        e.target.classList.contains('modal-close') || 
        e.target.classList.contains('modal-simple')) {
      modal.remove();
    }
  };
  
  document.body.appendChild(modal);
}