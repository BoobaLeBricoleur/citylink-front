<template>
    <div class="admin-portal">
        <AdminSidebar />
        <div class="main">
            <AdminHeader />
            <div class="intro">
                <h1>Liste des Utilisateurs</h1>
                <p>Ci-dessous, vous trouverez tous les comptes enregistrés.</p>
            </div>

            <!-- Barre de recherche -->
            <div class="search-bar">
                <div class="search-input-wrapper">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <input 
                        type="text"
                        v-model="searchQuery"
                        placeholder="Rechercher un utilisateur..."
                        class="search-input"
                    >
                </div>
            </div>

            <!-- Users list avec navigation au clic -->
            <div class="user-list">
                <div v-if="filteredUsers.length === 0" class="no-users">
                    Aucun utilisateur trouvé.
                </div>
                <ul v-else>
                    <li 
                        v-for="(item, index) in filteredUsers" 
                        :key="index" 
                        class="user-item"
                        @click="goToUserDetail(item.id)"
                    >
                        <div class="user-info">
                            <strong>{{ item.firstname }} {{ item.lastname }}</strong>
                            <span> - {{ item.email }}</span>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { verifyAndLoadProfile } from '~/utils/authGuard.js'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminHeader from '~/components/admin/AdminHeader.vue'

export default {
    components: { AdminSidebar, AdminHeader },
    name: 'AdminUsers',
    data() {
        return {
            users: [],
            user: {},
            searchQuery: '', 
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    computed: {
        filteredUsers() {
            if (!this.searchQuery) return this.users;
            
            const query = this.searchQuery.toLowerCase();
            return this.users.filter(user => 
                user.lastname.toLowerCase().includes(query)
            );
        }
    },
    async mounted() {
        await this.initAuth()
        await this.fetchUsers()
    },
    methods: {
        goToUserDetail(userId) {
            this.$router.push(`/admin/user-detail?id=${userId}`);
        },
        async initAuth() {
            const userData = await verifyAndLoadProfile(this.$router, this.API_URL)
        },
        async fetchUsers() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${this.API_URL}/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                console.log('Utilisateurs récupérés :', response.data)
                this.users = response.data || []
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs :', error)
            }
        }
    }
}
</script>