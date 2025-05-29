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
      API_URL: process.env.API_URL || 'https://citylink-back.onrender.com/api'
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

<style lang="scss">
@use '../../assets/variables.scss' as *;

.admin-portal {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, $color-primary-dark 0%, $color-primary 50%, $color-primary-dark 100%);
  color: $color-text-light;
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;

  .main {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;

      .back-button {
        display: flex;
        align-items: center;
        cursor: pointer;

        i {
          margin-right: 0.5rem;
        }

        &:hover {
          text-decoration: underline;
        }
      }

      .actions {
        button {
          margin-left: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          text-transform: uppercase;
          font-weight: 600;
          cursor: pointer;
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 4px;
          transition: background 0.2s;

          &.btn-secondary {
            background: $color-white-overlay-light;
            color: $color-text-dark;

            &:hover {
              background: $color-white-overlay-medium;
            }
          }

          &.btn-primary {
            background: $color-secondary;
            color: #fff;

            &:hover {
              background: lighten($color-secondary, 5%);
            }
          }
        }
      }
    }

    .profile-container {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;

      .profile-card {
        background: $color-white-overlay-medium;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        flex: 1;
        min-width: 300px;

        &.announcement-card {
          .profile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 1.5rem;

            .announcement-status {
              display: flex;
              align-items: center;
              font-weight: 600;

              .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #2ecc71;
                margin-right: 0.5rem;
              }
            }

            .publication-date {
              font-size: 0.85rem;
              opacity: 0.8;
            }
          }

          .announcement-title {
            margin: 0 0 0.5rem 0;
            font-size: 1.8rem;
          }

          .announcement-id {
            font-size: 0.85rem;
            color: $color-text-muted;
            margin-bottom: 1.5rem;
          }

          .announcement-content {
            background: $color-primary-dark;
            padding: 1.5rem;
            border-radius: 6px;
            margin-bottom: 1.5rem;
            line-height: 1.6;

            p {
              margin: 0;
            }
          }

          .author-info {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            align-items: center;
            font-size: 0.9rem;

            .author-label {
              font-weight: 600;
            }

            .author-name {
              margin-right: 0.5rem;
            }

            .author-email {
              color: $color-text-muted;
            }
          }
        }

        &.stats-card {
          h3 {
            margin-bottom: 1rem;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;

            .stat-item {
              background: $color-primary-dark;
              padding: 0.8rem;
              border-radius: 6px;
              text-align: center;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

              .stat-value {
                font-size: 1.4rem;
                font-weight: 700;
                margin-bottom: 0.3rem;
              }

              .stat-label {
                font-size: 0.9rem;
                text-transform: uppercase;
                color: $color-text-muted;
              }
            }
          }

          .activity-graph {
            margin-top: 1.5rem;

            h4 {
              margin-bottom: 0.5rem;
            }

            .graph-placeholder {
              display: flex;
              align-items: flex-end;
              gap: 0.3rem;
              height: 150px;
              background: $color-white-overlay-light;
              padding: 0.5rem;
              border-radius: 6px;

              .bar {
                flex: 1;
                background: $color-secondary;
                border-radius: 3px;
                transition: height 0.3s ease;
              }

              .bar:hover {
                opacity: 0.7;
              }
            }
          }
        }
      }
    }

    .tabs-container {
      background: $color-white-overlay-medium;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .tabs-header {
        display: flex;
        gap: 2rem;
        margin-bottom: 1rem;

        .tab {
          padding-bottom: 0.3rem;
          cursor: pointer;
          position: relative;
          font-weight: 600;
          text-transform: uppercase;

          &.active {
            color: $color-secondary;
            &::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              right: 0;
              height: 2px;
              background: $color-secondary;
            }
          }
        }
      }

      .tab-content {
        .comments-section {
          h3 {
            margin-bottom: 1rem;
          }

          .comments-list {
            .comment-item {
              background: $color-primary-dark;
              padding: 1rem;
              border-radius: 4px;
              margin-bottom: 1rem;

              .comment-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;

                .commenter {
                  font-weight: 600;
                }

                .comment-date {
                  font-size: 0.85rem;
                  color: $color-text-muted;
                }
              }

              .comment-content {
                line-height: 1.4;
              }
            }

            .no-more-comments {
              text-align: center;
              padding: 1rem;
              color: $color-text-muted;
              font-style: italic;
            }
          }
        }
      }
    }

    .admin-actions {
      background: $color-white-overlay-medium;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      h3 {
        margin-bottom: 1rem;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1rem;

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1rem;
          background: $color-primary-dark;
          color: $color-text-light;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;

          i {
            font-size: 1rem;
          }

          &:hover {
            background: darken($color-primary-dark, 5%);
          }
        }
      }
    }
  }
}
</style>