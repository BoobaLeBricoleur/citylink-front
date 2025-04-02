<script>
import Header from '../components/views/Header.vue'
import Footer from '../components/views/Footer.vue'

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            isLogin: true,
            form: {
                email: '',
                password: '',
                confirmPassword: ''
            }
        };
    },
    methods: {
        toggleForm() {
            this.isLogin = !this.isLogin;
        },
        submitForm() {

        }
    }
}
</script>

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
</style>
