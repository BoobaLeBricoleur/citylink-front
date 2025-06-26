<template>
  <div class="admin-portal">
    <AdminSidebar />
    <div class="main">
      <AdminHeader />
      <!-- Header avec retour et actions -->
      <div class="page-header">
        <div class="back-button" @click="$router.push('/admin/users')">
          <span>{{ $t('pages.admin.userDetail.backToList') }}</span>
        </div>
        <div class="actions">
          <button class="btn btn-secondary"><i class="fas fa-envelope"></i> {{ $t('pages.admin.userDetail.buttons.message') }}</button>
          <button class="btn btn-primary"><i class="fas fa-edit"></i> {{ $t('pages.admin.userDetail.buttons.edit') }}</button>
        </div>
      </div>

      <!-- Profil principal -->
      <div class="profile-container">
        <!-- Carte d'identité -->
        <div class="profile-card identity-card">
          <div class="profile-header">
            <div class="avatar">
              <span>{{ user.firstname ? user.firstname[0] : '' }}{{ user.lastname ? user.lastname[0] : '' }}</span>
            </div>
            <div class="user-status" :class="user.active ? 'active' : 'inactive'">
              {{ user.active ? $t('pages.admin.userDetail.status.active') : $t('pages.admin.userDetail.status.inactive') }}
            </div>
          </div>

          <h2 class="username">{{ user.firstname }} {{ user.lastname }}</h2>
          <p class="user-id">{{ $t('pages.admin.userDetail.id') }} {{ $route.query.id }}</p>

          <div class="contact-info">
            <div class="info-item">
              <i class="fas fa-envelope"></i>
              <p>{{ user.email }}</p>
            </div>
            <div class="info-item" v-if="user.phone">
              <i class="fas fa-phone"></i>
              <p>{{ user.phone }}</p>
            </div>
            <div class="info-item" v-if="user.address">
              <i class="fas fa-map-marker-alt"></i>
              <p>{{ user.address }}</p>
            </div>
          </div>

          <div class="member-since">
            <span class="label">{{ $t('pages.admin.userDetail.memberSince') }}</span>
            <span class="value">{{ user.createdAt ? new Date(user.createdAt).toLocaleDateString() : $t('pages.admin.userDetail.unknown') }}</span>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="profile-card stats-card">
          <h3>{{ $t('pages.admin.userDetail.statistics.title') }}</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">25</div>
              <div class="stat-label">{{ $t('pages.admin.userDetail.statistics.logins') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">12</div>
              <div class="stat-label">{{ $t('pages.admin.userDetail.statistics.events') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">5</div>
              <div class="stat-label">{{ $t('pages.admin.userDetail.statistics.favoriteBusinesses') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">89%</div>
              <div class="stat-label">{{ $t('pages.admin.userDetail.statistics.profileCompletion') }}</div>
            </div>
          </div>

          <div class="activity-graph">
            <h4>{{ $t('pages.admin.userDetail.statistics.monthlyActivity') }}</h4>
            <div class="graph-placeholder">
              <div class="bar" style="height: 30%"></div>
              <div class="bar" style="height: 50%"></div>
              <div class="bar" style="height: 80%"></div>
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 90%"></div>
              <div class="bar" style="height: 40%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglets d'information supplémentaire -->
      <div class="tabs-container">
        <div class="tabs-header">
          <div class="tab active">{{ $t('pages.admin.userDetail.tabs.preferences') }}</div>
          <div class="tab">{{ $t('pages.admin.userDetail.tabs.recentActivities') }}</div>
          <div class="tab">{{ $t('pages.admin.userDetail.tabs.settings') }}</div>
        </div>

        <div class="tab-content">
          <div class="preferences-section">
            <h3>{{ $t('pages.admin.userDetail.userPreferences.title') }}</h3>

            <div class="preferences-grid">
              <div class="pref-item">
                <div class="pref-icon"><i class="fas fa-bell"></i></div>
                <div class="pref-content">
                  <h5>{{ $t('pages.admin.userDetail.userPreferences.notificationsEmail') }}</h5>
                  <p>{{ $t('pages.admin.userDetail.userPreferences.enabled') }}</p>
                </div>
              </div>
              <div class="pref-item">
                <div class="pref-icon"><i class="fas fa-language"></i></div>
                <div class="pref-content">
                  <h5>{{ $t('pages.admin.userDetail.userPreferences.language') }}</h5>
                  <p>{{ $t('pages.admin.userDetail.userPreferences.french') }}</p>
                </div>
              </div>
              <div class="pref-item">
                <div class="pref-icon"><i class="fas fa-user-shield"></i></div>
                <div class="pref-content">
                  <h5>{{ $t('pages.admin.userDetail.userPreferences.privacySettings') }}</h5>
                  <p>{{ $t('pages.admin.userDetail.userPreferences.public') }}</p>
                </div>
              </div>
              <div class="pref-item">
                <div class="pref-icon"><i class="fas fa-map-marker-alt"></i></div>
                <div class="pref-content">
                  <h5>{{ $t('pages.admin.userDetail.userPreferences.location') }}</h5>
                  <p>{{ $t('pages.admin.userDetail.userPreferences.enabled') }}</p>
                </div>
              </div>
            </div>

            <div class="categories-section">
              <h4>{{ $t('pages.admin.userDetail.userPreferences.interestCategories') }}</h4>
              <div class="categories-container">
                <span class="category-tag">{{ $t('pages.admin.userDetail.userPreferences.categories.culture') }}</span>
                <span class="category-tag">{{ $t('pages.admin.userDetail.userPreferences.categories.sports') }}</span>
                <span class="category-tag">{{ $t('pages.admin.userDetail.userPreferences.categories.technology') }}</span>
                <span class="category-tag">{{ $t('pages.admin.userDetail.userPreferences.categories.education') }}</span>
                <span class="category-tag">{{ $t('pages.admin.userDetail.userPreferences.categories.environment') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions administratives -->
      <div class="admin-actions">
        <h3>{{ $t('pages.admin.userDetail.adminActions.title') }}</h3>
        <div class="actions-grid">
          <button class="action-btn"><i class="fas fa-ban"></i> {{ $t('pages.admin.userDetail.adminActions.suspend') }}</button>
          <button class="action-btn"><i class="fas fa-trash"></i> {{ $t('pages.admin.userDetail.adminActions.delete') }}</button>
          <button class="action-btn"><i class="fas fa-key"></i> {{ $t('pages.admin.userDetail.adminActions.resetPassword') }}</button>
          <button class="action-btn"><i class="fas fa-shield-alt"></i> {{ $t('pages.admin.userDetail.adminActions.verifyIdentity') }}</button>
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
    name: 'AdminUserDetail',
    data() {
        return {
            user: {},
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    async mounted() {
        await this.initAuth()
        await this.fetchUserDetails()
    },
    methods: {
        async initAuth() {
            const userData = await verifyAndLoadProfile(this.$router, this.API_URL)
            if (!userData) {
                return
            }
        },
        async fetchUserDetails() {
            try {
                const userId = this.$route.query.id
                if (!userId) {
                    console.error("ID d'utilisateur manquant")
                    return
                }
                
                const token = localStorage.getItem('token')
                const { data } = await axios.get(`${this.API_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                
                this.user = data
            } catch (error) {
                console.error('Erreur lors de la récupération du user :', error)
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
              background: $color-secondary;
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

        &.identity-card {
          display: flex;
          flex-direction: column;
          align-items: center;

          .profile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .avatar {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background: $color-secondary;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.4rem;
              font-weight: 700;
            }

            .user-status {
              padding: 0.3rem 0.6rem;
              border-radius: 4px;
              text-transform: uppercase;
              font-size: 0.75rem;
              font-weight: 600;

              &.active {
                background: rgba(46, 204, 113, 0.2);
                color: #2ecc71;
              }
              &.inactive {
                background: rgba(231, 76, 60, 0.2);
                color: #e74c3c;
              }
            }
          }

          .username {
            margin: 1rem 0 0.5rem 0;
            text-align: center;
          }

          .user-id {
            font-size: 0.85rem;
            color: $color-text-muted;
            margin-bottom: 1rem;
          }

          .contact-info {
            width: 100%;

            .info-item {
              display: flex;
              align-items: center;
              margin: 0.5rem 0;

              i {
                margin-right: 0.7rem;
                font-size: 1rem;
              }
            }
          }

          .member-since {
            margin-top: 1.5rem;
            display: flex;
            gap: 0.5rem;

            .label {
              font-weight: 600;
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
                width: 15px;
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
        .preferences-section {
          h3 {
            margin-bottom: 1rem;
          }

          .preferences-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;

            .pref-item {
              background: $color-primary-dark;
              padding: 1rem;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: space-between;

              .pref-label {
                font-weight: 600;
              }

              .toggle {
                width: 40px;
                height: 20px;
                background: $color-white-overlay-light;
                border-radius: 10px;
                position: relative;
                cursor: pointer;
                transition: 0.4s;

                &::before {
                  content: '';
                  position: absolute;
                  left: 2px;
                  top: 2px;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background: $color-primary;
                  transition: 0.4s;
                }

                &.active {
                  &::before {
                    transform: translateX(20px);
                    background: $color-primary;
                  }
                }
              }
            }
          }

          .categories-section {
            margin-top: 1rem;

            h4 {
              margin-bottom: 0.5rem;
              font-weight: 600;
            }

            .categories-container {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;

              .category-tag {
                background: $color-secondary;
                color: #fff;
                padding: 0.4rem 0.8rem;
                border-radius: 4px;
                font-size: 0.85rem;
                font-weight: 600;
                letter-spacing: 0.5px;
                transition: opacity 0.2s;

                &:hover {
                  opacity: 0.8;
                }
              }
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
            background: $color-primary-dark;
          }
        }
      }
    }
  }
}
</style>