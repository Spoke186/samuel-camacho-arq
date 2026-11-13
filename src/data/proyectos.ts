// Everything here comes from Samuel's own sheets and his 2025 PDF portfolio (see ESTADO.md for what is still unconfirmed)
import dims from './img.json'

const size = dims as Record<string, [number, number]>
export type Img = { src: string; w: number; h: number; alt: string; plano: boolean }
export const img = (key: string, alt: string): Img => {
  const [w, h] = size[key] ?? [1600, 1000]
  // drawings and sheets are shown whole on white, never cropped
  return { src: `/img/${key}.webp`, w, h, alt, plano: /planta|corte|operaciones|aula|lamina|fachadas|plantas|cortes|plano|portada|meses|sol|topografia|calor|asoleacion|arboles/.test(key) }
}

export const perfil = {
  nombre: 'Samuel Camacho',
  firma: 'Samuel Camacho Arq',
  completo: 'Samuel Camacho Uribe',
  universidad: 'Universidad Católica de Pereira',
  semestre: 'Noveno semestre de Arquitectura',
  ciudad: 'Pereira, Colombia',
  telefono: '318 424 8184',
  whatsapp: 'https://wa.me/573184248184',
  correo: 'samuel.camacho@ucp.edu.co',
}

export type Proyecto = {
  titulo: string
  lugar?: string
  texto: string
  datos?: [string, string][]
  creditos?: string
  imgs: Img[]
}
export type Semestre = { n: string; id: string; año?: string; tema: string; proyectos: Proyecto[] }

export const semestres: Semestre[] = [
  {
    n: '01', id: 's1', año: '2021-2', tema: 'Adición y sustracción',
    proyectos: [{
      titulo: 'Habitáculo en clima desértico',
      texto: 'Un refugio pensado para temperaturas de 35 a 40 °C. Tres rectángulos se suman y se restan hasta formar aula, pórtico y recinto. Los muros de adobe guardan la frescura, una persiana de madera filtra la luz y el volumen sigue los ejes del terreno.',
      datos: [['Materiales', 'Adobe, concreto y madera'], ['Geometría', 'Euclidiana, tres rectángulos']],
      creditos: 'Proyecto I · Docente Arq. Juan Alejandro Marulanda',
      imgs: [
        img('s1/render', 'Refugio de adobe entre las terrazas rojas de un cañón, con cactus y dos figuras'),
        img('s1/ocaso', 'El habitáculo al atardecer desde el fondo del cañón'),
        img('s1/maqueta', 'Maqueta del terreno escalonado con el volumen en planta'),
        img('s1/operaciones', 'Diagrama de operaciones formales: adición y sustracción'),
        img('s1/aula', 'Aula, pórtico y recinto: tres perspectivas interiores'),
      ],
    }],
  },
  {
    n: '02', id: 's2', tema: 'Tres encargos, una ladera',
    proyectos: [
      {
        titulo: 'Parador restaurante – hostal',
        texto: 'Empieza como una circunferencia que se vuelve cilindro y se abre para dejar entrar la luz. Al implantarse en la ladera, el volumen se eleva sobre columnas y sigue las curvas de nivel. Cuatro módulos: servicio, comedores en medio círculo, un mirador en el remate del terreno y un bar circular que cierra la composición.',
        datos: [['Estructura', 'Columnas de piedra y metal, cubierta inclinada'], ['Módulos', 'Servicio, comedores, mirador y bar']],
        creditos: 'Proyecto II · Arq. Daniel Salgado Hernández, Arq. Miguel Ángel Vela Rosero, Arq. Diana Carolina Vargas M.',
        imgs: [
          img('s2/parador', 'El parador circular elevado sobre columnas, con la cascada debajo'),
          img('s2/parador-ocaso', 'El parador en la ladera al atardecer'),
          img('s2/parador-planta', 'Planta en espiral del restaurante'),
          img('s2/parador-ladera', 'Vista lateral del volumen sobre la montaña'),
          img('s2/parador-interior', 'Interior del bar con ventanales hacia el valle'),
          img('s2/parador-corte', 'Corte longitudinal'),
        ],
      },
      {
        titulo: 'Casa medianera',
        texto: 'Una vivienda entre muros vecinos: el volumen se recorta para ganar luz y se abre hacia la calle con un balcón.',
        imgs: [img('s2/medianera', 'Fachada de la casa medianera con su balcón'), img('s2/medianera-2', 'La casa entre sus vecinas')],
      },
      {
        titulo: 'Portería',
        texto: 'Un acceso de madera y concreto con cubierta plana y jardinera.',
        imgs: [img('s2/porteria', 'La portería de madera y concreto'), img('s2/porteria-2', 'La portería a contraluz')],
      },
    ],
  },
  {
    n: '03', id: 's3', tema: 'La luz como material',
    proyectos: [
      {
        titulo: 'UVA El Dorado',
        lugar: 'Barrio El Dorado, Pereira',
        texto: 'Una unidad de vida articulada para los jóvenes del barrio. El hexágono, la forma de las celdas de las abejas, organiza recintos que invitan al recorrido y a la permanencia. Los recorridos se cubren con láminas livianas de metal sobre columnas de madera que evocan árboles.',
        datos: [['Módulo', 'Hexágono'], ['Cubierta', 'Metal liviano sobre columnas de madera']],
        creditos: 'Proyecto III',
        imgs: [
          img('s3/uva', 'Vista aérea de la UVA: hexágonos entre los árboles'),
          img('s3/uva-patio', 'Columnas de madera en forma de árbol bajo la cubierta'),
          img('s3/uva-juego', 'Zona de juegos con trampolín y cubiertas de madera'),
          img('s3/uva-cancha', 'Cancha bajo las cubiertas'),
          img('s3/uva-panal', 'Los módulos hexagonales vistos desde arriba'),
          img('s3/maqueta', 'Maqueta física de los hexágonos con vegetación'),
        ],
      },
      {
        titulo: 'Ejercicios del semestre',
        texto: 'Antes del proyecto: tectónica (lo ligero), estereotomía (lo masivo), una caja de luz que cambia con el sol y una maqueta por capas.',
        imgs: [
          img('s3/tectonica', 'Ejercicio de tectónica: pórticos de madera en el paisaje'),
          img('s3/estereotomia', 'Maqueta de estereotomía en cartón'),
          img('s3/caja-luz', 'Caja de luz: la luz entra por perforaciones circulares'),
          img('s3/capas', 'Maqueta de capas'),
        ],
      },
    ],
  },
  {
    n: '04', id: 's4', tema: 'Vivienda colectiva',
    proyectos: [{
      titulo: 'Vivienda colectiva calle 23',
      lugar: 'Calles 23 y 24 entre carreras 11 y 12, Pereira',
      texto: 'Dos edificios con un primer piso totalmente comercial, tipo galería con jardines interiores y un restaurante. Cinco tipos de apartamento, de 52 a 81 m². El espacio público es un juego de triángulos que conecta la zona verde con los recorridos hacia las torres.',
      datos: [['Apartamentos', '140'], ['Locales comerciales', '18'], ['Parqueaderos de carros', '52'], ['Parqueaderos de motos', '15']],
      creditos: 'Proyecto IV · Arq. Jorge Rincón',
      imgs: [
        img('s4/torre', 'La torre de ladrillo con marcos de concreto sobre la calle'),
        img('s4/multifamiliar', 'Perspectiva de las dos torres escalonadas'),
        img('s4/fachadas', 'Lámina de fachadas, escala 1:100'),
        img('s4/plantas', 'Lámina de plantas y apartamentos tipo'),
        img('s4/cortes', 'Lámina de cortes y perfil vial'),
      ],
    }],
  },
  {
    n: '05', id: 's5', tema: 'Escala barrio',
    proyectos: [{
      titulo: 'Centro integral comunitario Travesuras',
      lugar: 'Barrio Travesuras, Pereira',
      texto: 'Un centro de desarrollo comunitario, capacitación y turismo para un barrio de 128 predios junto a la quebrada. Un corredor verde cose el equipamiento con el espacio público existente.',
      datos: [['Equipamiento', '10.570 m²'], ['Corredor verde', '1.310 m²'], ['Habitantes', '896 aprox.']],
      creditos: 'Proyecto V · Arq. Daniel Fernando Cadena',
      imgs: [
        img('s5/aerea', 'Vista aérea del parque en terrazas'),
        img('s5/parque', 'La plaza con la hoguera y las bancas'),
        img('s5/graderia', 'Gradería abierta'),
        img('s5/edificio', 'Edificio con fachada verde'),
        img('s5/aerea-2', 'El conjunto entre la vegetación'),
        img('s5/lamina', 'Lámina del proyecto'),
      ],
    }],
  },
  {
    n: '06', id: 's6', año: '2024-1', tema: 'Ciudad que no se apaga',
    proyectos: [{
      titulo: 'MOVA Ciudad Pereira',
      texto: 'Vivienda, laboratorios y salas de conferencias para reactivar la calle 14 y mantener vivas las actividades del MOVA de día y de noche.',
      datos: [['Programa', 'Vivienda, laboratorios, aulas y conferencias']],
      creditos: 'Proyecto VI · Arq. Juan Carlos Espinosa, Arq. Andrés Sáenz · con Jean Paul Martínez',
      imgs: [
        img('s6/clid', 'Torre entre los árboles del parque'),
        img('s6/mova', 'Volúmenes blancos del conjunto'),
        img('s6/mova-2', 'Plaza con jardinera central'),
        img('s6/mova-3', 'Vista aérea sobre la ladera'),
        img('s6/mobiliario', 'Jardinera con banca de madera'),
        img('s6/lamina', 'Lámina de cortes y organigrama'),
      ],
    }],
  },
  {
    n: '07', id: 's7', año: '2025-1', tema: 'Casa y ciudad',
    proyectos: [
      {
        titulo: 'Casa campestre Las Margaritas',
        lugar: 'Lote 19',
        texto: 'Para un arquitecto, su esposa, sus motos, dos perros y varios gatos. Máximo dos pisos: abajo la zona social abierta a la terraza y al BBQ, un salón de juegos aislado acústicamente y un garaje con taller; arriba el descanso y un estudio de dibujo.',
        creditos: 'Proyecto VII · Arq. Sandra Milena Granada, Arq. María Alejandra Castaño, Arq. Gustavo Mejía',
        imgs: [
          img('s7/casa', 'La casa con la piscina y la terraza'),
          img('s7/casa-acceso', 'Acceso y garaje'),
          img('s7/casa-terraza', 'Terraza cubierta con pérgola'),
          img('s7/casa-sala', 'Sala hacia el jardín'),
        ],
      },
      {
        titulo: 'Centro cultural de artes y oficios',
        texto: 'Entre una de las iglesias más emblemáticas de la ciudad y su hotel más reconocido. Galerías, talleres, salas multifuncionales y un auditorio que mezclan espacios abiertos y cerrados para que la tradición y lo contemporáneo se encuentren.',
        creditos: 'Proyecto VII · anteproyecto',
        imgs: [
          img('s7/cultural', 'El centro cultural de noche con su fachada de madera'),
          img('s7/cultural-fachada', 'Fachada hacia la calle'),
          img('s7/cultural-corte', 'Corte con el patio arborizado'),
          img('s7/cultural-planta', 'Planta general'),
        ],
      },
    ],
  },
  {
    n: '08', id: 's8', tema: 'Medir el calor',
    proyectos: [{
      titulo: 'Microclima urbano',
      lugar: 'Sectores Gamma y Belmonte, Pereira',
      texto: 'Un análisis del calor en la ciudad: topografía, coberturas, materiales de fachada, horas de sombra de marzo a diciembre y pruebas reales con cámara térmica sobre drywall y vidrio.',
      creditos: 'Optativa I: técnica, tecnología y sostenibilidad · con Ignacio Rojas, Jean Paul Martínez y Diego Gómez',
      imgs: [
        img('s8/calor', 'Mapa de calor del sector'),
        img('s8/proceso', 'Proceso con cámara térmica'),
        img('s8/sol', 'Recorrido solar en 3D'),
      ],
    }],
  },
]

export const obra = {
  titulo: 'De la obra negra a la propuesta',
  texto: 'Fuera del aula: una vivienda real de tres pisos en ladera. Así estaba la obra, en ladrillo a la vista, y así la propuso terminar.',
  antes: img('obra/antes', 'La casa en obra negra: ladrillo a la vista y la placa sin terminar'),
  despues: img('obra/despues', 'Fotomontaje de la propuesta: la casa terminada con tres pisos y escalera exterior'),
  extra: [img('obra/fachada', 'Render de la fachada con garaje doble'), img('obra/render', 'Montaje de la propuesta en su calle'), img('obra/plano-a', 'Planta del apartamento')],
}

// his last project, built (#103): the lot as it was, his render, the finished building (photo of 27 June 2026)
export const construida = {
  titulo: 'Del render a la obra',
  texto: 'En el lote había una casa de dos pisos con un local cerrado a la calle. La proyecté de nuevo: tres pisos, dos garajes y ventanales grandes hacia la calle. Este es el render que entregué y así quedó construida.',
  pasos: [
    { k: 'El lote', d: 'La casa que había', img: { ...img('obra/lote', 'El lote antes de la obra: una casa de dos pisos con un local y un garaje cerrados'), w: 1200, h: 1600, plano: false } },
    { k: 'El render', d: 'La propuesta', img: { ...img('obra/render-34', 'Render de la propuesta: tres pisos con dos garajes y ventanales'), w: 1200, h: 1600, plano: false } },
    { k: 'Construida', d: 'Junio de 2026', img: { ...img('obra/construida', 'El edificio construido: tres pisos, dos garajes con carros y ventanales hacia la calle'), w: 1200, h: 1600, plano: false } },
  ],
}

export const seminario = {
  titulo: 'Sostenibilidad urbana UCP',
  texto: 'Seminario de profundización: diagnóstico ambiental del campus. Islas de calor, asoleación, manejo de aguas lluvias y biodiversidad.',
  creditos: 'Con Gabriela Ospina, Valentina Gil, Isabella López, Juan José Gómez, Alex Castaño y Santiago Rozo',
  imgs: [img('seminario/portada', 'Portada del seminario: polígono 2'), img('seminario/calor', 'Mapa de calor del campus'), img('seminario/asoleacion', 'Asoleación de las fachadas'), img('seminario/arboles', 'Análisis fitotectura')],
}

// ---------- interactive pieces (all from his sheets) ----------
export const partes = [
  { k: 'Pórtico', img: img('s1/portico', 'Pórtico: perspectiva entre cortinas de madera y su lugar en la planta'), txt: 'Espacios semiabiertos con cortinas de madera. Crean profundidad y acercan a los espacios abiertos.' },
  { k: 'Aula', img: img('s1/aula-int', 'Aula: perspectiva entre muros de adobe y su lugar en la planta'), txt: 'Espacios cerrados. Los muros forman cerramientos y dan privacidad dentro del volumen.' },
  { k: 'Recinto', img: img('s1/recinto', 'Recinto: perspectiva abierta al exterior y su lugar en la planta'), txt: 'Espacios abiertos, sin muros altos ni cubiertas. Se relacionan con el exterior y se sienten ligeros.' },
]

export const luz = {
  titulo: 'Caja de luz',
  texto: 'La caja se implanta para que el sol de la mañana entre por el costado izquierdo y el de la tarde por el derecho. Mueve el sol.',
  manana: img('s3/luz-manana', 'Caja de luz con el sol de la mañana: franjas de luz a la izquierda'),
  tarde: img('s3/luz-tarde', 'Caja de luz con el sol de la tarde: círculos de luz a la derecha'),
  visuales: [img('s3/visual-1', 'Visual interior 1 de la caja de luz'), img('s3/visual-2', 'Visual interior 2 de la caja de luz')],
}

export const laminasHD: Record<string, string> = {
  '/img/s4/fachadas.webp': '/img/s4/hd/fachadas.webp',
  '/img/s4/plantas.webp': '/img/s4/hd/plantas.webp',
  '/img/s4/cortes.webp': '/img/s4/hd/cortes.webp',
}

export const encargo = {
  cliente: 'Alejandro Ruiz y Laura Gómez',
  carta: 'Queremos una casa que refleje nuestro estilo de vida: dinámico, moderno y funcional, pero sin perder la calidez de un hogar en el campo.',
  pedidos: [
    { k: 'Una sala abierta, con ventanales grandes hacia el exterior', img: img('s7/casa-sala', 'Sala con ventanales hacia el jardín') },
    { k: 'Terraza cubierta con BBQ, para reuniones y fiestas', img: img('s7/casa-terraza', 'Terraza cubierta con pérgola de madera') },
    { k: 'Garaje grande para la camioneta y las motos', img: img('s7/casa-acceso', 'Acceso y garaje de la casa') },
    { k: 'Máximo dos pisos, con luz natural en cada espacio', img: img('s7/casa', 'La casa de dos pisos con la piscina') },
  ],
}

const MESES = ['Marzo', 'Mayo', 'Junio', 'Septiembre', 'Diciembre']
export const sombras = {
  texto: 'Horas de sombra acumuladas sobre cada sector, de 6:00 a. m. a 12:00 m. y de 12:00 m. a 6:00 p. m., en cinco meses del año.',
  cuadros: MESES.flatMap((m) => [{ mes: m, franja: 'Mañana' }, { mes: m, franja: 'Tarde' }]),
  sectores: [
    { k: 'Gamma', srcs: Array.from({ length: 10 }, (_, i) => `/img/s8/g${String(i + 1).padStart(2, '0')}.webp`) },
    { k: 'Belmonte', srcs: Array.from({ length: 10 }, (_, i) => `/img/s8/b${String(i + 1).padStart(2, '0')}.webp`) },
  ],
}
// ---------- round two ----------
// 01 · his program plan, redrawn: [x, y, w, h, programa, interrelación] in the sheet's own px
export const planta = {
  programa: [['social', 'Social', '#d8322b'], ['descansar', 'Descansar', '#f2a51f'], ['cocinar', 'Cocinar', '#e6dd2c'], ['asear', 'Asear', '#a8742f'], ['circulacion', 'Circulación', '#6fbf4b']],
  relacion: [['union', 'Unión', '#d8322b'], ['superposicion', 'Superposición', '#3f9a3a'], ['penetracion', 'Penetración', '#f2a51f']],
  piezas: [
    [110, 45, 260, 50, 'social', ''],
    [205, 95, 75, 80, '', ''],
    [278, 100, 42, 235, '', 'superposicion'],
    [320, 95, 55, 45, '', 'penetracion'],
    [375, 95, 70, 45, 'cocinar', 'penetracion'],
    [440, 25, 60, 65, 'descansar', 'superposicion'],
    [440, 90, 60, 75, 'asear', 'superposicion'],
    [440, 165, 60, 130, '', 'superposicion'],
    [320, 225, 120, 40, 'circulacion', 'union'],
  ] as [number, number, number, number, string, string][],
}

// 04 · the five apartment types on sheet 2
export const aptos = [
  { k: 'Tipo 1', m2: 81, img: img('s4/apto-1', 'Planta del apartamento tipo 1, 81 m²') },
  { k: 'Tipo 2', m2: 64, img: img('s4/apto-2', 'Planta del apartamento tipo 2, 64 m²') },
  { k: 'Tipo 3', m2: 67, img: img('s4/apto-3', 'Planta del apartamento tipo 3, 67 m²') },
  { k: 'Tipo 4', m2: 58, img: img('s4/apto-4', 'Planta del apartamento tipo 4, 58 m²') },
  { k: 'Tipo 5', m2: 52, img: img('s4/apto-5', 'Planta del apartamento tipo 5, 52 m²') },
]

// 05 · points on the top view of the site (fractions of the image)
export const recorrido = {
  base: img('s5/aerea-2', 'Vista superior del conjunto: terrazas, corredor verde, edificio de celosía y ladera'),
  puntos: [
    { x: 0.4, y: 0.29, k: 'Corredor verde', txt: 'Una franja de 1.310 m² que cose el barrio con el equipamiento a lo largo de las terrazas.', img: img('s5/aerea', 'Las terrazas y el corredor verde desde el aire') },
    { x: 0.565, y: 0.64, k: 'Edificio de celosía', txt: 'El volumen principal del centro, envuelto en una celosía de triángulos.', img: img('s5/edificio', 'El edificio de celosía') },
    { x: 0.35, y: 0.62, k: 'Gradería', txt: 'Un espacio escalonado para reunirse al aire libre junto al volumen oscuro.', img: img('s5/graderia', 'Gradería abierta') },
    { x: 0.76, y: 0.54, k: 'Plaza circular', txt: 'Una plaza redonda con bancas alrededor de un fuego, en el remate del recorrido.', img: img('s5/parque', 'Plaza circular con la hoguera y las bancas') },
    { x: 0.82, y: 0.3, k: 'Ladera', txt: 'La pendiente hacia la quebrada se conserva verde.', img: img('s5/plaza', 'El conjunto entre la vegetación') },
  ],
}

// 08 · four layers drawn on the same base map
export const capas = [
  { k: 'Coberturas', src: '/img/s8/capa-coberturas.webp' },
  { k: 'Alturas', src: '/img/s8/capa-alturas.webp' },
  { k: 'Llenos y vacíos', src: '/img/s8/capa-llenos.webp' },
  { k: 'Materiales de fachada', src: '/img/s8/capa-fachadas.webp' },
]
// photoreal versions made from his renders (Qwen Image 3 Edit, DECISIONS #102), keyed by the render they come from.
// The render stays the default and the label says which one is on screen.
export type Real = { src: string; vid?: { d: string; m: string } }
export const reales: Record<string, Real> = Object.fromEntries(
  ['s1/ocaso', 's2/parador-ocaso', 's2/medianera', 's3/uva', 's4/torre', 's5/aerea', 's6/mova'].map((k) => [`/img/${k}.webp`, { src: `/img/${k}-real.webp` }]),
)
reales['/img/s2/parador-ocaso.webp'].vid = { d: '/video/parador-d.mp4', m: '/video/parador-m.mp4' }
