<template>
  <div>
    <Header />
    <section class="hero">
      <div class="hero-content">
        <h1>{{ information?.title }}</h1>
        <p v-if="information?.publication_date">Publié le {{ formatDate(information.publication_date) }}</p>
      </div>
    </section>

    <section class="information-details">
      <div class="details-container">
        <div v-if="loading" class="loading-indicator">
          <p>Chargement de l'information...</p>
        </div>

        <div v-else-if="error" class="error-message">
          <p>{{ error }}</p>
          <button class="btn-retry" @click="fetchInformation">
            {{ $t('pages.informationDetails.retry') }}
          </button>
        </div>

        <template v-else-if="information">
          <div class="information-image">
            <div class="tag-container">
              <span v-for="tag in information.tags" :key="tag.id" class="tag">
                {{ tag.name }}
              </span>
            </div>
          </div>

          <div class="information-info">
            <h2>{{ $t('pages.informationDetails.about') }}</h2>

            <div v-if="information.summary" class="summary-box">
              <p class="summary">{{ information.summary }}</p>
            </div>

            <p class="description" v-html="formattedContent"></p>

            <div class="info-line date-line">
              📅 <span>{{ formatDate(information.publication_date) }}</span>
            </div>

            <div class="share-section">
              <div class="info-line">
                🔗 <span>Partager:</span>
                <div class="share-buttons">
                  <button class="share-btn facebook">
                    <Icon name="mdi:facebook" />
                  </button>
                  <button class="share-btn twitter">
                    <Icon name="mdi:twitter" />
                  </button>
                  <button class="share-btn linkedin">
                    <Icon name="mdi:linkedin" />
                  </button>
                  <button class="share-btn email">
                    <Icon name="heroicons:envelope" />
                  </button>
                </div>
              </div>
            </div>

            <button class="btn-back" @click="$router.push('/informations')">
              ⬅ Retour aux informations
            </button>
          </div>
        </template>

        <div v-else class="not-found">
          <h2>{{ $t('pages.informationDetails.notFound') }}</h2>
          <p>{{ $t('pages.informationDetails.notFoundMessage') }}</p>
          <button class="btn-back" @click="$router.push('/informations')">
            ⬅ Retour aux informations
          </button>
        </div>
      </div>
    </section>

    <section class="related-section" v-if="information && relatedInformations.length > 0">
      <div class="container">
        <h2>{{ $t('pages.informationDetails.related') }}</h2>
        <div class="related-grid">
          <div
              v-for="relatedInfo in relatedInformations"
              :key="relatedInfo.id"
              class="related-card"
              @click="viewInformationDetails(relatedInfo.id)"
          >
            <h3>{{ relatedInfo.title }}</h3>
            <p>{{ relatedInfo.summary || truncateText(relatedInfo.content, 100) }}</p>
            <div class="card-footer">
              <div class="tags-container">
                <span v-for="tag in relatedInfo.tags" :key="tag.id" class="tag small">
                  {{ tag.name }}
                </span>
              </div>
              <span class="date">{{ formatDate(relatedInfo.publication_date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from "~/components/views/Header.vue";
import Footer from "~/components/views/Footer.vue";
import axios from 'axios';

export default {
  name: 'InformationDetailsPage',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      information: null,
      loading: true,
      error: null,
      relatedInformations: [],
      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    };
  },
  computed: {
    formattedContent() {
      if (!this.information || !this.information.content) return '';

      // Convertir les sauts de ligne en balises <br>
      return this.information.content
          .replace(/\n/g, '<br>')
          // Créer des liens cliquables
          .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }
  },
  async mounted() {
    await this.fetchInformation();
  },
  methods: {
    async fetchInformation() {
      const informationId = this.$route.params.id;

      if (!informationId) {
        this.error = "ID d'information non spécifié";
        this.loading = false;
        return;
      }

      try {
        this.loading = true;
        this.error = null;

        // Récupérer l'information
        const response = await axios.get(`${this.API_URL}/information/${informationId}`);
        this.information = response.data;

        // Si l'information a des tags, rechercher des informations similaires
        if (this.information && this.information.tags && this.information.tags.length > 0) {
          await this.fetchRelatedInformations();
        }

        this.loading = false;
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'information:', error);
        this.error = "Impossible de charger l'information. Veuillez réessayer.";
        this.loading = false;
      }
    },

    async fetchRelatedInformations() {
      try {
        // Prendre les ID des tags de l'information actuelle
        const tagIds = this.information.tags.map(tag => tag.id);

        // Récupérer toutes les informations
        const response = await axios.get(`${this.API_URL}/information?withTags=true`);
        const allInformations = response.data || [];

        // Filtrer pour trouver les informations qui partagent au moins un tag
        // et qui ne sont pas l'information actuelle
        this.relatedInformations = allInformations
            .filter(info =>
                info.id !== this.information.id &&
                info.tags &&
                info.tags.some(tag => tagIds.includes(tag.id))
            )
            .slice(0, 3); // Limiter à 3 informations similaires
      } catch (error) {
        console.error('Erreur lors de la récupération des informations similaires:', error);
        this.relatedInformations = [];
      }
    },

    viewInformationDetails(id) {
      // Rediriger vers la page de détail de la nouvelle information
      this.$router.push(`/informations/${id}`);
      // Recharger les données pour la nouvelle information
      this.fetchInformation();
      // Remonter en haut de la page
      window.scrollTo(0, 0);
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
      title: this.information
          ? `CityLink | ${this.information.title}`
          : 'CityLink | Information',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.information && this.information.summary
              ? this.information.summary
              : this.$t('pages.informationDetails.meta.description')
        }
      ]
    }
  }
}
</script>
