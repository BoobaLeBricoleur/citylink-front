<template>
  <div class="admin-portal">
    <AdminSidebar />
    <div class="main">
      <AdminHeader />
      <!-- Header avec retour et actions -->
      <div class="page-header">
        <div class="back-button" @click="$router.push('/admin/announcements')">
          <i class="fas fa-arrow-left"></i>
          <span>Retour à la liste</span>
        </div>
        <div class="actions">
          <button class="btn btn-secondary"><i class="fas fa-eye"></i> Visualiser</button>
          <button class="btn btn-primary"><i class="fas fa-edit"></i> Modifier</button>
        </div>
      </div>

      <!-- Annonce principale -->
      <div class="profile-container">
        <!-- Carte d'annonce -->
        <div class="profile-card announcement-card">
          <div class="profile-header">
            <div class="announcement-status">
              <span class="status-indicator"></span>
              Publiée
            </div>
            <div class="publication-date">
              Publiée le {{ formatDate(announcement.publication_date) }}
            </div>
          </div>

          <h2 class="announcement-title">{{ announcement.title }}</h2>
          <p class="announcement-id">ID: {{ $route.query.id }}</p>

          <div class="announcement-content">
            <p>{{ announcement.content }}</p>
          </div>

          <div class="author-info">
            <div class="author-label">Auteur :</div>
            <div class="author-name">{{ announcement.firstname }} {{ announcement.lastname }}</div>
            <div class="author-email">{{ announcement.email }}</div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="profile-card stats-card">
          <h3>Statistiques</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">132</div>
              <div class="stat-label">Vues</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">24</div>
              <div class="stat-label">Interactions</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">8</div>
              <div class="stat-label">Partages</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">95%</div>
              <div class="stat-label">Positive</div>
            </div>
          </div>

          <div class="activity-graph">
            <h4>Activité depuis publication</h4>
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
          <div class="tab active">Commentaires</div>
          <div class="tab">Historique</div>
          <div class="tab">Médias</div>
        </div>

        <div class="tab-content">
          <div class="comments-section">
            <h3>Commentaires récents</h3>

            <div class="comments-list">
              <div class="comment-item">
                <div class="comment-header">
                  <div class="commenter">Marie Dupont</div>
                  <div class="comment-date">Il y a 2 jours</div>
                </div>
                <div class="comment-content">Excellente initiative ! Je participerai avec plaisir à cet événement.</div>
              </div>

              <div class="comment-item">
                <div class="comment-header">
                  <div class="commenter">Jean Martin</div>
                  <div class="comment-date">Il y a 3 jours</div>
                </div>
                <div class="comment-content">Est-ce que l'événement est ouvert aux enfants également ?</div>
              </div>

              <div class="no-more-comments">
                Aucun autre commentaire pour cette annonce.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions administratives -->
      <div class="admin-actions">
        <h3>Actions administratives</h3>
        <div class="actions-grid">
          <button class="action-btn"><i class="fas fa-eye-slash"></i> Masquer l'annonce</button>
          <button class="action-btn"><i class="fas fa-trash"></i> Supprimer l'annonce</button>
          <button class="action-btn"><i class="fas fa-bullhorn"></i> Mettre en avant</button>
          <button class="action-btn"><i class="fas fa-comment-slash"></i> Désactiver commentaires</button>
        </div>
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
      if (!dateString) return 'Date inconnue'
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