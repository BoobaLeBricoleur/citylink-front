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
                    <span>{{ (this.user.firstname[0] + this.user.lastname[0])}}</span>
                </div>
                <div class="user-info">
                    <span class="user-name">{{this.user.firstname}} {{this.user.lastname}}</span>

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
          const API_URL = process.env.API_URL || 'http://localhost:3000/api'
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
</script>

<style scoped lang="scss">
@use '../../assets/variables.scss' as *;

.admin-header {
    margin-bottom: 1em;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    padding: 0 2rem;
    background: linear-gradient(135deg, rgba($color-primary, 0.95) 0%, rgba($color-primary-dark, 0.98) 100%);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    position: relative;
    z-index: $z-index-header;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.3) 20%,
                rgba(255, 255, 255, 0.5) 50%,
                rgba(255, 255, 255, 0.3) 80%,
                transparent 100%);
    }

    .header-left {
        display: flex;
        align-items: center;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .icon {
            display: flex;
            align-items: center;
            color: $color-secondary;
            transition: $transition-fast;
            animation: pulse 3s infinite;
        }

        .title {
            font-size: 1.4rem;
            font-weight: 800;
            letter-spacing: 1px;
            color: $color-text-light;
            text-transform: uppercase;

            .highlight {
                color: $color-secondary;
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: $color-secondary;
                    border-radius: 2px;
                }
            }
        }
    }

    .header-nav {
        display: flex;
        height: 100%;
        margin-left: 3rem;

        .nav-item {
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 1.2rem;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 500;
            position: relative;
            cursor: pointer;
            transition: $transition-fast;

            &:hover {
                color: white;
                background: $color-white-overlay-light;
            }

            &.active {
                color: white;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 10%;
                    width: 80%;
                    height: 3px;
                    background: $color-secondary;
                    border-radius: 3px 3px 0 0;
                }
            }
        }
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        .user-profile {
            display: flex;
            align-items: center;
            padding: 0.4rem 0.6rem;
            background: $color-white-overlay-light;
            border-radius: $border-radius-md;
            cursor: pointer;
            transition: $transition-fast;

            &:hover {
                background: $color-white-overlay-medium;
            }

            .avatar {
                width: 36px;
                height: 36px;
                border-radius: $border-radius-circle;
                background: $color-secondary;
                display: flex;
                align-items: center;
                justify-content: center;
                color: $color-text-dark;
                font-weight: 600;
                margin-right: 0.8rem;
            }

            .user-info {
                display: flex;
                flex-direction: column;
                margin-right: 0.8rem;

                .user-name {
                    font-weight: 600;
                    color: white;
                    font-size: 0.9rem;
                }

                .user-role {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.7);
                }
            }

            .dropdown-toggle {
                background: transparent;
                border: none;
                color: white;
                padding: 0;
                display: flex;
                align-items: center;
                cursor: pointer;
            }
        }
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.05);
        opacity: 0.8;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>