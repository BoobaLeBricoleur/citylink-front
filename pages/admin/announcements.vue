<template>
  <div class="admin-portal">
    <!-- Sidebar for navigation -->
    <AdminSidebar />

    <!-- Main content area -->
    <div class="main">
      <AdminHeader />
      <div class="intro">
        <h1>Liste des Annonces</h1>
        <p>Ci-dessous, vous trouverez toutes les annonces publiées sur la plateforme.</p>
      </div>

      <!-- Announcements list -->
      <div class="announcement-list">
        <div v-if="announcements.length === 0" class="no-announcements">
          Aucune annonce trouvée.
        </div>
        <ul v-else>
          <li v-for="(item, index) in announcements"
              :key="index"
              class="announcement-item"
              @click="viewAnnouncementDetails(item.id)">
            <div class="announcement-header">
              <strong>{{ item.title }}</strong>
              <span class="date">{{ formatDate(item.publication_date) }}</span>
            </div>
            <div class="announcement-content">{{ item.content }}</div>
            <div class="announcement-footer">
              <div class="announcement-author">Par: {{ item.firstname }} {{ item.lastname }}</div>
              <div class="view-details">Voir détails <i class="fas fa-chevron-right"></i></div>
            </div>
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
  name: 'AdminAnnouncements',
  data() {
    return {
      announcements: [],
      API_URL: process.env.API_URL || 'https://citylink-back.onrender.com/apiapi'
    }
  },
  async mounted() {
    await this.initAuth()
    await this.fetchAnnouncements()
  },
  methods: {
    async initAuth() {
      const userData = await verifyAndLoadProfile(this.$router, this.API_URL)
    },
    async fetchAnnouncements() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${this.API_URL}/announcements/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log('Annonces récupérées :', response.data)
        this.announcements = response.data || []
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces :', error)
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },
    viewAnnouncementDetails(id) {
      this.$router.push(`/admin/announcements-details?id=${id}`)
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

    .announcement-list {
      background: $color-white-overlay-medium;
      padding: 1rem;
      border-radius: $border-radius-md;
      box-shadow: 0 4px 12px $color-black-overlay-light;
      border: 1px solid $color-white-overlay-light;

      .no-announcements {
        text-align: center;
        font-size: 1.1rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        .announcement-item {
          padding: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid $color-white-overlay-light;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-radius: 4px;

          &:hover {
            background-color: $color-primary-dark;
          }

          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }

          .announcement-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            strong {
              font-weight: 600;
              font-size: 1.1rem;
            }

            .date {
              font-size: 0.85rem;
              opacity: 0.8;
            }
          }

          .announcement-content {
            margin: 0.5rem 0;
            line-height: 1.4;
            max-height: 3em;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .announcement-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.5rem;

            .announcement-author {
              font-size: 0.85rem;
              font-style: italic;
            }

            .view-details {
              font-size: 0.85rem;
              color: $color-secondary;
              display: flex;
              align-items: center;
              gap: 0.3rem;
            }
          }
        }
      }
    }
  }
}
</style>