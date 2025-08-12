<template>
  <div class="informations-page">
    <Header />

    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>{{ $t('pages.informations.hero.title') }}</h1>
        <p>{{ $t('pages.informations.hero.subtitle') }}</p>
      </div>
    </section>

    <section class="search-filter-section">
      <div class="search-bar">
        <input
            type="text"
            :placeholder="$t('pages.informations.search.placeholder')"
            v-model="searchTerm"
        />
        <button class="search-button">
          <Icon name="heroicons:magnifying-glass" />
        </button>
      </div>
      <div class="filter-options">
        <button
            class="filter-button"
            :class="{ active: currentFilter === 'all' }"
            @click="setFilter('all')"
        >
          {{ $t('pages.informations.filters.all') }}
        </button>
        <button
            v-for="tag in allTags"
            :key="tag.id"
            class="filter-button"
            :class="{ active: currentFilter === tag.id }"
            @click="setFilter(tag.id)"
        >
          {{ tag.name }}
        </button>
      </div>
    </section>

    <section class="announcements-section">
      <div v-if="loading" class="loading-indicator">
        <p>Chargement des informations...</p>
      </div>
      <div v-else-if="filteredInformations.length === 0" class="no-results">
        <p>Aucune information trouvée</p>
      </div>
      <div v-else class="announcement-grid">
        <div
            v-for="information in filteredInformations"
            :key="information.id"
            class="announcement-card"
            @click="viewInformationDetails(information.id)"
        >
          <div class="card-header">
            <div class="tags-container">
              <span
                  v-for="tag in information.tags"
                  :key="tag.id"
                  class="category"
              >
                {{ tag.name }}
              </span>
            </div>
            <span class="date">{{ formatDate(information.publication_date) }}</span>
          </div>
          <h3>{{ information.title }}</h3>
          <p>{{ information.summary || truncateText(information.content, 100) }}</p>
          <div class="card-footer">
            <button class="read-more">{{ $t('pages.informations.card.readMore') }}</button>
          </div>
        </div>
      </div>
    </section>

    <section class="newsletter-section">
      <div class="newsletter-container">
        <h2>{{ $t('pages.informations.newsletter.title') }}</h2>
        <p>{{ $t('pages.informations.newsletter.description') }}</p>
        <div class="newsletter-form">
          <input type="email" :placeholder="$t('pages.informations.newsletter.emailPlaceholder')" />
          <button class="subscribe-button">{{ $t('pages.informations.newsletter.subscribe') }}</button>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from "../components/views/Header.vue";
import Footer from "../components/views/Footer.vue";
import axios from 'axios';

export default {
  name: 'InformationsPage',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      currentFilter: 'all',
      searchTerm: '',
      loading: true,
      informations: [],
      allTags: [],
      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    };
  },
  computed: {
    filteredInformations() {
      // Appliquer le filtre de recherche
      let filtered = this.informations;

      if (this.searchTerm.trim() !== '') {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(term) ||
            (item.summary && item.summary.toLowerCase().includes(term)) ||
            item.content.toLowerCase().includes(term)
        );
      }

      // Appliquer le filtre par tag
      if (this.currentFilter !== 'all') {
        filtered = filtered.filter(item =>
            item.tags && item.tags.some(tag => tag.id === this.currentFilter)
        );
      }

      return filtered;
    }
  },
  async mounted() {
    await this.fetchTags();
    await this.fetchInformations();
  },
  methods: {
    async fetchInformations() {
      try {
        this.loading = true;
        const response = await axios.get(`${this.API_URL}/information?withTags=true`);
        this.informations = response.data || [];
        this.loading = false;
      } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error);
        this.loading = false;
      }
    },

    async fetchTags() {
      try {
        const response = await axios.get(`${this.API_URL}/tags`);
        this.allTags = response.data || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des tags:', error);
      }
    },

    setFilter(filter) {
      this.currentFilter = filter;
    },

    viewInformationDetails(id) {
      // Navigation vers la page de détails d'une information
      this.$router.push(`/information/${id}`);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    },

    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    }
  },
  head() {
    return {
      title: 'CityLink | Informations',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.informations.meta.description')
        }
      ]
    }
  }
}
</script>