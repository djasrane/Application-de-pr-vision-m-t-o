# Application-de-pr-vision-m-t-o

# Table des Matières

    Description

    Fonctionnalités

    Technologies Utilisées

    Architecture du Projet

    Installation et Démarrage

    API Endpoints

    Structure des Données

    Captures d'Écran

    Auteurs

# Description

Application web responsive permettant d'afficher les prévisions météorologiques sur 7 jours pour les principales villes tchadiennes. Développée dans le cadre d'un projet de formation en développement fullstack.
# Fonctionnalités

## Frontend

     Interface responsive (mobile/desktop)

     Sélecteur de villes tchadiennes

     Prévisions sur 7 jours avec températures min/max

     Affichage des conditions météo avec icônes

     Design moderne et intuitif

     Gestion des états (loading, erreurs, succès)

## Backend

     API RESTful avec Express.js

     Gestion du cache des données météo

     Validation des données

     Gestion des erreurs complète

     CORS configuré pour le frontend

#  Technologies Utilisées

### Backend
Librairie	Version	Usage
express	^4.18.2	Framework web Node.js
cors	^2.8.5	Gestion des CORS
axios	^1.5.0	Requêtes HTTP vers API externe
dotenv	^16.3.1	Gestion des variables d'environnement
nodemon	^3.0.1	Redémarrage auto en développement
### Frontend
Technologie	Usage
HTML5	Structure sémantique
CSS3	Styles responsive avec Grid/Flexbox
JavaScript ES6+	Logique applicative orientée objet
Font Awesome	Icones modernes
Google Fonts	Typographie responsive
API Externe
Service	Usage
OpenWeatherMap	Données météorologiques
Meteo Concept	Alternative (API française)
# Architecture du Projet
text

Application-de-prévision-météo/
├──  server/                 # Backend Node.js/Express
│   ├──  server.js          # Serveur principal
│   ├──  package.json       # Dépendances backend
│   ├──  .env              # Variables d'environnement
│   └──  .gitignore        # Fichiers ignorés par Git
│
├──  client/                 # Frontend
│   ├──  index.html         # Page principale
│   ├──  style.css          # Styles CSS responsive
│   └──  script.js          # Logique JavaScript
│
├──  .gitignore             # Configuration Git
├──  README.md              # Documentation
└──  package.json           # Configuration projet

# Installation et Démarrage
Prérequis

    Node.js (version 22 ou supérieure)

    npm (gestionnaire de paquets)

    Clé API OpenWeatherMap ou Meteo Concept

# Installation

    Cloner le repository

bash

git clone git@github.com:djasrane/Application-de-pr-vision-m-t-o.git
cd Application-de-prévision-météo

    Installer les dépendances backend

bash

cd server
npm install

    Configurer les variables d'environnement

bash

# Créer le fichier .env dans server/
touch .env

    Ajouter votre clé API dans .env

env

# Pour OpenWeatherMap
OPENWEATHER_API_KEY=votre_cle_api_ici

# Pour Meteo Concept
METEO_CONCEPT_API_KEY=votre_cle_meteo_concept_ici

PORT=3001

# Démarrage

    Démarrer le serveur backend

bash

cd server
npm start
# ou pour le développement
npm run dev

    Ouvrir le frontend

bash

# Dans un nouveau terminal
cd client
# Ouvrir index.html dans le navigateur

    Accéder à l'application

text

Frontend: http://localhost:3000 (ou le port du serveur local)
Backend API: http://localhost:3001


# Structure des Données
Ville
typescript

interface Ville {
  id: number;
  nom: string;
  lat: number;    // Latitude
  lon: number;    // Longitude
}

Prévision Météo
typescript

interface Prevision {
  date: string;           // YYYY-MM-DD
  dateLisible: string;    // "lundi 15 janvier"
  temperature: {
    min: number;          // Température minimale (°C)
    max: number;          // Température maximale (°C)
  };
  condition: {
    main: string;         // "Clear", "Rain", etc.
    description: string;  // Description en français
    icon: string;         // Code icône OpenWeatherMap
  };
  ville: string;          // Nom de la ville
}

[HEADER] Météo Tchad - Prévisions 7 jours

[SELECTEUR] ▾ N'Djamena ▾ [Actualiser]

[CARTE PRINCIPALE]
 N'Djamena - Lundi 15 janvier
Max: 38°C | Min: 25°C • Ensoleillé

[PRÉVISIONS 7 JOURS]
┌─────────┬──────┬─────────────┐
│  Mar 16 │ ☀️  │ 37°C • 24°C │
│  Mer 17 │ ⛅  │ 36°C • 23°C │
│  Jeu 18 │ 🌧️  │ 35°C • 22°C │
└─────────┴──────┴─────────────┘


# Auteurs

Djasrane Tolba Succés
    Développeur Full Stack junior

    Date de création : 22/09/2025

📄 Licence

Ce projet est développé dans un cadre éducatif. Les données météo sont fournies par des APIs tierces.
 Liens Utiles

    Documentation OpenWeatherMap

    Documentation Meteo Concept

    Guide de contribution

⭐ N'oubliez pas de donner une étoile au repository si ce projet vous est utile !


