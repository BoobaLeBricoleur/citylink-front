<template>
    <Header />
    <section class="hero">
        <div class="hero-content">
            <h1>{{ $t('hero.title') }}</h1>
            <p>{{ $t('hero.subtitle') }}</p>
        </div>
    </section>

    <div class="featured-container" v-if="featuredMerchant">
        <div class="featured-image">
            <div class="image-frame">
                <img :src="featuredMerchant.image || defaultImage" :alt="featuredMerchant.name" />
            </div>
        </div>
        <div class="featured-content">
            <div class="premium-badge">
                <span>{{ $t('featured.badge') }}</span>
            </div>
            <h2>{{ featuredMerchant.name }}</h2>
            <p class="featured-address">{{ featuredMerchant.address }}</p>
            <p class="featured-description">{{ featuredMerchant.description }}</p>
            <div class="featured-cta">
                <button class="btn-discover">{{ $t('featured.cta') }}</button>
            </div>
        </div>
    </div>

    <div class="merchants-page">
        <h2>{{ $t('section.title') }}</h2>
        <div class="merchants-container">
            <div v-for="merchant in merchants" 
                 :key="merchant.id" 
                 class="merchant-card"
                 @click="viewMerchantDetails(merchant.id)">
                <img :src="merchant.image || defaultImage" :alt="merchant.name" />
                <h3>{{ merchant.name }}</h3>
                <p class="address">{{ merchant.address }}</p>
                <p class="description">{{ merchant.description }}</p>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script>
import Header from '../components/views/Header.vue'
import Footer from '../components/views/Footer.vue'
import defaultImage from '/shop-logo.png'
import axios from 'axios'

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            merchants: [],
            featuredMerchant: null,
            defaultImage,
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    methods: {
        async fetchMerchants() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${this.API_URL}/business/`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                })
                this.merchants = response.data || []
                
                if (this.merchants.length > 0) {
                    this.featuredMerchant = this.merchants[0]
                    this.merchants = this.merchants.slice(1)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des commerces:', error)
            }
        },
        viewMerchantDetails(id) {
            this.$router.push(`/merchant/${id}`)
        }
    },
    async mounted() {
        await this.fetchMerchants()
    }
}
</script>