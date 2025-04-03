<template>
    <div class="profile-page">
      <Header />
  
      <section class="profile-container">
        <div class="profile-sidebar">
          <h1>{{ user.firstname }} {{ user.lastname }}</h1>
          <p class="user-email">{{ user.email }}</p>
          <p v-if="user.company" class="user-company">{{ user.company }}</p>
          
          <div class="profile-menu">
            <button class="profile-menu-item active" @click="setActiveTab('info')">
              <i class="fas fa-user"></i> Informations personnelles
            </button>
            <button class="profile-menu-item" @click="setActiveTab('activities')">
              <i class="fas fa-calendar-alt"></i> Mes activités
            </button>
            <button class="profile-menu-item" @click="setActiveTab('settings')">
              <i class="fas fa-cog"></i> Paramètres
            </button>
          </div>
        </div>
        
        <div class="profile-content">
          <!-- Informations personnelles -->
          <div v-if="activeTab === 'info'" class="profile-section">
            <h3>Mes informations</h3>
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="firstname">Prénom</label>
                  <input type="text" id="firstname" v-model="user.firstname" required />
                </div>
                <div class="form-group">
                  <label for="lastname">Nom</label>
                  <input type="text" id="lastname" v-model="user.lastname" required />
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="user.email" required />
              </div>
              
              <div class="form-group">
                <label for="company">Entreprise</label>
                <input type="text" id="company" v-model="user.company" />
              </div>
              
              <div class="form-actions">
                <button type="submit" class="gold-button" :disabled="loading">
                  <span v-if="loading" class="spinner"></span>
                  Mettre à jour
                </button>
              </div>
            </form>
            
            <div class="password-section">
              <h3>Changer mon mot de passe</h3>
              <form @submit.prevent="updatePassword" class="profile-form">
                <div class="form-group">
                  <label for="currentPassword">Mot de passe actuel</label>
                  <input type="password" id="currentPassword" v-model="passwords.current" required />
                </div>
                
                <div class="form-grid">
                  <div class="form-group">
                    <label for="newPassword">Nouveau mot de passe</label>
                    <input type="password" id="newPassword" v-model="passwords.new" required />
                  </div>
                  <div class="form-group">
                    <label for="confirmPassword">Confirmation</label>
                    <input type="password" id="confirmPassword" v-model="passwords.confirm" required />
                  </div>
                </div>
                
                <div class="form-actions">
                  <button type="submit" class="secondary-button" :disabled="passwordLoading">
                    <span v-if="passwordLoading" class="spinner"></span>
                    Changer le mot de passe
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Mes activités -->
          <div v-if="activeTab === 'activities'" class="profile-section">
            <h3>Événements à venir</h3>
            <div v-if="upcomingEvents.length" class="events-list">
              <div v-for="event in upcomingEvents" :key="event.id" class="activity-card">
                <div class="activity-date">{{ formatDate(event.date) }}</div>
                <div class="activity-content">
                  <h4>{{ event.title }}</h4>
                  <p>{{ event.location }}</p>
                </div>
                <button class="icon-button" @click="cancelParticipation(event.id)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="fas fa-calendar-alt empty-icon"></i>
              <p>Vous n'avez pas encore d'événements à venir</p>
              <router-link to="/events" class="gold-button-small">Découvrir les événements</router-link>
            </div>
            
            <h3>Historique</h3>
            <div v-if="pastEvents.length" class="events-list">
              <div v-for="event in pastEvents" :key="event.id" class="activity-card past">
                <div class="activity-date">{{ formatDate(event.date) }}</div>
                <div class="activity-content">
                  <h4>{{ event.title }}</h4>
                  <p>{{ event.location }}</p>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="fas fa-history empty-icon"></i>
              <p>Aucun historique d'événement</p>
            </div>
          </div>
          
          <!-- Paramètres -->
          <div v-if="activeTab === 'settings'" class="profile-section">
            <h3>Préférences</h3>
            
            <div class="settings-group">
              <h4>Notifications</h4>
              <div class="setting-option">
                <label class="switch">
                  <input type="checkbox" v-model="settings.emailNotifications">
                  <span class="slider"></span>
                </label>
                <div class="setting-label">
                  <p>Notifications par email</p>
                  <span>Recevez des emails sur les nouveaux événements et mises à jour</span>
                </div>
              </div>
              
              <div class="setting-option">
                <label class="switch">
                  <input type="checkbox" v-model="settings.eventReminders">
                  <span class="slider"></span>
                </label>
                <div class="setting-label">
                  <p>Rappels d'événements</p>
                  <span>Recevez un rappel avant vos événements</span>
                </div>
              </div>
            </div>
            
            <div class="settings-group">
              <h4>Confidentialité</h4>
              <div class="setting-option">
                <label class="switch">
                  <input type="checkbox" v-model="settings.publicProfile">
                  <span class="slider"></span>
                </label>
                <div class="setting-label">
                  <p>Profil public</p>
                  <span>Permettre aux autres utilisateurs de voir votre profil</span>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="gold-button" @click="saveSettings" :disabled="settingsLoading">
                <span v-if="settingsLoading" class="spinner"></span>
                Enregistrer les préférences
              </button>
            </div>
            
            <div class="danger-zone">
              <h4>Zone de danger</h4>
              <button class="danger-button" @click="confirmDeleteAccount">
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from "../components/views/Header.vue";
  import Footer from "../components/views/Footer.vue";
  
  export default {
    components: {
      Header,
      Footer
    },
    data() {
      return {
        activeTab: 'info',
        loading: false,
        passwordLoading: false,
        settingsLoading: false,
        user: {
          firstname: 'Jean',
          lastname: 'Dupont',
          email: 'jean.dupont@example.com',
          company: 'CityLink',
          avatar: null
        },
        passwords: {
          current: '',
          new: '',
          confirm: ''
        },
        settings: {
          emailNotifications: true,
          eventReminders: true,
          publicProfile: false
        },
        upcomingEvents: [
          {
            id: 1,
            title: 'Concert de Jazz',
            date: '2025-05-15',
            location: 'Salle des Fêtes'
          },
          {
            id: 2,
            title: 'Marathon de la Ville',
            date: '2025-06-10',
            location: 'Centre-ville'
          }
        ],
        pastEvents: [
          {
            id: 3,
            title: 'Exposition d\'Art',
            date: '2025-03-22',
            location: 'Musée Municipal'
          }
        ]
      };
    },
    computed: {
      userInitials() {
        return (this.user.firstname.charAt(0) + this.user.lastname.charAt(0)).toUpperCase();
      }
    },
    methods: {
      setActiveTab(tab) {
        this.activeTab = tab;
      },
      formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
      },
      async updateProfile() {
        this.loading = true;
        // Simulation d'une API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.loading = false;
        alert('Profil mis à jour avec succès');
      },
      async updatePassword() {
        if (this.passwords.new !== this.passwords.confirm) {
          alert('Les mots de passe ne correspondent pas');
          return;
        }
        
        this.passwordLoading = true;
        // Simulation d'une API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.passwordLoading = false;
        
        // Reset form
        this.passwords = { current: '', new: '', confirm: '' };
        alert('Mot de passe mis à jour avec succès');
      },
      async saveSettings() {
        this.settingsLoading = true;
        // Simulation d'une API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.settingsLoading = false;
        alert('Préférences enregistrées');
      },
      cancelParticipation(eventId) {
        if (confirm('Êtes-vous sûr de vouloir annuler votre participation à cet événement?')) {
          this.upcomingEvents = this.upcomingEvents.filter(event => event.id !== eventId);
        }
      },
      confirmDeleteAccount() {
        if (confirm('Êtes-vous certain de vouloir supprimer votre compte? Cette action est irréversible.')) {
          alert('Compte supprimé avec succès');
          this.$router.push('/');
        }
      }
    },
    mounted() {
      // Ici on récupére les données utilisateur depuis le localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          this.user = { ...this.user, ...userData };
        } catch (e) {
          console.error('Erreur lors de la récupération des données utilisateur:', e);
        }
      }
    }
  };
  </script>