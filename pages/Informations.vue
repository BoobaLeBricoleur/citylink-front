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
          <i class="fas fa-search"></i>
        </button>
      </div>
      <div class="filter-options">
        <button
            v-for="filter in filtersData"
            :key="filter.key"
            class="filter-button"
            :class="{ active: currentFilter === filter.key }"
            @click="setFilter(filter.key)"
        >
          {{ $t('pages.informations.' + filter.label) }}
        </button>
      </div>
    </section>

    <section class="announcements-section">
      <div class="announcement-grid">
        <div
            v-for="(announcement, index) in filteredAnnouncements"
            :key="index"
            class="announcement-card"
            :class="{ premium: announcement.isPremium }"
        >
          <div class="card-header">
            <span class="category">{{ $t('pages.informations.' + announcement.categoryKey) }}</span>
            <span class="date">{{ announcement.date }}</span>
          </div>
          <h3>{{ announcement.title }}</h3>
          <p>{{ announcement.description }}</p>
          <div class="card-footer">
            <button class="read-more">{{ $t('pages.informations.card.readMore') }}</button>
            <span class="views"><i class="fas fa-eye"></i> {{ announcement.views }}</span>
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
      filtersData: [
        { key: 'all', label: 'filters.all' },
        { key: 'events', label: 'filters.events' },
        { key: 'works', label: 'filters.works' },
        { key: 'news', label: 'filters.news' }
      ],
      announcements: [
        {
          categoryKey: 'categories.event',
          category: 'Événement',
          date: '28 Avril 2025',
          title: 'Festival des Arts Urbains',
          description: 'Rejoignez-nous pour une célébration de l\'art urbain avec des artistes locaux et internationaux.',
          views: '1.2k',
          isPremium: true
        },
        {
          categoryKey: 'categories.works',
          category: 'Travaux',
          date: '25 Avril 2025',
          title: 'Modernisation du centre-ville',
          description: 'Information sur les travaux de rénovation prévus au cœur de la ville durant le mois de mai.',
          views: '856',
          isPremium: false
        },
        {
          categoryKey: 'categories.news',
          category: 'Actualité',
          date: '20 Avril 2025',
          title: 'Nouveau partenariat commercial',
          description: 'CityLink accueille 15 nouveaux commerçants d\'exception sur sa plateforme ce mois-ci.',
          views: '723',
          isPremium: false
        },
        {
          categoryKey: 'categories.event',
          category: 'Événement',
          date: '15 Avril 2025',
          title: 'Conférence Smart City',
          description: 'Participez à notre conférence annuelle sur les innovations urbaines et les villes intelligentes.',
          views: '1.5k',
          isPremium: true
        }
      ]
    };
  },
  computed: {
    filteredAnnouncements() {
      // Apply search filter
      let filtered = this.announcements;

      if (this.searchTerm.trim() !== '') {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term)
        );
      }

      // Apply category filter
      if (this.currentFilter !== 'all') {
        const categoryMapping = {
          'events': 'categories.event',
          'works': 'categories.works',
          'news': 'categories.news'
        };

        filtered = filtered.filter(item => item.categoryKey === categoryMapping[this.currentFilter]);
      }

      return filtered;
    }
  },
  methods: {
    setFilter(filter) {
      this.currentFilter = filter;
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