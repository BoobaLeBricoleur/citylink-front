<template>
  <div class="announcements-page">
    <Header />

    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>{{ $t('hero.title') }}</h1>
        <p>{{ $t('hero.subtitle') }}</p>
      </div>
    </section>

    <!-- Section pour les annonces mises en valeur -->
    <section v-if="featuredAnnouncements.length > 0" class="featured-announcement-section">
      <div v-for="announcement in featuredAnnouncements" :key="announcement.id" class="featured-announcement">
        <div class="featured-badge">{{ $t('featured.badge') }}</div>
        <h2>{{ announcement.title }}</h2>
        <p class="featured-date">{{ formatDate(announcement.publication_date) }}</p>
        <p class="featured-description">{{ announcement.content }}</p>
      </div>
    </section>

    <section class="announcements-list-section">
      <h2>{{ $t('recent.title') }}</h2>
      <ul class="announcements-list">
        <li v-for="announcement in regularAnnouncements" :key="announcement.id" class="announcement-item">
          <div class="announcement-content">
            <h3>{{ announcement.title }}</h3>
            <p class="announcement-date">{{ formatDate(announcement.publication_date) }}</p>
            <p class="announcement-description">{{ announcement.content }}</p>
          </div>
        </li>
      </ul>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from "../components/views/Header.vue";
import Footer from "../components/views/Footer.vue";
import axios from 'axios';

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      featuredAnnouncements: [],
      regularAnnouncements: [],
      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    };
  },
  mounted() {
    this.fetchAnnouncements();
  },
  methods: {
    async fetchAnnouncements() {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${this.API_URL}/announcements/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Séparation directe des annonces
        console.log(data);
        this.featuredAnnouncements = data.filter(ann => ann.is_featured === 1);
        this.regularAnnouncements = data.filter(ann => ann.is_featured !== 1);
      } catch (error) {
        console.error('Erreur lors de la récupération des annonces :', error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('fr-FR');
    }
  },
};
</script>