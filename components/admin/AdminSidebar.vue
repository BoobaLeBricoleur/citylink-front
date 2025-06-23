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
            <nuxt-link to="/admin/users">Utilisateurs</nuxt-link>
            <nuxt-link to="/admin/business">Commerçants</nuxt-link>
            <nuxt-link to="/admin/events">Événements</nuxt-link>
            <nuxt-link to="/admin/announcements">Annonces</nuxt-link>
            <nuxt-link to="/admin/info">Informations</nuxt-link>
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
    name: 'AdminSidebar'
}
</script>