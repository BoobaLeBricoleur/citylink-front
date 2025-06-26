<template>
  <div class="admin-portal">
    <AdminSidebar />
    <div class="main">
      <div class="intro">
        <h1>{{ $t('pages.admin.dashboard.title') }}</h1>
        <p>{{ $t('pages.admin.dashboard.welcome', { name: user.firstname + ' ' + user.lastname }) }}</p>
        <p v-if="user.email">{{ $t('pages.admin.dashboard.email') }} {{ user.email }}</p>
        <p v-if="user.company">{{ $t('pages.admin.dashboard.company') }} {{ user.company }}</p>
      </div>

      <!-- Dynamic feature shortcuts -->
      <div class="feature-grid">
        <NuxtLinkLocale to="/admin/users" class="feature-card">
          <h3>{{ $t('pages.admin.dashboard.features.users.title') }}</h3>
          <p>{{ $t('pages.admin.dashboard.features.users.description') }}</p>
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/admin/business" class="feature-card">
          <h3>{{ $t('pages.admin.dashboard.features.business.title') }}</h3>
          <p>{{ $t('pages.admin.dashboard.features.business.description') }}</p>
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/admin/events" class="feature-card">
          <h3>{{ $t('pages.admin.dashboard.features.events.title') }}</h3>
          <p>{{ $t('pages.admin.dashboard.features.events.description') }}</p>
        </NuxtLinkLocale>
        <NuxtLinkLocale to="/admin/announcements" class="feature-card">
          <h3>{{ $t('pages.admin.dashboard.features.announcements.title') }}</h3>
          <p>{{ $t('pages.admin.dashboard.features.announcements.description') }}</p>
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyAndLoadProfile } from '~/utils/authGuard.js'

export default {
    name: 'AdminIndex',
    data() {
        return {
            user: {},
            form: { firstname: '', lastname: '', email: '' },
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    mounted() {
        this.initAuth()
    },
    methods: {
        async initAuth() {
            const userData = await verifyAndLoadProfile(this.$router, this.API_URL)
            if (userData) {
                this.user = userData
                this.form.firstname = userData.firstname || ''
                this.form.lastname = userData.lastname || ''
                this.form.email = userData.email || ''
            }
        }
    }
}
</script>