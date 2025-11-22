export default async function mostrarHome() {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = "<h2>Cargando cartas de Yu-Gi-Oh!...</h2>";

  // Lista de las 20 cartas más icónicas de Yu-Gi-Oh!
  const cartasIconicas = [
    "Dark Magician",
    "Blue-Eyes White Dragon",
    "Red-Eyes Black Dragon",
    "Exodia the Forbidden One",
    "Kuriboh",
    "Celtic Guardian",
    "Summoned Skull",
    "Gaia The Fierce Knight",
    "Time Wizard",
    "Dark Magician Girl",
    "Slifer the Sky Dragon",
    "Obelisk the Tormentor",
    "The Winged Dragon of Ra",
    "Black Luster Soldier",
    "Buster Blader",
    "Cyber Dragon",
    "Stardust Dragon",
    "Number 39: Utopia",
    "Elemental HERO Neos",
    "Jinzo"
  ];

  try {
    const todasLasCartas = [];

    // Buscar cada carta individualmente
    for (const nombreCarta of cartasIconicas) {
      try {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(nombreCarta)}`);
        const datos = await response.json();
        if (datos.data && datos.data.length > 0) {
          todasLasCartas.push(datos.data[0]);
        }
      } catch (error) {
        console.log(`No se pudo cargar: ${nombreCarta}`);
      }
    }

    // Limpiar contenedor
    appContainer.innerHTML = "";

    // Agregar logo en lugar del título
    const logoContainer = document.createElement("div");
    logoContainer.className = "logo-container";
    logoContainer.innerHTML = `
      <img src="/Logo_Yu-Gi-Oh.webp" alt="Yu-Gi-Oh! Logo" class="yugioh-logo">
      <p class="subtitle-home">Las Cartas Más Legendarias</p>
    `;
    appContainer.appendChild(logoContainer);

    // Crear contenedor de tarjetas
    const contenedorCartas = document.createElement("div");
    contenedorCartas.className = "cards-grid";

    // Recorrer cada carta y construir la tarjeta
    todasLasCartas.forEach((carta) => {
      const card = document.createElement("div");
      card.className = "card-item";

      // Determinar el tipo de carta
      let tipoCarta = carta.type;
      let atributo = carta.attribute || 'N/A';
      let nivel = carta.level || 'N/A';
      let atk = carta.atk !== undefined ? carta.atk : 'N/A';
      let def = carta.def !== undefined ? carta.def : 'N/A';
      let raza = carta.race || 'N/A';

      // Para cartas de tipo Spell/Trap
      if (tipoCarta.includes('Spell')) {
        atributo = 'SPELL';
        nivel = '-';
        atk = '-';
        def = '-';
      } else if (tipoCarta.includes('Trap')) {
        atributo = 'TRAP';
        nivel = '-';
        atk = '-';
        def = '-';
      }

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${carta.card_images[0].image_url_small}" alt="${carta.name}" class="card-image">
          <div class="card-overlay">
            <span class="card-view-text">👁️ Ver Detalles</span>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${carta.name}</h3>
          <div class="card-info">
            <p><span class="info-label">Tipo:</span> ${tipoCarta}</p>
            <p><span class="info-label">Raza:</span> ${raza}</p>
            <p><span class="info-label">Atributo:</span> ${atributo}</p>
            <p><span class="info-label">Nivel:</span> ${nivel}</p>
            <p><span class="info-label">ATK:</span> ${atk} | <span class="info-label">DEF:</span> ${def}</p>
          </div>
          <p class="card-description">${carta.desc.substring(0, 80)}...</p>
        </div>
      `;

      // Click para ver carta en grande
      card.onclick = () => {
        mostrarCartaGrande(carta);
      };
      
      contenedorCartas.appendChild(card);
    });

    appContainer.appendChild(contenedorCartas);

  } catch (error) {
    console.error("Error al cargar los datos:", error);
    appContainer.innerHTML = "<p>Error al cargar las cartas 😢</p>";
  }
}

// Función para mostrar carta en grande
function mostrarCartaGrande(carta) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  
  // Determinar valores según el tipo de carta
  let atributo = carta.attribute || 'N/A';
  let nivel = carta.level || 'N/A';
  let atk = carta.atk !== undefined ? carta.atk : 'N/A';
  let def = carta.def !== undefined ? carta.def : 'N/A';
  let raza = carta.race || 'N/A';

  if (carta.type.includes('Spell')) {
    atributo = 'SPELL';
    nivel = '-';
    atk = '-';
    def = '-';
  } else if (carta.type.includes('Trap')) {
    atributo = 'TRAP';
    nivel = '-';
    atk = '-';
    def = '-';
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">✕</button>
      <div class="modal-inner">
        <img src="${carta.card_images[0].image_url}" alt="${carta.name}" class="modal-image">
        <div class="modal-info">
          <h2 class="modal-title">${carta.name}</h2>
          <div class="modal-details">
            <p><span class="info-label">Tipo:</span> ${carta.type}</p>
            <p><span class="info-label">Raza:</span> ${raza}</p>
            <p><span class="info-label">Atributo:</span> ${atributo}</p>
            <p><span class="info-label">Nivel:</span> ${nivel}</p>
            <p><span class="info-label">ATK:</span> ${atk} | <span class="info-label">DEF:</span> ${def}</p>
            <hr class="modal-divider">
            <p class="modal-description"><span class="info-label">Descripción:</span><br>${carta.desc}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  modal.onclick = (e) => {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
      modal.remove();
    }
  };
  
  document.body.appendChild(modal);
}