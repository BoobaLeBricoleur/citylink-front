<template>
  <div class="full-page">
    <Header />
    <div class="login-page">
      <div class="auth-page">
        <div class="auth-container">
          <div class="form-centered">
            <div class="auth-header">
              <h2>{{ isLogin ? 'Bienvenue' : 'Rejoignez-nous' }}</h2>
              <p class="auth-subtitle">{{ isLogin ? 'Connectez-vous pour accéder à votre espace' : 'Créez votre compte en quelques étapes' }}</p>
            </div>
            
            <div v-if="error" class="error-message">
              <span class="error-icon">!</span>
              {{ error }}
            </div>
            
            <div class="form-scroll-container" :class="{ 'login-form': isLogin }">
              <form @submit.prevent="submitForm">
                <!-- Formulaire de connexion -->
                <template v-if="isLogin">
                  <div class="form-group">
                    <label>Email</label>
                    <input type="email" v-model="form.email" placeholder="votre@email.com" required class="auth-input">
                  </div>
                  
                  <div class="form-group">
                    <label>Mot de passe</label>
                    <input type="password" v-model="form.password" placeholder="••••••••" required class="auth-input">
                  </div>
                </template>
                
                <!-- Formulaire d'inscription -->
                <template v-else>
                  <!-- Sélection du type de compte -->
                  <div class="account-type-selector">
                    <button type="button" 
                            class="account-type-btn" 
                            :class="{ active: !isCompany }"
                            @click="isCompany = false">
                      <i class="fas fa-user"></i> Particulier
                    </button>
                    <button type="button" 
                            class="account-type-btn" 
                            :class="{ active: isCompany }"
                            @click="isCompany = true">
                      <i class="fas fa-building"></i> Professionnel
                    </button>
                  </div>
                  
                  <!-- Informations de base -->
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Prénom</label>
                      <input type="text" v-model="form.firstname" placeholder="Votre prénom" required class="auth-input">
                    </div>
                    <div class="form-group">
                      <label>Nom</label>
                      <input type="text" v-model="form.lastname" placeholder="Votre nom" required class="auth-input">
                    </div>
                  </div>
                  
                  <!-- Champ entreprise (uniquement si professionnel) -->
                  <div v-if="isCompany" class="form-group">
                    <label>Entreprise</label>
                    <input type="text" v-model="form.company" placeholder="Nom de votre entreprise" required class="auth-input">
                  </div>
                  
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Email</label>
                      <input type="email" v-model="form.email" placeholder="votre@email.com" required class="auth-input">
                    </div>
                    <div class="form-group">
                      <label>Téléphone</label>
                      <input type="tel" v-model="form.phone" placeholder="06 12 34 56 78" class="auth-input">
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label>Adresse</label>
                    <input type="text" v-model="form.address" placeholder="Votre adresse" class="auth-input">
                  </div>
                  
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Code postal</label>
                      <input type="text" v-model="form.postal_code" placeholder="Code postal" class="auth-input">
                    </div>
                    <div class="form-group">
                      <label>Ville</label>
                      <input type="text" v-model="form.city" placeholder="Votre ville" class="auth-input">
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label>Date de naissance</label>
                    <input type="date" v-model="form.birthday" class="auth-input">
                  </div>
                  
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Mot de passe</label>
                      <input type="password" v-model="form.password" placeholder="••••••••" required class="auth-input">
                    </div>
                    <div class="form-group">
                      <label>Confirmation</label>
                      <input type="password" v-model="form.confirmPassword" placeholder="••••••••" required class="auth-input">
                    </div>
                  </div>
                  
                  <div class="checkboxes-container">
                    <div class="form-group checkbox-group">
                      <label class="checkbox-container">
                        <input type="checkbox" v-model="form.mail_new_events" checked>
                        <span class="checkmark"></span>
                        Recevoir des notifications pour les nouveaux événements
                      </label>
                    </div>
                    
                    <div class="form-group checkbox-group">
                      <label class="checkbox-container">
                        <input type="checkbox" v-model="form.mail_events" checked>
                        <span class="checkmark"></span>
                        Recevoir des rappels pour mes événements
                      </label>
                    </div>
                    
                    <div class="form-group checkbox-group">
                      <label class="checkbox-container">
                        <input type="checkbox" v-model="form.public_profile">
                        <span class="checkmark"></span>
                        Profil public (visible par les autres utilisateurs)
                      </label>
                    </div>
                  </div>
                </template>
                
                <button type="submit" class="gold-button" :disabled="loading">
                  <span v-if="loading" class="spinner"></span>
                  {{ isLogin ? 'Se connecter' : 'Créer mon compte' }}
                </button>
              </form>
            </div>
            
            <p @click="toggleForm" class="toggle-link">
              {{ isLogin ? "Pas encore de compte ? Inscrivez-vous." : "Déjà un compte ? Connectez-vous." }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '../components/views/Header.vue'
import Footer from '../components/views/Footer.vue'
import axios from 'axios'

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      isLogin: true,
      isCompany: false,
      form: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        address: '',
        postal_code: '',
        city: '',
        phone: '',
        birthday: null,
        mail_new_events: true,
        mail_events: true,
        public_profile: false
      },
      error: '',
      loading: false,
      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.error = '';
      
      // Réinitialiser le formulaire
      if (!this.isLogin) {
        this.form = {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '',
          company: '',
          address: '',
          postal_code: '',
          city: '',
          phone: '',
          birthday: null,
          mail_new_events: true,
          mail_events: true,
          public_profile: false
        };
        this.isCompany = false;
      }
    },
    async submitForm() {
      this.error = '';
      this.loading = true;
      
      try {
        let response;
        
        if (this.isLogin) {
          // Connexion
          response = await axios.post(`${this.API_URL}/users/login`, {
            email: this.form.email,
            password: this.form.password
          });
          
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          
          this.$router.push('/');
        } else {
          // Vérification des mots de passe
          if (this.form.password !== this.form.confirmPassword) {
            this.error = 'Les mots de passe ne correspondent pas';
            this.loading = false;
            return;
          }
          
          // Formatage de la date pour MySQL
          let formattedBirthday = null;
          if (this.form.birthday) {
            formattedBirthday = this.form.birthday;
          }
          
          // Préparation des données selon le type de compte
          const userData = {
            firstname: this.form.firstname,
            lastname: this.form.lastname,
            email: this.form.email,
            password: this.form.password,
            address: this.form.address || null,
            postal_code: this.form.postal_code || null,
            city: this.form.city || null,
            phone: this.form.phone || null,
            birthday: formattedBirthday,
            mail_new_events: this.form.mail_new_events,
            mail_events: this.form.mail_events,
            public_profile: this.form.public_profile
          };
          
          // Ajout du champ entreprise uniquement pour les pros
          if (this.isCompany && this.form.company) {
            userData.company = this.form.company;
          }
          
          // Inscription
          response = await axios.post(`${this.API_URL}/users/register`, userData);
          
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          
          this.$router.push('/');
        }
      } catch (err) {
        console.error('Erreur:', err);
        this.error = err.response?.data?.message || 'Une erreur est survenue';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
