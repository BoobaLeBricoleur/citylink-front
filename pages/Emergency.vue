<template>
  <div class="emergency-page">
    <Header />
    <div class="main-content">
      <div class="emergency-container">
        <div class="intro">
          <div class="intro-header">
            <h1>{{ $t('pages.emergency.title') }}</h1>
          </div>
          <p>{{ $t('pages.emergency.intro') }}</p>
        </div>

        <!-- Numéros d'urgence -->
        <div class="emergency-numbers">
          <div class="emergency-card">
            <Icon name="heroicons:truck" />
            <h3>{{ $t('pages.emergency.numbers.samu.name') }}</h3>
            <div class="number">15</div>
            <p>{{ $t('pages.emergency.numbers.samu.description') }}</p>
          </div>
          <div class="emergency-card">
            <Icon name="heroicons:shield-check" />
            <h3>{{ $t('pages.emergency.numbers.police.name') }}</h3>
            <div class="number">17</div>
            <p>{{ $t('pages.emergency.numbers.police.description') }}</p>
          </div>
          <div class="emergency-card">
            <Icon name="heroicons:fire" />
            <h3>{{ $t('pages.emergency.numbers.firefighters.name') }}</h3>
            <div class="number">18</div>
            <p>{{ $t('pages.emergency.numbers.firefighters.description') }}</p>
          </div>
          <div class="emergency-card">
            <Icon name="heroicons:phone" />
            <h3>{{ $t('pages.emergency.numbers.europe.name') }}</h3>
            <div class="number">112</div>
            <p>{{ $t('pages.emergency.numbers.europe.description') }}</p>
          </div>
        </div>

        <!-- Formulaire de signalement -->
        <div class="report-section">
          <h2>{{ $t('pages.emergency.report.title') }}</h2>
          <form @submit.prevent="submitEmergency" class="emergency-form">
            <div class="form-group">
              <label for="emergency_type">{{ $t('pages.emergency.report.form.type.label') }}</label>
              <select
                  id="emergency_type"
                  v-model="newEmergency.emergency_type"
                  required
                  class="form-control"
              >
                <option value="">{{ $t('pages.emergency.report.form.type.placeholder') }}</option>
                <option value="medical">{{ $t('pages.emergency.report.form.type.options.medical') }}</option>
                <option value="security">{{ $t('pages.emergency.report.form.type.options.security') }}</option>
                <option value="fire">{{ $t('pages.emergency.report.form.type.options.fire') }}</option>
                <option value="other">{{ $t('pages.emergency.report.form.type.options.other') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">{{ $t('pages.emergency.report.form.description.label') }}</label>
              <textarea
                  id="description"
                  v-model="newEmergency.description"
                  required
                  class="form-control"
                  rows="4"
                  :placeholder="$t('pages.emergency.report.form.description.placeholder')"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-emergency">
                {{ $t('pages.emergency.report.form.submit') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from '../components/views/Header.vue'
import Footer from '../components/views/Footer.vue'
import axios from 'axios'

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      newEmergency: {
        emergency_type: '',
        description: ''
      },
      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    }
  },
  methods: {
    async submitEmergency() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
            `${this.API_URL}/emergency/`,
            this.newEmergency,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
        )

        this.newEmergency = {
          emergency_type: '',
          description: ''
        }

        alert(this.$t('pages.emergency.alerts.success'))
      } catch (error) {
        console.error('Error :', error)
        alert(this.$t('pages.emergency.alerts.error'))      }
    }
  }
}
</script>