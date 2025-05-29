<template>
    <div class="admin-portal">
        <AdminSidebar />
        <div class="main">
            <div class="intro">
                <h1>Admin Dashboard</h1>
                <p>Bienvenue, {{ user.firstname }} {{ user.lastname }} !</p>
                <p v-if="user.email">Email : {{ user.email }}</p>
                <p v-if="user.company">Entreprise : {{ user.company }}</p>
            </div>

            <!-- Dynamic feature shortcuts -->
            <div class="feature-grid">
                <nuxt-link to="/admin/users" class="feature-card">
                    <h3>Utilisateurs</h3>
                    <p>Gérer et visualiser la liste des utilisateurs de la ville.</p>
                </nuxt-link>
<!--                <nuxt-link to="/admin/shops" class="feature-card">-->
<!--                    <h3>Commerçants</h3>-->
<!--                    <p>Gérer et visualiser les commerçants partenaires.</p>-->
<!--                </nuxt-link>-->
<!--                <nuxt-link to="/admin/events" class="feature-card">-->
<!--                    <h3>Événements</h3>-->
<!--                    <p>Créer et gérer les événements pour la communauté urbaine.</p>-->
<!--                </nuxt-link>-->
                <nuxt-link to="/admin/announcements" class="feature-card">
                    <h3>Annonces</h3>
                    <p>Publier des annonces et informer les citoyens.</p>
                </nuxt-link>
<!--                <nuxt-link to="/admin/info" class="feature-card">-->
<!--                    <h3>Informations</h3>-->
<!--                    <p>Gérer le contenu informatif pour la ville.</p>-->
<!--                </nuxt-link>-->
            </div>
        </div>
    </div>
</template>

<script>
import { verifyAndLoadProfile } from '~/utils/authGuard.js'

export default {
    name: 'AdminIndex',
    data() {
        return {
            user: {},
            form: { firstname: '', lastname: '', email: '' },
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    mounted() {
        this.initAuth()
    },
    methods: {
        async initAuth() {
            const userData = await verifyAndLoadProfile(this.$router, this.API_URL)
            if (userData) {
                this.user = userData
                this.form.firstname = userData.firstname || ''
                this.form.lastname = userData.lastname || ''
                this.form.email = userData.email || ''
            }
        }
    }
}
</script>

<style lang="scss">
@use '../../assets/variables.scss' as *;

body {
    margin: 0;
    padding: 0;
}

.admin-portal {
    display: flex;
    height: 100vh;
    font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, $color-primary-dark 0%, $color-primary 50%, $color-primary-dark 100%);
    color: $color-text-light;

    

    .main {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;

        .intro {
            background: $color-white-overlay-medium;
            padding: 2rem;
            border-radius: $border-radius-md;
            box-shadow: 0 4px 12px $color-black-overlay-light;
            margin-bottom: 2rem;
            border: 1px solid $color-white-overlay-light;

            h1 {
                margin-top: 0;
                margin-bottom: 1rem;
                color: $color-text-light;
                font-size: 1.8rem;
            }

            p {
                margin: 0.25rem 0;
            }
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;

            .feature-card {
                background: $color-white-overlay-light;
                padding: 1.5rem;
                border-radius: $border-radius-md;
                text-decoration: none;
                color: $color-text-light;
                border: 1px solid $color-white-overlay-light;
                box-shadow: 0 4px 12px $color-black-overlay-light;
                transition: $transition-fast;

                &:hover {
                    background: $color-white-overlay-medium;
                    transform: translateY(-3px);
                }

                h3 {
                    margin-top: 0;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    font-size: 1.2rem;
                }

                p {
                    margin: 0;
                    font-size: 0.9rem;
                    color: $color-text-light;
                }
            }
        }
    }
}
</style>