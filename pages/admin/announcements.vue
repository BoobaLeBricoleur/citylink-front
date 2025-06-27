<template>
  <div class="admin-portal">
    <!-- Sidebar for navigation -->
    <AdminSidebar />

    <!-- Main content area -->
    <div class="main">
      <AdminHeader />
      <div class="intro">
        <div class="intro-header">
          <h1>{{ $t('pages.admin.announcements.title') }}</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            <Icon name="heroicons:plus" /> {{ $t('pages.admin.announcements.newButton') }}
          </button>
        </div>
        <p>{{ $t('pages.admin.announcements.subtitle') }}</p>
      </div>

      <div class="search-bar">
        <div class="search-input-wrapper">
          <Icon name="heroicons:magnifying-glass" class="search-icon" />
          <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('pages.admin.announcements.searchPlaceholder')"
              class="search-input"
          >
        </div>
      </div>

      <!-- Modal de création d'annonce -->
      <div v-if="showCreateModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ $t('pages.admin.announcements.modal.title') }}</h2>
            <button class="close-btn" @click="showCreateModal = false">×</button>
          </div>
          <form @submit.prevent="createAnnouncement" class="announcement-form">
            <div class="form-group">
              <label for="title">{{ $t('pages.admin.announcements.form.titleLabel') }}</label>
              <input
                  type="text"
                  id="title"
                  v-model="newAnnouncement.title"
                  required
                  class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="content">{{ $t('pages.admin.announcements.form.contentLabel') }}</label>
              <textarea
                  id="content"
                  v-model="newAnnouncement.content"
                  required
                  class="form-control"
                  rows="4"
              ></textarea>
            </div>
            <div class="form-check">
              <input
                  type="checkbox"
                  id="is_featured"
                  v-model="newAnnouncement.is_featured"
              >
              <label for="is_featured">{{ $t('pages.admin.announcements.form.featuredLabel') }}</label>
            </div>
            <div class="form-check">
              <input
                  type="checkbox"
                  id="is_active"
                  v-model="newAnnouncement.is_active"
              >
              <label for="is_active">{{ $t('pages.admin.announcements.form.activeLabel') }}</label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCreateModal = false">
                {{ $t('pages.admin.announcements.buttons.cancel') }}
              </button>
              <button type="submit" class="btn btn-primary">
                {{ $t('pages.admin.announcements.buttons.create') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Announcements list -->
      <div class="announcement-list">
        <div v-if="filteredAnnouncements.length === 0" class="no-announcements">
          {{ $t('pages.admin.announcements.noResults') }}
        </div>
        <ul v-else>
          <li v-for="(item, index) in filteredAnnouncements"
              :key="index"
              class="announcement-item"
              @click="viewAnnouncementDetails(item.id)">
            <div class="announcement-header">
              <strong>{{ item.title }}</strong>
              <span class="date">{{ formatDate(item.publication_date) }}</span>
            </div>
            <div class="announcement-content">{{ item.content }}</div>
            <div class="announcement-footer">
              <div class="announcement-author">{{ $t('pages.admin.announcements.authorPrefix') }} {{ item.firstname }} {{ item.lastname }}</div>
              <div class="view-details">{{ $t('pages.admin.announcements.viewDetails') }} <Icon name="heroicons:chevron-right" /></div>            </div>
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
      API_URL: process.env.API_URL || 'http://localhost:3000/api',
      showCreateModal: false,
      searchQuery: '',
      newAnnouncement: {
        title: '',
        content: '',
        is_featured: false,
        is_active: true
      }
    }
  },
  computed: {
    filteredAnnouncements() {
      if (!this.searchQuery) return this.announcements;

      const query = this.searchQuery.toLowerCase();
      return this.announcements.filter(announcement =>
          announcement.title.toLowerCase().includes(query) ||
          announcement.content.toLowerCase().includes(query)
      );
    }
  },
  async mounted() {
    await this.initAuth()
    await this.fetchAnnouncements()
  },
  methods: {
    async createAnnouncement() {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
            `${this.API_URL}/announcements/`,
            this.newAnnouncement,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
        );

        // Réinitialiser le formulaire
        this.newAnnouncement = {
          title: '',
          content: '',
          is_featured: false,
          is_active: true
        };

        // Fermer le modal
        this.showCreateModal = false;

        // Rafraîchir la liste
        await this.fetchAnnouncements();

      } catch (error) {
        console.error('Erreur lors de la création de l\'annonce:', error);
      }
    },
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