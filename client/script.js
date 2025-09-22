class MeteoApp {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3001/api';
        this.villes = [];
        this.villeActuelle = null;
        
        this.initializeApp();
    }

    // Initialisation de l'application
    initializeApp() {
        this.bindEvents();
        this.loadVilles();
    }

    // Liaison des événements
    bindEvents() {
        const villeSelect = document.getElementById('villeSelect');
        const refreshBtn = document.getElementById('refreshBtn');

        villeSelect.addEventListener('change', (e) => {
            this.onVilleChange(e.target.value);
        });

        refreshBtn.addEventListener('click', () => {
            this.refreshMeteo();
        });
    }

    // Chargement de la liste des villes
    async loadVilles() {
        try {
            this.showLoading();
            const response = await fetch(`${this.API_BASE_URL}/villes`);
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des villes');
            }

            this.villes = await response.json();
            this.populateVilleSelect();
            this.hideLoading();

        } catch (error) {
            this.showError('Impossible de charger la liste des villes');
            console.error('Erreur:', error);
        }
    }

    // Remplissage du sélecteur de villes
    populateVilleSelect() {
        const select = document.getElementById('villeSelect');
        select.innerHTML = '<option value="">-- Sélectionnez une ville --</option>';

        this.villes.forEach(ville => {
            const option = document.createElement('option');
            option.value = ville.id;
            option.textContent = ville.nom;
            select.appendChild(option);
        });
    }

    // Changement de ville sélectionnée
    async onVilleChange(villeId) {
        if (!villeId) {
            this.hideWeather();
            return;
        }

        this.villeActuelle = villeId;
        await this.loadMeteo(villeId);
    }

    // Chargement des données météo
    async loadMeteo(villeId) {
        try {
            this.showLoading();
            this.hideError();
            this.hideWeather();

            const response = await fetch(`${this.API_BASE_URL}/meteo/${villeId}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur API');
            }

            const meteoData = await response.json();
            this.displayMeteo(meteoData);
            this.hideLoading();

        } catch (error) {
            this.showError(`Erreur météo: ${error.message}`);
            this.hideLoading();
            console.error('Erreur météo:', error);
        }
    }

    // Actualisation des données
    refreshMeteo() {
        if (this.villeActuelle) {
            this.loadMeteo(this.villeActuelle);
        }
    }

    // Affichage des données météo
    displayMeteo(meteoData) {
        if (!meteoData || meteoData.length === 0) {
            this.showError('Aucune donnée météo disponible');
            return;
        }

        // Météo actuelle (premier jour)
        this.displayCurrentWeather(meteoData[0]);
        
        // Prévisions des jours suivants
        this.displayForecast(meteoData.slice(1));
        
        this.showWeather();
    }

    // Affichage de la météo actuelle
    displayCurrentWeather(currentData) {
        document.getElementById('currentCity').textContent = currentData.ville;
        document.getElementById('currentDate').textContent = currentData.dateLisible;
        document.getElementById('currentMax').textContent = currentData.temperature.max;
        document.getElementById('currentMin').textContent = currentData.temperature.min;
        document.getElementById('currentDescription').textContent = currentData.condition.description;

        const iconUrl = `https://openweathermap.org/img/wn/${currentData.condition.icon}@2x.png`;
        document.getElementById('currentIcon').src = iconUrl;
        document.getElementById('currentIcon').alt = currentData.condition.description;
    }

    // Affichage des prévisions
    displayForecast(forecastData) {
        const forecastContainer = document.getElementById('forecastDays');
        forecastContainer.innerHTML = '';

        forecastData.forEach(day => {
            const dayElement = this.createForecastDayElement(day);
            forecastContainer.appendChild(dayElement);
        });
    }

    // Création d'un élément de prévision journalière
    createForecastDayElement(dayData) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'forecast-day';

        const iconUrl = `https://openweathermap.org/img/wn/${dayData.condition.icon}.png`;

        dayDiv.innerHTML = `
            <div class="forecast-date">${this.formatShortDate(dayData.dateLisible)}</div>
            <div class="forecast-icon">
                <img src="${iconUrl}" alt="${dayData.condition.description}">
            </div>
            <div class="forecast-desc">${dayData.condition.description}</div>
            <div class="forecast-temp">
                <span class="temp-max-day">${dayData.temperature.max}°</span>
                <span class="temp-min-day">${dayData.temperature.min}°</span>
            </div>
        `;

        return dayDiv;
    }

    // Formatage de la date
    formatShortDate(dateLisible) {
        return dateLisible.split(' ')[0]; // Retourne juste le jour de la semaine
    }

    // Gestion de l'affichage
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('refreshBtn').disabled = true;
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('refreshBtn').disabled = false;
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorMessage').classList.remove('hidden');
    }

    hideError() {
        document.getElementById('errorMessage').classList.add('hidden');
    }

    showWeather() {
        document.getElementById('currentWeather').classList.remove('hidden');
        document.getElementById('forecast').classList.remove('hidden');
    }

    hideWeather() {
        document.getElementById('currentWeather').classList.add('hidden');
        document.getElementById('forecast').classList.add('hidden');
    }
}

// Initialisation de l'application au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    new MeteoApp();
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Erreur globale:', event.error);
});