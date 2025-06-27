<template>
  <div class="profile-page">
    <Header />

    <section class="profile-container">
      <div class="profile-sidebar">
        <div class="profile-avatar">
          <div v-if="!user.avatar" class="profile-avatar-placeholder">
            {{ userInitials }}
          </div>
          <img v-else :src="user.avatar" :alt="$t('pages.profile.profile.photo_alt')" />
        </div>
        <h2>{{ user.firstname }} {{ user.lastname }}</h2>
        <p class="user-email">{{ user.email }}</p>
        <p v-if="user.company" class="user-company">{{ user.company }}</p>

        <div class="profile-menu">
          <button class="profile-menu-item" :class="{ active: activeTab === 'info' }" @click="setActiveTab('info')">
            <Icon name="heroicons:user" /> {{ $t('pages.profile.menu.personal_info') }}
          </button>
          <button class="profile-menu-item" :class="{ active: activeTab === 'activities' }" @click="setActiveTab('activities')">
            <Icon name="heroicons:calendar-days" /> {{ $t('pages.profile.menu.my_activities') }}
          </button>
          <button class="profile-menu-item" :class="{ active: activeTab === 'settings' }" @click="setActiveTab('settings')">
            <Icon name="heroicons:cog-6-tooth" /> {{ $t('pages.profile.menu.settings') }}
          </button>
        </div>
      </div>

      <div class="profile-content">
        <!-- Message d'alerte -->
        <div v-if="message" class="alert" :class="messageType">
          {{ message }}
        </div>

        <!-- Informations personnelles -->
        <div v-if="activeTab === 'info'" class="profile-section">
          <h3>{{ $t('pages.profile.personal_info.title') }}</h3>
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="firstname">{{ $t('pages.profile.personal_info.firstname') }}</label>
                <input type="text" id="firstname" v-model="form.firstname" required />
              </div>
              <div class="form-group">
                <label for="lastname">{{ $t('pages.profile.personal_info.lastname') }}</label>
                <input type="text" id="lastname" v-model="form.lastname" required />
              </div>
            </div>

            <div class="form-group">
              <label for="email">{{ $t('pages.profile.personal_info.email') }}</label>
              <input type="email" id="email" v-model="form.email" required />
            </div>

            <div class="form-group">
              <label for="company">{{ $t('pages.profile.personal_info.company') }}</label>
              <input type="text" id="company" v-model="form.company" />
            </div>

            <div class="form-actions">
              <button type="submit" class="gold-button" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                {{ $t('pages.profile.personal_info.update_button') }}
              </button>
            </div>
          </form>

          <div class="password-section">
            <h3>{{ $t('pages.profile.personal_info.password_section.title') }}</h3>
            <form @submit.prevent="updatePassword" class="profile-form">
              <div class="form-group">
                <label for="currentPassword">{{ $t('pages.profile.personal_info.password_section.current') }}</label>
                <input type="password" id="currentPassword" v-model="passwords.current" required />
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="newPassword">{{ $t('pages.profile.personal_info.password_section.new') }}</label>
                  <input type="password" id="newPassword" v-model="passwords.new" required />
                </div>
                <div class="form-group">
                  <label for="confirmPassword">{{ $t('pages.profile.personal_info.password_section.confirm') }}</label>
                  <input type="password" id="confirmPassword" v-model="passwords.confirm" required />
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="gold-button" :disabled="passwordLoading">
                  <span v-if="passwordLoading" class="spinner"></span>
                  {{ $t('pages.profile.personal_info.password_section.button') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Mes activités -->
        <div v-if="activeTab === 'activities'" class="profile-section">
          <h3>{{ $t('pages.profile.activities.upcoming.title') }}</h3>
          <div v-if="upcomingEvents.length" class="events-list">
            <div v-for="event in upcomingEvents" :key="event.id" class="activity-card">
              <div class="activity-date">{{ formatDate(event.date) }}</div>
              <div class="activity-content">
                <h4>{{ event.title }}</h4>
                <p>{{ event.location }}</p>
              </div>
              <button class="icon-button" @click="cancelParticipation(event.id)">
                <Icon name="heroicons:x-mark" />
              </button>
            </div>
          </div>
          <div v-else class="empty-state">
            <Icon name="heroicons:calendar-days" class="empty-icon" />
            <p>{{ $t('pages.profile.activities.upcoming.empty') }}</p>
            <router-link to="/events" class="gold-button-small">{{ $t('pages.profile.activities.upcoming.discover') }}</router-link>
          </div>

          <h3>{{ $t('pages.profile.activities.history.title') }}</h3>
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
            <Icon name="heroicons:clock" class="empty-icon" />
            <p>{{ $t('pages.profile.activities.history.empty') }}</p>
          </div>
        </div>

        <!-- Paramètres -->
        <div v-if="activeTab === 'settings'" class="profile-section">
          <h3>{{ $t('pages.profile.settings.title') }}</h3>

          <div class="settings-group">
            <h4>{{ $t('pages.profile.settings.notifications.title') }}</h4>
            <div class="setting-option">
              <label class="switch">
                <input type="checkbox" v-model="settings.emailNotifications">
                <span class="slider"></span>
              </label>
              <div class="setting-label">
                <p>{{ $t('pages.profile.settings.notifications.email.title') }}</p>
                <span>{{ $t('pages.profile.settings.notifications.email.description') }}</span>
              </div>
            </div>

            <div class="setting-option">
              <label class="switch">
                <input type="checkbox" v-model="settings.eventReminders">
                <span class="slider"></span>
              </label>
              <div class="setting-label">
                <p>{{ $t('pages.profile.settings.notifications.reminders.title') }}</p>
                <span>{{ $t('pages.profile.settings.notifications.reminders.description') }}</span>
              </div>
            </div>
          </div>

          <div class="settings-group">
            <h4>{{ $t('pages.profile.settings.privacy.title') }}</h4>
            <div class="setting-option">
              <label class="switch">
                <input type="checkbox" v-model="settings.publicProfile">
                <span class="slider"></span>
              </label>
              <div class="setting-label">
                <p>{{ $t('pages.profile.settings.privacy.public_profile.title') }}</p>
                <span>{{ $t('pages.profile.settings.privacy.public_profile.description') }}</span>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="gold-button" @click="saveSettings" :disabled="settingsLoading">
              <span v-if="settingsLoading" class="spinner"></span>
              {{ $t('pages.profile.settings.save_button') }}
            </button>
          </div>

          <div class="danger-zone">
            <h4>{{ $t('pages.profile.settings.danger_zone.title') }}</h4>
            <button class="danger-button" @click="confirmDeleteAccount">
              {{ $t('pages.profile.settings.danger_zone.delete_account') }}
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
import axios from 'axios';

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      API_URL: process.env.API_URL || 'http://localhost:3000/api',
      activeTab: 'info',
      loading: false,
      passwordLoading: false,
      settingsLoading: false,
      message: '',
      messageType: 'success',
      user: {
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        company: '',
        avatar: null,
        role_id: 2
      },
      form: {
        firstname: '',
        lastname: '',
        email: '',
        company: ''
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
    },
    token() {
      return localStorage.getItem('token');
    },
    axiosConfig() {
      return {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      };
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
    
    formatDate(dateString) {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString(this.$i18n.locale, options);
    },
    
    showMessage(msg, type = 'success') {
      this.message = msg;
      this.messageType = type;
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        this.message = '';
      }, 3000);
    },
    
    // Charger les informations de l'utilisateur
    async loadUserProfile() {
      try {
        const response = await axios.get(`${this.API_URL}/users/profile`, this.axiosConfig);
        
        // Mettre à jour l'objet user avec les données reçues
        this.user = { ...this.user, ...response.data };
        
        // Copier les données dans le formulaire
        this.form.firstname = this.user.firstname || '';
        this.form.lastname = this.user.lastname || '';
        this.form.email = this.user.email || '';
        this.form.company = this.user.company || '';
        
        console.log("Données chargées:", this.form);
      } catch (err) {
        console.error('Erreur lors de la récupération du profil:', err);
        if (err.response?.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.$router.push('/account');
        } else {
          this.showMessage(
            err.response?.data?.message || this.$t('alerts.error.load_profile'), 
            'error'
          );
        }
      }
    },  
    
    // Mettre à jour le profil
    async updateProfile() {
      this.loading = true;
      
      try {
        await axios.put(`${this.API_URL}/users/${this.user.id}`, this.form, this.axiosConfig);
        
        // Mettre à jour les données utilisateur dans le localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...userData,
          firstname: this.form.firstname,
          lastname: this.form.lastname,
          email: this.form.email,
          company: this.form.company
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Mettre à jour l'objet user local
        this.user = {
          ...this.user,
          ...this.form
        };
        
        this.showMessage(this.$t('alerts.profile_updated'));
      } catch (err) {
        console.error('Erreur lors de la mise à jour du profil:', err);
        this.showMessage(
            err.response?.data?.message || this.$t('pages.profile.alerts.error.load_profile'),
            'error'
        );
      } finally {
        this.loading = false;
      }
    },
    
    // Changer le mot de passe
    async updatePassword() {
      if (this.passwords.new !== this.passwords.confirm) {
        this.showMessage(this.$t('pages.profile.alerts.password_mismatch'), 'error');
        return;
      }
      
      this.passwordLoading = true;
      
      try {
        await axios.post(
          `${this.API_URL}/users/change-password`,
          {
            currentPassword: this.passwords.current,
            newPassword: this.passwords.new
          },
          this.axiosConfig
        );
        
        // Réinitialiser le formulaire
        this.passwords = { current: '', new: '', confirm: '' };
        this.showMessage(this.$t('pages.profile.alerts.password_updated'));
      } catch (err) {
        console.error('Erreur lors du changement de mot de passe:', err);
        this.showMessage(
            err.response?.data?.message || this.$t('pages.profile.alerts.error.change_password'),
            'error'
        );
      } finally {
        this.passwordLoading = false;
      }
    },
    
    // Enregistrer les paramètres (simulation pour le moment)
    async saveSettings() {
      this.settingsLoading = true;
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.settingsLoading = false;
      this.showMessage(this.$t('pages.profile.alerts.settings_saved'));
    },
    
    // Annuler la participation à un événement (simulation)
    cancelParticipation(eventId) {
      if (confirm(this.$t('alerts.confirm_cancel'))) {
        this.upcomingEvents = this.upcomingEvents.filter(event => event.id !== eventId);
        this.showMessage(this.$t('pages.profile.alerts.participation_canceled'));
      }
    },
    
    // Supprimer le compte utilisateur
    async confirmDeleteAccount() {
      if (confirm(this.$t('alerts.confirm_delete'))) {
        try {
          await axios.delete(`${this.API_URL}/users/${this.user.id}`, this.axiosConfig);
          
          // Déconnexion et redirection
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          this.$router.push('/');
          this.showMessage(this.$t('alerts.account_deleted'));
        } catch (err) {
          console.error('Erreur lors de la suppression du compte:', err);
          this.showMessage(
              err.response?.data?.message || this.$t('pages.profile.alerts.error.delete_account'),
              'error'
          );
        }
      }
    }
  },
  mounted() {
    // Vérifier si l'utilisateur est connecté
    if (!this.token) {
      this.$router.push('/account');
      return;
    }
    
    // Récupérer les données utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = { ...this.user, ...JSON.parse(storedUser) };
        // Copier les données dans le formulaire
        this.form = {
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          email: this.user.email,
          company: this.user.company || ''
        };
      } catch (e) {
        console.error('Erreur lors de la récupération des données utilisateur:', e);
      }
    }
    
    // Charger les données à jour depuis l'API
    this.loadUserProfile();
  }
};
</script>