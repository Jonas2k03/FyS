import { useState, useEffect, useCallback } from 'react';

export interface Note {
  id: string;
  text: string;
  ts: number;
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  note?: string;
}

// Lista de fotos precargadas en public/fotos
const defaultPhotos: Photo[] = [
  { id: 'default-1', src: '/fotos/Cocinero.jpg', alt: 'Cocinero' },
  { id: 'default-2', src: '/fotos/DormidoHermoso.jpg', alt: 'Dormido Hermoso' },
  { id: 'default-3', src: '/fotos/DuoMaravilla.jpg', alt: 'Duo Maravilla' },
  { id: 'default-4', src: '/fotos/Espaldota.jpg', alt: 'Espaldota' },
  { id: 'default-5', src: '/fotos/HermosaPOSE.jpg', alt: 'Hermosa POSE' },
  { id: 'default-6', src: '/fotos/JulioHpta.jpg', alt: 'Julio' },
  { id: 'default-7', src: '/fotos/Lindobbsito.jpg', alt: 'Lindobbsito' },
  { id: 'default-8', src: '/fotos/Linguini.jpg', alt: 'Linguini' },
  { id: 'default-9', src: '/fotos/Machote.jpg', alt: 'Machote' },
  { id: 'default-10', src: '/fotos/Muylindo.png', alt: 'Muy lindo' },
  { id: 'default-11', src: '/fotos/NiñoHermoso.jpg', alt: 'Niño Hermoso' },
  { id: 'default-12', src: '/fotos/Obama.jpg', alt: 'Obama' },
  { id: 'default-13', src: '/fotos/rico.jpg', alt: 'Rico' },
  { id: 'default-14', src: '/fotos/Sexypayaso.jpg', alt: 'Sexy payaso' },
  { id: 'default-15', src: '/fotos/Yocansado.jpg', alt: 'Yo cansado' },
];

// Lista de canciones precargadas
const defaultSongs: Song[] = [
  {
    id: 'default-song-1',
    title: 'Energía',
    artist: 'Alexis y Fido',
    url: 'https://open.spotify.com/intl-es/track/6Z0LS8Qts9v9sR7N8yt7Ig?si=1cd553bea21e4298',
    note: 'Siento queee algo cambio cuando me le acerqueeeee',
  },
  {
    id: 'default-song-2',
    title: 'Te Juro Que Te Amo',
    artist: 'Los Terrícolas',
    url: 'https://open.spotify.com/intl-es/track/3slDIEuZJqMRq0P0UI8Ps9?si=ce1843bb2d58496f',
    note: 'TE LO JURO',
  },
  {
    id: 'default-song-3',
    title: 'Streets',
    artist: 'Doja Cat',
    url: 'https://open.spotify.com/intl-es/track/60ynsPSSKe6O3sfwRnIBRf?si=f4ed2bca82984466',
    note: 'Cuando te pones bellaco',
  },
  {
    id: 'default-song-4',
    title: 'Orgullo Caqueteño',
    artist: 'Anthony Zambrano',
    url: 'https://open.spotify.com/intl-es/track/4fgufUrve5vgYXN6TM05n5?si=449175b2c00442eb',
    note: 'La tierritaaa',
  },
  {
    id: 'default-song-5',
    title: 'Beso',
    artist: 'Jósean Log',
    url: 'https://open.spotify.com/intl-es/track/4PpuZIMmeng6qPicveSI22?si=8f971609037643cd',
    note: 'Algún día te besaré',
  },
  {
    id: 'default-song-6',
    title: '¿Cómo Hacer Para Olvidarte?',
    artist: 'Manuel Alejandro',
    url: 'https://open.spotify.com/intl-es/track/7p8JhjfckxcuOF0Weixvfa?si=e3a0964b0e9e4bbb',
    note: 'La escuchamos ayeeer.',
  },
  {
    id: 'default-song-7',
    title: 'Die For You',
    artist: 'The Weeknd',
    url: 'https://open.spotify.com/intl-es/track/2Ch7LmS7r2Gy2kc64wv3Bz?si=af9f42c0199749ad',
    note: 'Just know that I would die for you',
  },
  {
    id: 'default-song-8',
    title: 'Cómo Te Quiero Yo',
    artist: 'Kali Uchis',
    url: 'https://open.spotify.com/intl-es/track/2VxQqF52M7IPkiLd4XmTNi?si=eca067abb36d43a2',
    note: 'Y yoooo',
  },
  {
    id: 'default-song-9',
    title: 'luther (with SZA)',
    artist: 'Kendrick Lamar & SZA',
    url: 'https://open.spotify.com/intl-es/track/45J4avUb9Ni0bnETYaYFVJ?si=1802b8d9720f4ccc',
    note: 'Fa, Fa, Fa, Fa Fa Fa, Fa, Faaaaa',
  },
  {
    id: 'default-song-10',
    title: 'Como Tú (Magic Music Box)',
    artist: 'León Larregui',
    url: 'https://open.spotify.com/intl-es/track/05neYxc9nmlxJ7uTOZPlnq?si=da6d4e4a25404ec4',
    note: 'De las primeras...',
  },
  {
    id: 'default-song-11',
    title: 'Right',
    artist: 'Mac Miller',
    url: 'https://open.spotify.com/intl-es/track/165cwz4wGlGz0uDBhxdKLY?si=f0d9993eefeb4473',
    note: 'I have been anxious for your love',
  },
  {
    id: 'default-song-12',
    title: "Nothing's Gonna Hurt You Baby",
    artist: 'Cigarettes After Sex',
    url: 'https://open.spotify.com/intl-es/track/3W7KHojYGgYaoX9ogKO9hU?si=b5b7a72e28d64db7',
    note: '♡',
  },
  {
    id: 'default-song-13',
    title: 'California',
    artist: 'Feid',
    url: 'https://open.spotify.com/intl-es/track/19iUrnYyBAG5LaxT72ajsM?si=ce5c282e65254bb9',
    note: 'Esta es obvia',
  },
];

// Lista de recuerdos/frases precargadas
const defaultMemories: string[] = [
  'Tú bailando California de Feid',
  'Cuando te quedaste dormido mientras veniamos la película (que no hemos acabado), te veías muy tierno.',
  'Cuando acepté tu solicitud de seguimiento en Instagram y le diste like a una historia destacada mía (yo hice lo mismo y ahí empezó todo)',
  'Cuando subiste mi Nota de Feliz Cumpleaños a tus cf de Instagram',
  'Cuando en tu cumpleaños me llamaste, yo acepté la llamada pero tenía el Bluethoot conectado al carro y tuve que colgar de una porque iba con la familia :(, lo siento amor.',
  'La primera vez que le hablé de ti a Jefer y a Duber.',
  'Cuando viste un Mapache y me mandaste foto',
  'Hace pocos días cuando me ganaste en un 1v1 en clash jajsdaj (No volverá a pasar)',
  'Cuando te vi puesta la camiseta del Liverpool, Boffff',
  'Cuando me dices "Te quiero mucho mi amor". Simplemente se me alegra el día',
];

// Lista de notas precargadas
// Usamos timestamps relativos que se calcularán al cargar
const getDefaultNotes = (): Note[] => {
  const now = Date.now();
  return [
    {
      id: 'default-note-1',
      text: 'Soy todo tuyo, y solamente tuyoooo',
      ts: now - 86400000 * 2, // Hace 2 días
    },
    {
      id: 'default-note-2',
      text: 'Eres la felicidad en mi vida',
      ts: now - 86400000, // Hace 1 día
    },
    {
      id: 'default-note-3',
      text: 'Estoy profundamente enamorado de ti',
      ts: now, // Hoy
    },
  ];
};

export function useDashboardStorage() {
  // Fecha fija: 7 de agosto de 2025
  const FIXED_START_DATE = '2025-08-07';
  
  const [startDate, setStartDate] = useState<string>(FIXED_START_DATE);
  const [memories, setMemories] = useState<string[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos del localStorage
  useEffect(() => {
    try {
      const storedMemories = localStorage.getItem('sebas-dashboard:memories');
      const storedNotes = localStorage.getItem('sebas-dashboard:notes');
      const storedPhotos = localStorage.getItem('sebas-dashboard:photos');
      const storedSongs = localStorage.getItem('sebas-dashboard:songs');

      // La fecha siempre es fija
      setStartDate(FIXED_START_DATE);
      
      // Combinar recuerdos guardados con recuerdos por defecto (sin duplicar)
      if (storedMemories) {
        const parsedMemories = JSON.parse(storedMemories);
        if (Array.isArray(parsedMemories) && parsedMemories.length > 0) {
          // Obtener recuerdos existentes como Set para comparación
          const existingMemories = new Set(parsedMemories);
          // Agregar recuerdos por defecto que no estén ya en la lista
          const newDefaultMemories = defaultMemories.filter((memory) => !existingMemories.has(memory));
          // Combinar: primero las por defecto, luego las del usuario
          const combinedMemories = [...newDefaultMemories, ...parsedMemories];
          setMemories(combinedMemories);
          localStorage.setItem('sebas-dashboard:memories', JSON.stringify(combinedMemories));
        } else {
          // Si el array está vacío, cargar recuerdos por defecto
          setMemories(defaultMemories);
          localStorage.setItem('sebas-dashboard:memories', JSON.stringify(defaultMemories));
        }
      } else {
        // Si no hay recuerdos guardados, cargar recuerdos por defecto
        setMemories(defaultMemories);
        localStorage.setItem('sebas-dashboard:memories', JSON.stringify(defaultMemories));
      }
      
      // Combinar notas guardadas con notas por defecto (sin duplicar por texto)
      const defaultNotes = getDefaultNotes();
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
          // Obtener textos de notas existentes como Set para comparación
          const existingTexts = new Set(parsedNotes.map((note: Note) => note.text));
          // Agregar notas por defecto que no estén ya en la lista
          const newDefaultNotes = defaultNotes.filter((note) => !existingTexts.has(note.text));
          // Combinar: primero las por defecto, luego las del usuario
          const combinedNotes = [...newDefaultNotes, ...parsedNotes];
          setNotes(combinedNotes);
          localStorage.setItem('sebas-dashboard:notes', JSON.stringify(combinedNotes));
        } else {
          // Si el array está vacío, cargar notas por defecto
          setNotes(defaultNotes);
          localStorage.setItem('sebas-dashboard:notes', JSON.stringify(defaultNotes));
        }
      } else {
        // Si no hay notas guardadas, cargar notas por defecto
        setNotes(defaultNotes);
        localStorage.setItem('sebas-dashboard:notes', JSON.stringify(defaultNotes));
      }
      
      // Si hay fotos guardadas y no está vacío, usarlas; si no, usar las fotos por defecto
      if (storedPhotos) {
        const parsedPhotos = JSON.parse(storedPhotos);
        if (Array.isArray(parsedPhotos) && parsedPhotos.length > 0) {
          setPhotos(parsedPhotos);
        } else {
          // Si el array está vacío, cargar fotos por defecto
          setPhotos(defaultPhotos);
          localStorage.setItem('sebas-dashboard:photos', JSON.stringify(defaultPhotos));
        }
      } else {
        // Si no hay fotos guardadas, cargar fotos por defecto
        setPhotos(defaultPhotos);
        localStorage.setItem('sebas-dashboard:photos', JSON.stringify(defaultPhotos));
      }
      
      // Combinar canciones guardadas con canciones por defecto (sin duplicar por URL)
      if (storedSongs) {
        const parsedSongs = JSON.parse(storedSongs);
        if (Array.isArray(parsedSongs) && parsedSongs.length > 0) {
          // Obtener URLs de canciones guardadas
          const existingUrls = new Set(parsedSongs.map((song: Song) => song.url));
          // Agregar canciones por defecto que no estén ya en la lista
          const newDefaultSongs = defaultSongs.filter((song) => !existingUrls.has(song.url));
          // Combinar: primero las por defecto, luego las del usuario
          const combinedSongs = [...newDefaultSongs, ...parsedSongs];
          setSongs(combinedSongs);
          localStorage.setItem('sebas-dashboard:songs', JSON.stringify(combinedSongs));
        } else {
          // Si el array está vacío, cargar canciones por defecto
          setSongs(defaultSongs);
          localStorage.setItem('sebas-dashboard:songs', JSON.stringify(defaultSongs));
        }
      } else {
        // Si no hay canciones guardadas, cargar canciones por defecto
        setSongs(defaultSongs);
        localStorage.setItem('sebas-dashboard:songs', JSON.stringify(defaultSongs));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);


  // Guardar startDate (no hace nada, la fecha es fija)
  const saveStartDate = useCallback((date: string) => {
    // La fecha es fija y no se puede cambiar
  }, []);

  // Guardar memories
  const saveMemories = useCallback((newMemories: string[]) => {
    setMemories(newMemories);
    localStorage.setItem('sebas-dashboard:memories', JSON.stringify(newMemories));
  }, []);

  // Guardar notes
  const saveNotes = useCallback((newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('sebas-dashboard:notes', JSON.stringify(newNotes));
  }, []);

  // Guardar photos
  const savePhotos = useCallback((newPhotos: Photo[]) => {
    setPhotos(newPhotos);
    localStorage.setItem('sebas-dashboard:photos', JSON.stringify(newPhotos));
  }, []);

  // Guardar songs
  const saveSongs = useCallback((newSongs: Song[]) => {
    setSongs(newSongs);
    localStorage.setItem('sebas-dashboard:songs', JSON.stringify(newSongs));
  }, []);

  return {
    startDate,
    memories,
    notes,
    photos,
    songs,
    isLoaded,
    saveStartDate,
    saveMemories,
    saveNotes,
    savePhotos,
    saveSongs,
  };
}

