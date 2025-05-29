<template>
    <div class="admin-portal">
        <!-- Sidebar for navigation -->
      <AdminSidebar />

        <!-- Main content area -->
        <div class="main">
            <AdminHeader />
            <div class="intro">
                <h1>Liste des Utilisateurs</h1>
                <p>Ci-dessous, vous trouverez tous les comptes enregistrés.</p>
            </div>

            <!-- Users list -->
            <div class="user-list">
                <div v-if="users.length === 0" class="no-users">
                    Aucun utilisateur trouvé.
                </div>
                <ul v-else>
                    <li v-for="(item, index) in users" :key="index" class="user-item">
                        <strong>{{ item.firstname }} {{ item.lastname }}</strong>
                        <span> - {{ item.email }}</span>
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
            API_URL: process.env.API_URL || 'https://citylink-back.onrender.com/'
        }
    },
    async mounted() {
        await this.initAuth()
        await this.fetchUsers()
    },
    methods: {
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

<style lang="scss">
@use '../../assets/variables.scss' as *;

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

        .user-list {
            background: $color-white-overlay-medium;
            padding: 1rem;
            border-radius: $border-radius-md;
            box-shadow: 0 4px 12px $color-black-overlay-light;
            border: 1px solid $color-white-overlay-light;

            .no-users {
                text-align: center;
                font-size: 1.1rem;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;

                .user-item {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid $color-white-overlay-light;

                    &:last-child {
                        border-bottom: none;
                    }

                    strong {
                        font-weight: 600;
                    }
                }
            }
        }
    }
}
</style>