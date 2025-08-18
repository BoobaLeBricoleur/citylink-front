<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <span class="city">CITY</span><span class="link">LINK</span>
            </div>
            <p class="tagline">Premium Urban Experience</p>
        </div>
        <nav class="sidebar-nav">
            <nuxt-link to="/admin">Dashboard</nuxt-link>
            <!-- Liens visibles uniquement pour les administrateurs -->
            <template v-if="isAdmin">
                <nuxt-link to="/admin/users">Utilisateurs</nuxt-link>
                <nuxt-link to="/admin/business">Commerçants</nuxt-link>
                <nuxt-link to="/admin/events">Événements</nuxt-link>
                <nuxt-link to="/admin/announcements">Annonces</nuxt-link>
                <nuxt-link to="/admin/surveys">Sondages</nuxt-link>
                <nuxt-link to="/admin/informations">Informations</nuxt-link>

            </template>
            <!-- Liens visibles pour les commerçants -->
            <template v-else-if="isBusiness">
                <nuxt-link to="/admin/business">Mes Commerces</nuxt-link>
            </template>
        </nav>
        <div class="back-to-site">
            <nuxt-link to="/">  
                Retour au site
            </nuxt-link>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'AdminSidebar',
    data() {
        return {
            user: null
        }
    },
    computed: {
        isAdmin() {
            return this.user && this.user.role_id === 1;
        },
        isBusiness() {
            return this.user && this.user.role_id === 3;
        }
    },
    mounted() {
        // Récupérer l'utilisateur du localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        }
    }
}
</script>