<template>
    <div class="full-page">
    <Header />
    <div class="login-page">
        <div class="auth-page">
            <div class="auth-container">
                <div class="form-centered">
                    <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
                    <form @submit.prevent="submitForm">
                        <input type="email" v-model="form.email" placeholder="Adresse e-mail" required>
                        <input type="password" v-model="form.password" placeholder="Mot de passe" required>
                        <input v-if="!isLogin" type="password" v-model="form.confirmPassword"
                            placeholder="Confirmer le mot de passe" required>
                        <button type="submit" class="gold-button">{{ isLogin ? 'Se connecter' : 'Sinscrire' }}</button>
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
        },
        async submitForm() {
            this.error = '';
            this.loading = true;
            
            try {
                let response;
                
                if (this.isLogin) {
                    // Connexion - appel direct à l'API
                    response = await axios.post(`${this.API_URL}/users/login`, {
                        email: this.form.email,
                        password: this.form.password
                    });
                    // Stocker les données utilisateur et le token
                    //localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('token', response.data.token);
                    
                    // Redirection après connexion réussie
                    this.$router.push('/');
                } else {
                    // Vérification que les mots de passe correspondent
                    if (this.form.password !== this.form.confirmPassword) {
                        this.error = 'Les mots de passe ne correspondent pas';
                        this.loading = false;
                        return;
                    }
                    
                    // Inscription - appel direct à l'API
                    response = await axios.post(`${this.API_URL}/users/register`, {
                        firstname: this.form.firstname,
                        lastname: this.form.lastname,
                        email: this.form.email,
                        password: this.form.password,
                        company: this.form.company || undefined
                    });
                    
                    // Stocker les données utilisateur et le token
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('token', response.data.token);
                    
                    // Redirection après inscription réussie
                    this.$router.push('/');
                }
            } catch (err) {
                // Gestion des erreurs
                console.error('Erreur:', err);
                this.error = err.response?.data?.message || 'Une erreur est survenue';
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style lang="scss">
.login-page {
    display: flex;
    height: 100%;
    width: 100%;
    background-image: url('/bg-lyon-login.jpg');
}

.full-page {
    height: 100vh;
}

.auth-page {
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

.auth-container {
    display: flex;
    height: 45%;
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    backdrop-filter: blur(10px);
}

.form-centered {
    margin: auto;
    width: 100%;
}

h2 {
    color: var(--cl-light);
    margin-bottom: 20px;
}

form {
    display: flex;
    flex-direction: column;
}

input {
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: none;
    font-size: 1rem;
}

.gold-button {
    background: linear-gradient(90deg, rgba(255, 226, 89, 1) 0%, rgba(255, 167, 81, 1) 100%);
    padding: 10px;
    font-size: 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s linear;
    border: none;
}

.gold-button:hover {
    background: var(--cl-light-hover);
}

.toggle-link {
    color: var(--cl-light);
    margin-top: 10px;
    cursor: pointer;
    text-decoration: underline;
}

@media (max-width: 700px) {
    .auth-container {
        width: 80%;
    }
}

.error-message {
    background-color: rgba(220, 53, 69, 0.2);
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
    font-weight: bold;
}

button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>
