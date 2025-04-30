<template>
    <div class="admin-portal">
        <!-- Sidebar for navigation -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <span class="city">CITY</span><span class="link">LINK</span>
                </div>
                <p class="tagline">Premium Urban Experience</p>
            </div>
            <nav class="sidebar-nav">
                <nuxt-link to="/admin">Dashboard</nuxt-link>
                <nuxt-link to="/admin/users" exact>Utilisateurs</nuxt-link>
                <nuxt-link to="/admin/shops">Commerçants</nuxt-link>
                <nuxt-link to="/admin/events">Événements</nuxt-link>
                <nuxt-link to="/admin/announcements">Annonces</nuxt-link>
                <nuxt-link to="/admin/info">Informations</nuxt-link>
            </nav>
        </aside>

        <!-- Main content area -->
        <div class="main">
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

export default {
    name: 'AdminUsers',
    data() {
        return {
            users: [],
            user: {},
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    async mounted() {
        await this.initAuth()
        await this.fetchUsers()
    },
    methods: {
        async initAuth() {
            const userData = await verifyAndLoadProfile(this.$router, this.API_URL)
            if (userData) {
                this.user = userData
            }
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

    .sidebar {
        width: 280px;
        background: $color-primary-dark;
        box-shadow: 2px 0 10px $color-black-overlay-light;
        display: flex;
        flex-direction: column;

        .sidebar-header {
            text-align: center;
            padding: 2rem 1rem;
            border-bottom: 1px solid $color-white-overlay-light;

            .logo {
                font-size: 2rem;
                font-weight: 700;
                letter-spacing: -1px;
                background: linear-gradient(to right, $color-text-light, $color-text-muted);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 0.5rem;

                .city {
                    font-weight: 300;
                }

                .link {
                    font-weight: 700;
                }
            }

            .tagline {
                font-size: 0.9rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: $color-text-muted;
                margin: 0;
            }
        }

        .sidebar-nav {
            display: flex;
            flex-direction: column;
            margin-top: 1rem;

            a {
                padding: 0.8rem 1.2rem;
                color: $color-text-light;
                text-decoration: none;
                font-weight: 500;
                border-bottom: 1px solid $color-white-overlay-light;
                transition: $transition-fast;

                &:hover {
                    background: $color-white-overlay-light;
                }

                &.nuxt-link-exact-active {
                    background: $color-white-overlay-medium;
                }
            }
        }
    }

    .main {
        flex: 1;
        padding: 2rem;
        display: flex;
        flex-direction: column;
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