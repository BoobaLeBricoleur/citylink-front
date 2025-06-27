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
          <button class="btn btn-secondary"><Icon name="heroicons:envelope" /> {{ $t('pages.admin.userDetail.buttons.message') }}</button>
          <button class="btn btn-primary"><Icon name="heroicons:pencil" /> {{ $t('pages.admin.userDetail.buttons.edit') }}</button>
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
              <Icon name="heroicons:envelope" />
              <p>{{ user.email }}</p>
            </div>
            <div class="info-item" v-if="user.phone">
              <Icon name="heroicons:phone" />
              <p>{{ user.phone }}</p>
            </div>
            <div class="info-item" v-if="user.address">
              <Icon name="heroicons:map-pin" />
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
              <div class="bar" style="sheight: 30%"></div>
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
                <div class="pref-icon"><Icon name="heroicons:bell" /></div>
                <div class="pref-content">
                  <h5>{{ $t('pages.admin.userDetail.userPreferences.notificationsEmail') }}</h5>
                  <p>{{ $t('pages.admin.userDetail.userPreferences.enabled') }}</p>
                </div>
              </div>
              <div class="pref-item">
                <div class="pref-icon"><Icon name="heroicons:globe-alt" /></div>
                <div class="pref-content">
                  <h5>{{ $t('pages.admin.userDetail.userPreferences.language') }}</h5>
                  <p>{{ $t('pages.admin.userDetail.userPreferences.french') }}</p>
                </div>
              </div>
              <div class="pref-item">
                <div class="pref-icon"><Icon name="heroicons:lock-closed" /></div>
                <div class="pref-content">
                  <h5>{{ $t('pages.admin.userDetail.userPreferences.privacySettings') }}</h5>
                  <p>{{ $t('pages.admin.userDetail.userPreferences.public') }}</p>
                </div>
              </div>
              <div class="pref-item">
                <div class="pref-icon"><Icon name="heroicons:map-pin" /></div>
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

      <div class="admin-actions">
        <h3>{{ $t('pages.admin.userDetail.adminActions.title') }}</h3>
        <div class="actions-grid">
          <button class="action-btn"><Icon name="heroicons:no-symbol" /> {{ $t('pages.admin.userDetail.adminActions.suspend') }}</button>
          <button class="action-btn"><Icon name="heroicons:trash" /> {{ $t('pages.admin.userDetail.adminActions.delete') }}</button>
          <button class="action-btn"><Icon name="heroicons:key" /> {{ $t('pages.admin.userDetail.adminActions.resetPassword') }}</button>
          <button class="action-btn"><Icon name="heroicons:shield-check" /> {{ $t('pages.admin.userDetail.adminActions.verifyIdentity') }}</button>
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
            API_URL: process.env.API_URL || 'https://citylink-back.onrender.com/api'
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