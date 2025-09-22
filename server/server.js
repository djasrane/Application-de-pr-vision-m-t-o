import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.METEO_CONCEPT_API_KEY; // Votre clé Meteo Concept

// Middleware
app.use(cors());
app.use(express.json());

// Liste des villes tchadiennes avec codes INSEE (approximatifs - à adapter)
const villesTchad = [
  { id: 1, nom: "N'Djamena", codeInsee: "TD001" },
  { id: 2, nom: "Moundou", codeInsee: "TD002" },
  { id: 3, nom: "Sarh", codeInsee: "TD003" },
  { id: 4, nom: "Abéché", codeInsee: "TD004" },
  { id: 5, nom: "Mongo", codeInsee: "TD005" },
  { id: 6, nom: "Kélo", codeInsee: "TD006" },
  { id: 7, nom: "Koumra", codeInsee: "TD007" },
  { id: 8, nom: "Pala", codeInsee: "TD008" },
  { id: 9, nom: "Am Timan", codeInsee: "TD009" },
  { id: 10, nom: "Bongor", codeInsee: "TD010" }
];

// Cache simple
let cacheMeteo = {};
const CACHE_DURATION = 10 * 60 * 1000;

// Routes API
app.get('/api/villes', (req, res) => {
  try {
    const villesSimplifiees = villesTchad.map(ville => ({
      id: ville.id,
      nom: ville.nom
    }));
    res.json(villesSimplifiees);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/meteo/:villeId', async (req, res) => {
  try {
    const villeId = parseInt(req.params.villeId);
    const ville = villesTchad.find(v => v.id === villeId);

    if (!ville) {
      return res.status(404).json({ error: 'Ville non trouvée' });
    }

    // Vérifier le cache
    const cacheKey = villeId;
    const now = Date.now();
    
    if (cacheMeteo[cacheKey] && (now - cacheMeteo[cacheKey].timestamp < CACHE_DURATION)) {
      console.log('Cache utilisé pour', ville.nom);
      return res.json(cacheMeteo[cacheKey].data);
    }

    // NOUVEAU : Appel à l'API Meteo Concept
    // Pour les villes tchadiennes, on va utiliser une simulation basée sur les données françaises
    const previsions = await getMeteoConceptData(ville.nom);
    
    // Mettre en cache
    cacheMeteo[cacheKey] = { data: previsions, timestamp: now };
    res.json(previsions);

  } catch (error) {
    console.error('Erreur API météo:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des données météo' });
  }
});

// NOUVELLE FONCTION : Récupération des données Meteo Concept
async function getMeteoConceptData(nomVille) {
  try {
    // Meteo Concept API pour les villes françaises, donc on simule pour le Tchad
    // Vous pouvez adapter avec une vraie ville française pour tester
    const url = `https://api.meteo-concept.com/api/forecast/daily?token=${API_KEY}&insee=75056`; // Paris pour test
    
    const response = await axios.get(url);
    const donneesApi = response.data;
    
    return transformerDonneesMeteoConcept(donneesApi, nomVille);
    
  } catch (error) {
    console.log('API Meteo Concept échouée, utilisation des données simulées');
    return genererDonneesSimulees(nomVille);
  }
}

// FONCTION : Transformation des données Meteo Concept
function transformerDonneesMeteoConcept(donneesApi, nomVille) {
  if (!donneesApi || !donneesApi.forecast) {
    throw new Error('Données API invalides');
  }

  const previsions = [];
  
  donneesApi.forecast.forEach((jour, index) => {
    if (index >= 7) return; // Seulement 7 jours
    
    const date = new Date(jour.datetime);
    
    previsions.push({
      date: jour.datetime,
      dateLisible: date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      }),
      temperature: {
        min: Math.round(jour.tmin),
        max: Math.round(jour.tmax)
      },
      condition: {
        main: getConditionPrincipale(jour.weather),
        description: getDescriptionMeteo(jour.weather),
        icon: getIconMeteo(jour.weather)
      },
      ville: nomVille
    });
  });

  return previsions;
}

// FONCTIONS UTILITAIRES pour Meteo Concept
function getConditionPrincipale(codeMeteo) {
  const conditions = {
    0: 'Clear',       // Soleil
    1: 'Clouds',      // Peu nuageux
    2: 'Clouds',      // Ciel voilé
    3: 'Clouds',      // Nuageux
    4: 'Clouds',      // Très nuageux
    5: 'Rain',        // Pluie
    6: 'Rain',        // Pluie forte
    7: 'Snow',        // Neige
    8: 'Rain',        // Pluie éparse
    9: 'Thunderstorm' // Orage
  };
  return conditions[codeMeteo] || 'Clear';
}

function getDescriptionMeteo(codeMeteo) {
  const descriptions = {
    0: 'ensoleillé',
    1: 'peu nuageux',
    2: 'ciel voilé',
    3: 'nuageux',
    4: 'très nuageux',
    5: 'pluvieux',
    6: 'pluie forte',
    7: 'neigeux',
    8: 'pluie éparse',
    9: 'orageux'
  };
  return descriptions[codeMeteo] || 'ensoleillé';
}

function getIconMeteo(codeMeteo) {
  const icons = {
    0: '01d',  // soleil
    1: '02d',  // peu nuageux
    2: '02d',  // voilé
    3: '03d',  // nuageux
    4: '04d',  // très nuageux
    5: '10d',  // pluie
    6: '10d',  // pluie forte
    7: '13d',  // neige
    8: '09d',  // pluie éparse
    9: '11d'   // orage
  };
  return icons[codeMeteo] || '01d';
}

// FONCTION DE SECOURS : Données simulées
function genererDonneesSimulees(nomVille) {
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const conditions = [
    { main: 'Clear', description: 'ensoleillé', icon: '01d' },
    { main: 'Clouds', description: 'partiellement nuageux', icon: '02d' },
    { main: 'Clouds', description: 'nuageux', icon: '03d' },
    { main: 'Rain', description: 'pluvieux', icon: '10d' }
  ];

  const aujourdhui = new Date();
  const previsions = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(aujourdhui);
    date.setDate(aujourdhui.getDate() + i);
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    previsions.push({
      date: date.toISOString().split('T')[0],
      dateLisible: `${jours[date.getDay()]} ${date.getDate()} ${date.toLocaleDateString('fr-FR', { month: 'long' })}`,
      temperature: {
        min: Math.floor(Math.random() * 10) + 25, // 25-35°C
        max: Math.floor(Math.random() * 10) + 35  // 35-45°C
      },
      condition: condition,
      ville: nomVille
    });
  }

  console.log('📡 Données simulées pour', nomVille);
  return previsions;
}

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur météo Tchad - Meteo Concept API',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.listen(PORT, () => {
  console.log(` Serveur météo Tchad démarré sur le port ${PORT}`);
  console.log(` Utilisation de Meteo Concept API`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
});