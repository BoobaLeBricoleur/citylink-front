<template>
  <div class="admin-portal">
    <AdminSidebar />
    <div class="main">
      <AdminHeader />
      <!-- Header avec retour et actions -->
      <div class="page-header">
        <div class="back-button" @click="$router.push('/admin/announcements')">
          <Icon name="heroicons:arrow-left" />
          <span>{{ $t('pages.admin.announcementsDetails.backToList') }}</span>
        </div>
        <div class="actions">
          <button class="btn btn-secondary"><Icon name="heroicons:eye" /> {{ $t('pages.admin.announcementsDetails.buttons.preview') }}</button>
          <button class="btn btn-primary"><Icon name="heroicons:pencil" /> {{ $t('pages.admin.announcementsDetails.buttons.edit') }}</button>
        </div>
      </div>

      <!-- Annonce principale -->
      <div class="profile-container">
        <!-- Carte d'annonce -->
        <div class="profile-card announcement-card">
          <div class="profile-header">
            <div class="announcement-status">
              <span class="status-indicator"></span>
              {{ $t('pages.admin.announcementsDetails.status.published') }}
            </div>
            <div class="publication-date">
              {{ $t('pages.admin.announcementsDetails.publishedOn') }} {{ formatDate(announcement.publication_date) }}
            </div>
          </div>

          <h2 class="announcement-title">{{ announcement.title }}</h2>
          <p class="announcement-id">{{ $t('pages.admin.announcementsDetails.id') }}: {{ $route.query.id }}</p>

          <div class="announcement-content">
            <p>{{ announcement.content }}</p>
          </div>

          <div class="author-info">
            <div class="author-label">{{ $t('pages.admin.announcementsDetails.author') }} :</div>
            <div class="author-name">{{ announcement.firstname }} {{ announcement.lastname }}</div>
            <div class="author-email">{{ announcement.email }}</div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="profile-card stats-card">
          <h3>{{ $t('pages.admin.announcementsDetails.statistics.title') }}</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">132</div>
              <div class="stat-label">{{ $t('pages.admin.announcementsDetails.statistics.views') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">24</div>
              <div class="stat-label">{{ $t('pages.admin.announcementsDetails.statistics.interactions') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">8</div>
              <div class="stat-label">{{ $t('pages.admin.announcementsDetails.statistics.shares') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">95%</div>
              <div class="stat-label">{{ $t('pages.admin.announcementsDetails.statistics.positive') }}</div>
            </div>
          </div>

          <div class="activity-graph">
            <h4>{{ $t('pages.admin.announcementsDetails.statistics.activitySincePublication') }}</h4>
            <div class="graph-placeholder">
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 90%"></div>
              <div class="bar" style="height: 70%"></div>
              <div class="bar" style="height: 40%"></div>
              <div class="bar" style="height: 30%"></div>
              <div class="bar" style="height: 20%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglets d'information supplémentaire -->
      <div class="tabs-container">
        <div class="tabs-header">
          <div class="tab active">{{ $t('pages.admin.announcementsDetails.tabs.comments') }}</div>
          <div class="tab">{{ $t('pages.admin.announcementsDetails.tabs.history') }}</div>
          <div class="tab">{{ $t('pages.admin.announcementsDetails.tabs.media') }}</div>
        </div>

        <div class="tab-content">
          <div class="comments-section">
            <h3>{{ $t('pages.admin.announcementsDetails.comments.recentComments') }}</h3>

            <div class="comments-list">
              <div class="comment-item">
                <div class="comment-header">
                  <div class="commenter">Marie Dupont</div>
                  <div class="comment-date">{{ $t('pages.admin.announcementsDetails.comments.daysAgo', { days: 2 }) }}</div>
                </div>
                <div class="comment-content">{{ $t('pages.admin.announcementsDetails.comments.sampleComment1') }}</div>
              </div>

              <div class="comment-item">
                <div class="comment-header">
                  <div class="commenter">Jean Martin</div>
                  <div class="comment-date">{{ $t('pages.admin.announcementsDetails.comments.daysAgo', { days: 3 }) }}</div>
                </div>
                <div class="comment-content">{{ $t('pages.admin.announcementsDetails.comments.sampleComment2') }}</div>
              </div>

              <div class="no-more-comments">
                {{ $t('pages.admin.announcementsDetails.comments.noMoreComments') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions administratives -->
      <div class="admin-actions">
        <h3>{{ $t('pages.admin.announcementsDetails.adminActions.title') }}</h3>
        <div class="actions-grid">
          <button class="action-btn"><Icon name="heroicons:eye-slash" /> {{ $t('pages.admin.announcementsDetails.adminActions.hide') }}</button>
          <button class="action-btn"><Icon name="heroicons:trash" /> {{ $t('pages.admin.announcementsDetails.adminActions.delete') }}</button>
          <button class="action-btn"><Icon name="heroicons:megaphone" /> {{ $t('pages.admin.announcementsDetails.adminActions.feature') }}</button>
          <button class="action-btn"><Icon name="heroicons:chat-bubble-left-ellipsis" /> {{ $t('pages.admin.announcementsDetails.adminActions.disableComments') }}</button>        </div>
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
  name: 'AdminAnnouncementDetail',
  data() {
    return {
      announcement: {},
      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    }
  },
  async mounted() {
    await this.initAuth()
    await this.fetchAnnouncementDetails()
  },
  methods: {
    async initAuth() {
      const userData = await verifyAndLoadProfile(this.$router, this.API_URL)
      if (!userData) {
        return
      }
    },
    async fetchAnnouncementDetails() {
      try {
        const announcementId = this.$route.query.id
        if (!announcementId) {
          console.error("ID d'annonce manquant")
          return
        }

        const token = localStorage.getItem('token')
        const { data } = await axios.get(`${this.API_URL}/announcements/${announcementId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        this.announcement = data
        console.log('Annonce récupérée :', this.announcement)
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'annonce :', error)
      }
    },
    formatDate(dateString) {
      if (!dateString) return this.$t('pages.admin.announcementsDetails.unknownDate')
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  }
}
</script>