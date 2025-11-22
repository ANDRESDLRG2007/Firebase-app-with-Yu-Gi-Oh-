import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig.js';  // ← minúscula
import { auth } from '../firebaseconfig.js';  // ← minúscula

export default function mostrarOriginal() {
  let mazo = {
    nombreMazo: "Mi Mazo Oscuro",
    descripcion: "Mazo enfocado en invocaciones rápidas y control del campo",
    cartas: [],
    numeroCartas: 0
  };

  const contenedor = document.getElementById("app");
  contenedor.innerHTML = "";

  // Título
  const titulo = document.createElement("h2");
  titulo.textContent = "Crear Mazo Yu-Gi-Oh!";
  titulo.className = "deck-title";
  contenedor.appendChild(titulo);

  // Crear formulario
  const form = document.createElement("div");
  form.className = "deck-form";

  // Campo: Nombre del Mazo
  const pNombre = document.createElement("p");
  pNombre.textContent = "Nombre del Mazo";
  pNombre.className = "form-label";
  
  const inputNombre = document.createElement("input");
  inputNombre.className = "form-input";
  inputNombre.placeholder = "Nombre del Mazo";
  inputNombre.value = mazo.nombreMazo;
  inputNombre.oninput = () => {
    mazo.nombreMazo = inputNombre.value;
  };

  // Campo: Descripción
  const pDesc = document.createElement("p");
  pDesc.textContent = "Descripción del Mazo";
  pDesc.className = "form-label";
  
  const inputDesc = document.createElement("textarea");
  inputDesc.className = "form-textarea";
  inputDesc.placeholder = "Describe tu estrategia...";
  inputDesc.value = mazo.descripcion;
  inputDesc.oninput = () => {
    mazo.descripcion = inputDesc.value;
  };

  form.appendChild(pNombre);
  form.appendChild(inputNombre);
  form.appendChild(pDesc);
  form.appendChild(inputDesc);

  // Separador
  const separador1 = document.createElement("hr");
  separador1.className = "form-divider";
  form.appendChild(separador1);

  // Buscador de cartas
  const pBuscador = document.createElement("p");
  pBuscador.textContent = "🔍 Buscar y Agregar Cartas";
  pBuscador.className = "form-label";
  form.appendChild(pBuscador);

  const inputBuscador = document.createElement("input");
  inputBuscador.type = "text";
  inputBuscador.className = "search-input";
  inputBuscador.placeholder = "Escribe al menos 2 caracteres para buscar...";
  form.appendChild(inputBuscador);

  // Contenedor de resultados de búsqueda
  const resultadosBusqueda = document.createElement("div");
  resultadosBusqueda.className = "search-results";
  form.appendChild(resultadosBusqueda);

  // Función para buscar cartas
  let timeoutBusqueda;
  inputBuscador.oninput = async () => {
    const query = inputBuscador.value.trim();
    
    if (query.length < 2) {
      resultadosBusqueda.innerHTML = "";
      return;
    }

    clearTimeout(timeoutBusqueda);
    timeoutBusqueda = setTimeout(async () => {
      try {
        resultadosBusqueda.innerHTML = "<p class='loading-text'>Buscando...</p>";
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(query)}`);
        const datos = await response.json();
        
        resultadosBusqueda.innerHTML = "";
        
        if (datos.data && datos.data.length > 0) {
          const cartasLimitadas = datos.data.slice(0, 20);
          cartasLimitadas.forEach(carta => {
            const cartaDiv = document.createElement("div");
            cartaDiv.className = "search-card";
            
            cartaDiv.innerHTML = `
              <img src="${carta.card_images[0].image_url_small}" alt="${carta.name}">
              <p class="search-card-name">${carta.name}</p>
            `;
            
            cartaDiv.onclick = () => {
              if (mazo.cartas.find(c => c.id === carta.id)) {
                alert("Esta carta ya está en tu mazo");
                return;
              }
              
              mazo.cartas.push({
                id: carta.id,
                name: carta.name,
                image: carta.card_images[0].image_url_small,
                imageLarge: carta.card_images[0].image_url
              });
              mazo.numeroCartas = mazo.cartas.length;
              actualizarMazo();
              inputBuscador.value = "";
              resultadosBusqueda.innerHTML = "";
            };
            
            resultadosBusqueda.appendChild(cartaDiv);
          });
        } else {
          resultadosBusqueda.innerHTML = "<p class='no-results'>No se encontraron cartas</p>";
        }
      } catch (error) {
        resultadosBusqueda.innerHTML = "<p class='error-text'>Error al buscar cartas</p>";
        console.error(error);
      }
    }, 500);
  };

  // Separador
  const separador2 = document.createElement("hr");
  separador2.className = "form-divider";
  form.appendChild(separador2);

  // Contenedor del mazo
  const tituloMazo = document.createElement("h3");
  tituloMazo.textContent = "🎴 Cartas en tu Mazo (0)";
  tituloMazo.className = "deck-subtitle";
  form.appendChild(tituloMazo);

  const contenedorMazo = document.createElement("div");
  contenedorMazo.className = "deck-cards";
  form.appendChild(contenedorMazo);

  // Función para actualizar el mazo
  function actualizarMazo() {
    tituloMazo.textContent = `🎴 Cartas en tu Mazo (${mazo.cartas.length})`;
    contenedorMazo.innerHTML = "";
    
    if (mazo.cartas.length === 0) {
      contenedorMazo.innerHTML = "<p class='empty-deck'>No hay cartas en el mazo</p>";
      contenedorMazo.classList.add('empty');
      return;
    }
    
    contenedorMazo.classList.remove('empty');
    
    mazo.cartas.forEach((carta, index) => {
      const cartaDiv = document.createElement("div");
      cartaDiv.className = "deck-card";
      
      cartaDiv.innerHTML = `
        <img src="${carta.image}" alt="${carta.name}">
        <button class="delete-btn">✕</button>
      `;
      
      // Click en la imagen para ver en grande
      cartaDiv.querySelector('img').onclick = (e) => {
        e.stopPropagation();
        mostrarCartaGrande(carta);
      };
      
      // Click en el botón X para eliminar
      cartaDiv.querySelector('button').onclick = (e) => {
        e.stopPropagation();
        mazo.cartas.splice(index, 1);
        mazo.numeroCartas = mazo.cartas.length;
        actualizarMazo();
      };
      
      contenedorMazo.appendChild(cartaDiv);
    });
  }

  // Función para mostrar carta en grande
  function mostrarCartaGrande(carta) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    
    modal.innerHTML = `
      <div class="modal-content modal-simple">
        <button class="modal-close">✕</button>
        <img src="${carta.imageLarge}" alt="${carta.name}" class="modal-card-image">
        <h3 class="modal-card-title">${carta.name}</h3>
        <p class="modal-card-hint">Click para cerrar</p>
      </div>
    `;
    
    modal.onclick = (e) => {
      if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
        modal.remove();
      }
    };
    
    document.body.appendChild(modal);
  }

  // Botón para guardar en Firebase
  const botonGuardar = document.createElement("button");
  botonGuardar.textContent = "💾 Guardar Mazo en Firebase";
  botonGuardar.className = "save-btn";

  botonGuardar.onclick = async () => {
    if (mazo.cartas.length === 0) {
      alert("❌ Debes agregar al menos una carta al mazo");
      return;
    }

    if (!mazo.nombreMazo.trim()) {
      alert("❌ Debes darle un nombre al mazo");
      return;
    }

    try {
      const user = auth.currentUser;
      const mazoConUsuario = {
        ...mazo,
        userId: user.uid,
        nombreUsuario: user.email,
        fechaCreacion: new Date().toISOString()
      };

      await addDoc(collection(db, "mazos"), mazoConUsuario);
      alert("✅ Mazo guardado correctamente en Firebase!");
      
      // Limpiar formulario
      mazo.nombreMazo = "Mi Mazo Oscuro";
      mazo.descripcion = "Mazo enfocado en invocaciones rápidas y control del campo";
      mazo.cartas = [];
      mazo.numeroCartas = 0;
      inputNombre.value = mazo.nombreMazo;
      inputDesc.value = mazo.descripcion;
      actualizarMazo();
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      alert("❌ Ocurrió un error al guardar en Firebase: " + error.message);
    }
  };

  form.appendChild(botonGuardar);
  contenedor.appendChild(form);
  actualizarMazo();
}