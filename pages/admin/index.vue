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
                <nuxt-link to="/admin/shops" class="feature-card">
                    <h3>Commerçants</h3>
                    <p>Gérer et visualiser les commerçants partenaires.</p>
                </nuxt-link>
                <nuxt-link to="/admin/events" class="feature-card">
                    <h3>Événements</h3>
                    <p>Créer et gérer les événements pour la communauté urbaine.</p>
                </nuxt-link>
                <nuxt-link to="/admin/announcements" class="feature-card">
                    <h3>Annonces</h3>
                    <p>Publier des annonces et informer les citoyens.</p>
                </nuxt-link>
                <nuxt-link to="/admin/info" class="feature-card">
                    <h3>Informations</h3>
                    <p>Gérer le contenu informatif pour la ville.</p>
                </nuxt-link>
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