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
              
              <form @submit.prevent="submitForm">
                <div class="form-grid" v-if="!isLogin">
                  <div class="form-group">
                    <label>Prénom</label>
                    <input type="text" v-model="form.firstname" placeholder="Votre prénom" required>
                  </div>
                  <div class="form-group">
                    <label>Nom</label>
                    <input type="text" v-model="form.lastname" placeholder="Votre nom" required>
                  </div>
                </div>
                
                <div class="form-group" v-if="!isLogin">
                  <label>Entreprise</label>
                  <input type="text" v-model="form.company" placeholder="Nom de votre entreprise (optionnel)">
                </div>
                
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" v-model="form.email" placeholder="votre@email.com" required>
                </div>
                
                <div class="form-group">
                  <label>Mot de passe</label>
                  <input type="password" v-model="form.password" placeholder="••••••••" required>
                </div>
                
                <div class="form-group" v-if="!isLogin">
                  <label>Confirmation</label>
                  <input type="password" v-model="form.confirmPassword" placeholder="••••••••" required>
                </div>
                
                <button type="submit" class="gold-button" :disabled="loading">
                  <span v-if="loading" class="spinner"></span>
                  {{ isLogin ? 'Se connecter' : 'Créer mon compte' }}
                </button>
              </form>
              
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
        form: {
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '',
          company: ''
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
            
            // Inscription
            response = await axios.post(`${this.API_URL}/users/register`, {
              firstname: this.form.firstname,
              lastname: this.form.lastname,
              email: this.form.email,
              password: this.form.password,
              company: this.form.company || undefined
            });
            
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