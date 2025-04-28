<template>
    <div class="informations-page">
      <Header />
  
      <section class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1>Actualités CityLink</h1>
          <p>Restez informé des dernières nouvelles de votre ville</p>
        </div>
      </section>
  
      <section class="search-filter-section">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Rechercher une information..." 
            v-model="searchTerm"
          />
          <button class="search-button">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <div class="filter-options">
          <button 
            v-for="filter in filters" 
            :key="filter"
            class="filter-button" 
            :class="{ active: currentFilter === filter }"
            @click="setFilter(filter)"
          >
            {{ filter }}
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
              <span class="category">{{ announcement.category }}</span>
              <span class="date">{{ announcement.date }}</span>
            </div>
            <h3>{{ announcement.title }}</h3>
            <p>{{ announcement.description }}</p>
            <div class="card-footer">
              <button class="read-more">Lire plus</button>
              <span class="views"><i class="fas fa-eye"></i> {{ announcement.views }}</span>
            </div>
          </div>
        </div>
      </section>
  
      <section class="newsletter-section">
        <div class="newsletter-container">
          <h2>Restez connecté</h2>
          <p>Inscrivez-vous à notre newsletter pour recevoir les dernières informations directement dans votre boîte de réception.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Votre adresse email" />
            <button class="subscribe-button">S'abonner</button>
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
        currentFilter: 'Toutes',
        searchTerm: '',
        filters: ['Toutes', 'Événements', 'Travaux', 'Actualités'],
        announcements: [
          {
            category: 'Événement',
            date: '28 Avril 2025',
            title: 'Festival des Arts Urbains',
            description: 'Rejoignez-nous pour une célébration de l\'art urbain avec des artistes locaux et internationaux.',
            views: '1.2k',
            isPremium: true
          },
          {
            category: 'Travaux',
            date: '25 Avril 2025',
            title: 'Modernisation du centre-ville',
            description: 'Information sur les travaux de rénovation prévus au cœur de la ville durant le mois de mai.',
            views: '856',
            isPremium: false
          },
          {
            category: 'Actualité',
            date: '20 Avril 2025',
            title: 'Nouveau partenariat commercial',
            description: 'CityLink accueille 15 nouveaux commerçants d\'exception sur sa plateforme ce mois-ci.',
            views: '723',
            isPremium: false
          },
          {
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
        if (this.currentFilter !== 'Toutes') {
          // Handle plural to singular form mapping
          const categoryMap = {
            'Événements': 'Événement',
            'Travaux': 'Travaux',
            'Actualités': 'Actualité'
          };
          
          const categoryFilter = categoryMap[this.currentFilter] || this.currentFilter;
          filtered = filtered.filter(item => item.category === categoryFilter);
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
            content: 'Consultez les dernières actualités et informations de votre ville sur CityLink.' 
          }
        ]
      }
    }
  }
  </script>