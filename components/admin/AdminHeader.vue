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
<!--                    <span>{{ (this.user.firstname[0] + this.user.lastname[0])}}</span>-->
                    <span>t t</span>
                </div>
                <div class="user-info">
<!--                    <span class="user-name">{{this.user.firstname}} {{this.user.lastname}}</span>-->
                    <span class="user-name">test test</span>

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
        user: { firstname: '', lastname: '' }
      }
    },
    async mounted() {
        await this.fetchUser()
    },
    methods: {
      async fetchUser() {
        // Récupérer depuis localStorage comme fallback
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          this.user = JSON.parse(storedUser)
        }

        // Pour être plus cohérent avec les autres composants,
        // vous pourriez utiliser verifyAndLoadProfile ici
        try {
          API_URL: process.env.API_URL || 'https://citylink-back.onrender.com/api'
          const token = localStorage.getItem('token')
          if (token) {
            const response = await axios.get(`${API_URL}/users/profile`, {
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
        }
      }
    }
}
