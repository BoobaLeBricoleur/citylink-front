<template>
  <div class="full-page">
    <Header />
    <div class="login-page">
      <div class="auth-page">
        <div class="auth-container">
          <div class="form-centered">
            <div class="auth-header">
              <h2>{{ isLogin ? $t('pages.account.welcome') : $t('pages.account.join_us') }}</h2>
              <p class="auth-subtitle">{{ isLogin ? $t('pages.account.login_subtitle') : $t('pages.account.register_subtitle') }}</p>
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
                    <label>{{ $t('pages.account.email') }}</label>
                    <input type="email" v-model="form.email" placeholder="votre@email.com" required class="auth-input">
                  </div>

                  <div class="form-group">
                    <label>{{ $t('pages.account.password') }}</label>
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
                      <Icon name="heroicons:user" /> {{ $t('pages.account.individual') }}
                    </button>
                    <button type="button"
                            class="account-type-btn"
                            :class="{ active: isCompany }"
                            @click="isCompany = true">
                      <Icon name="heroicons:building-office" /> {{ $t('pages.account.professional') }}
                    </button>
                  </div>

                  <!-- Informations de base -->
                  <div class="form-grid">
                    <div class="form-group">
                      <label>{{ $t('pages.account.firstname') }}</label>
                      <input type="text" v-model="form.firstname" placeholder="Votre prénom" required class="auth-input">
                    </div>
                    <div class="form-group">
                      <label>{{ $t('pages.account.lastname') }}</label>
                      <input type="text" v-model="form.lastname" placeholder="Votre nom" required class="auth-input">
                    </div>
                  </div>

                  <!-- Champ entreprise (uniquement si professionnel) -->
                  <div v-if="isCompany" class="form-group">
                    <label>{{ $t('pages.account.company') }}</label>
                    <input type="text" v-model="form.company" placeholder="Nom de votre entreprise" required class="auth-input">
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label>{{ $t('pages.account.email') }}</label>
                      <input type="email" v-model="form.email" placeholder="votre@email.com" required class="auth-input">
                    </div>
                    <div class="form-group">
                      <label>{{ $t('pages.account.phone') }}</label>
                      <input type="tel" v-model="form.phone" placeholder="06 12 34 56 78" class="auth-input">
                    </div>
                  </div>

                  <div class="form-group">
                    <label>{{ $t('pages.account.address') }}</label>
                    <input type="text" v-model="form.address" placeholder="Votre adresse" class="auth-input">
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label>{{ $t('pages.account.postal_code') }}</label>
                      <input type="text" v-model="form.postal_code" placeholder="Code postal" class="auth-input">
                    </div>
                    <div class="form-group">
                      <label>{{ $t('pages.account.city') }}</label>
                      <input type="text" v-model="form.city" placeholder="Votre ville" class="auth-input">
                    </div>
                  </div>

                  <div class="form-group">
                    <label>{{ $t('pages.account.birthday') }}</label>
                    <input type="date" v-model="form.birthday" class="auth-input">
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label>{{ $t('pages.account.password') }}</label>
                      <input type="password" v-model="form.password" placeholder="••••••••" required class="auth-input">
                    </div>
                    <div class="form-group">
                      <label>{{ $t('pages.account.confirm_password') }}</label>
                      <input type="password" v-model="form.confirmPassword" placeholder="••••••••" required class="auth-input">
                    </div>
                  </div>

                  <div class="checkboxes-container">
                    <div class="form-group checkbox-group">
                      <label class="checkbox-container">
                        <input type="checkbox" v-model="form.mail_new_events" checked>
                        <span class="checkmark"></span>
                        {{ $t('pages.account.notify_new_events') }}
                      </label>
                    </div>

                    <div class="form-group checkbox-group">
                      <label class="checkbox-container">
                        <input type="checkbox" v-model="form.mail_events" checked>
                        <span class="checkmark"></span>
                        {{ $t('pages.account.notify_my_events') }}
                      </label>
                    </div>

                    <div class="form-group checkbox-group">
                      <label class="checkbox-container">
                        <input type="checkbox" v-model="form.public_profile">
                        <span class="checkmark"></span>
                        {{ $t('pages.account.public_profile') }}
                      </label>
                    </div>
                  </div>
                </template>

                <button type="submit" class="gold-button" :disabled="loading">
                  <span v-if="loading" class="spinner"></span>
                  {{ isLogin ? $t('pages.account.login_button') : $t('pages.account.register_button') }}
                </button>
              </form>
            </div>

            <p @click="toggleForm" class="toggle-link">
              {{ isLogin ? $t('pages.account.to_register') : $t('pages.account.to_login') }}
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
      API_URL: process.env.API_URL || 'https://citylink-back.onrender.com/api'
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
            this.error = this.$t('pages.account.errors.password_mismatch');
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
        this.error = err.response?.data?.message || this.$t('pages.account.errors.default');
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>