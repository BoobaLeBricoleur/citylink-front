<template>
  <div>
    <Header />
      <section class="hero">
        <div class="hero-content">
          <h1>{{ merchant?.name }}</h1>
          <p>{{ merchant?.name }}</p>
        </div>
      </section>

    <section class="merchant-details">
      <div class="details-container">
        <div class="merchant-image">
          <img :src="merchant?.image || defaultImage" :alt="merchant?.name" />
        </div>

        <div class="merchant-info">
          <h2>À propos</h2>
          <p class="description">{{ merchant?.description }}</p>

          <div v-if="merchant?.phone" class="info-line">
            📞 <span>{{ merchant.phone }}</span>
          </div>

          <div v-if="merchant?.email" class="info-line">
            📧 <span>{{ merchant.email }}</span>
          </div>

          <div v-if="merchant?.website" class="info-line">
            🌐 <a :href="merchant.website" target="_blank">{{ merchant.website }}</a>
          </div>

          <button class="btn-back" @click="$router.push('/merchants')">
            ⬅ Retour aux commerçants
          </button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from '../../components/views/Header.vue'
import Footer from '../../components/views/Footer.vue'
import defaultImage from '/shop-logo.png'
import axios from 'axios'

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      merchant: null,
      defaultImage,
      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    }
  },
  async mounted() {
    const id = this.$route.params.id
    await this.fetchMerchant(id)
  },
  methods: {
    async fetchMerchant(id) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${this.API_URL}/business/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        this.merchant = response.data
      } catch (error) {
        console.error('Erreur lors de la récupération du marchand:', error)
      }
    }
  }
}
</script>

