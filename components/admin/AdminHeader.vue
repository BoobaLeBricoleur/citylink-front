<template>
    <header class="admin-header">
        <div class="header-left">
            <div class="brand">
                <span class="icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </span>
                <span class="title">ADMIN<span class="highlight">pannel</span></span>
            </div>
        </div>

        <nav class="header-nav">
            <div class="nav-item active">Dashboard</div>
        </nav>

        <div class="header-actions">
            <div class="user-profile">
                <div class="avatar">
                    <span>{{ user && user.firstname && user.lastname ? (user.firstname[0] + user.lastname[0]) : 'UN' }}</span>
                </div>
                <div class="user-info">
                    <span class="user-name">{{ user && user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : 'Utilisateur' }}</span>

                    <!-- TODO: remplacer avec le role dynamiquement -->
                    <span class="user-role">Administrator</span>

                </div>
                <button class="dropdown-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    </header>
</template>

<script>
import axios from 'axios'

export default {
    name: 'AdminHeader',
    data() {
      return {
        user: null,
        API_URL: process.env.API_URL || 'http://localhost:3000/api'
      }
    },
    async mounted() {
        await this.fetchUser()
    },
    methods: {
      async fetchUser() {
        try {
          // Récupérer depuis localStorage comme fallback
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            try {
              this.user = JSON.parse(storedUser)
            } catch (e) {
              console.error('Erreur lors du parsing du user stocké:', e)
              this.user = { firstname: '', lastname: '' }
            }
          } else {
            // Initialiser avec des valeurs par défaut si pas de user
            this.user = { firstname: '', lastname: '' }
          }

          const token = localStorage.getItem('token')
          if (token) {
            const response = await axios.get(`${this.API_URL}/users/profile`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.data) {
              this.user = response.data
              // Mettre à jour le localStorage
              localStorage.setItem('user', JSON.stringify(this.user))
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error)
          // S'assurer que user n'est jamais undefined
          if (!this.user) {
            this.user = { firstname: '', lastname: '' }
          }
        }
      }
    }
}
</script>