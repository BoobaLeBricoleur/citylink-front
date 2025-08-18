<template>
  <div class="surveys-page">
    <Header/>

    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>{{ $t('pages.surveys.hero.title') }}</h1>
        <p>{{ $t('pages.surveys.hero.subtitle') }}</p>
      </div>
    </section>

    <section class="search-filter-section">
      <div class="search-bar">
        <input
            type="text"
            :placeholder="$t('pages.surveys.search.placeholder')"
            v-model="searchTerm"
        />
        <button class="search-button">
          <Icon name="heroicons:magnifying-glass"/>
        </button>
      </div>
    </section>

    <section class="surveys-section">
      <div v-if="loading" class="loading-indicator">
        <p>{{ $t('pages.surveys.loading') }}</p>
      </div>
      <div v-else-if="filteredSurveys.length === 0" class="no-results">
        <p>{{ $t('pages.surveys.noResults') }}</p>
      </div>
      <div v-else class="surveys-grid">
        <div
            v-for="survey in filteredSurveys"
            :key="survey.id"
            class="survey-card"
            @click="viewSurveyDetails(survey.id)"
        >
          <div class="card-header">
            <span class="author">{{ survey.firstname }} {{ survey.lastname }}</span>
            <span class="date">{{ formatDate(survey.creation_date) }}</span>
          </div>
          <h3>{{ survey.question }}</h3>

          <div class="survey-stats">
            <div v-for="option in survey.options" :key="option.id" class="stat-item">
              <div class="option-text">{{ option.option }}</div>
              <div class="stat-bar">
                <div class="stat-fill" :style="{width: `${getPercentage(option, survey.options)}%`}"></div>
              </div>
              <div class="stat-percentage">{{ getPercentage(option, survey.options) }}%</div>
            </div>
          </div>

          <div class="card-footer">
            <button class="vote-button">
              {{ userHasVoted(survey.id) ? $t('pages.surveys.card.changeVote') : $t('pages.surveys.card.vote') }}
            </button>
            <span class="votes-count">{{ getTotalVotes(survey.options) }} {{ $t('pages.surveys.card.votes') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal pour voter -->
    <div v-if="showVoteModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ selectedSurvey ? selectedSurvey.question : '' }}</h2>
          <button class="close-btn" @click="showVoteModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="vote-options">
            <div v-for="option in selectedSurvey?.options" :key="option.id" class="vote-option">
              <input
                  type="radio"
                  :id="`option-${option.id}`"
                  :value="option.id"
                  v-model="selectedOptionId"
                  :name="'vote-options'"
              />
              <label :for="`option-${option.id}`">{{ option.option }}</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showVoteModal = false">
            {{ $t('pages.surveys.modal.vote.cancel') }}
          </button>
          <button class="btn btn-primary" @click="submitVote" :disabled="!selectedOptionId">
            {{ $t('pages.surveys.modal.vote.submit') }}
          </button>
        </div>
      </div>
    </div>

    <Footer/>
  </div>
</template>

<script>
import Header from "../components/views/Header.vue";
import Footer from "../components/views/Footer.vue";
import axios from 'axios';

export default {
  name: 'SurveysPage',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      searchTerm: '',
      loading: true,
      surveys: [],
      userVotes: {},
      isLoggedIn: false,
      showVoteModal: false,
      selectedSurvey: null,
      selectedOptionId: null,
      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    };
  },
  computed: {
    filteredSurveys() {
      if (!this.searchTerm.trim()) {
        return this.surveys;
      }

      const term = this.searchTerm.toLowerCase();
      return this.surveys.filter(survey =>
          survey.question.toLowerCase().includes(term) ||
          survey.options.some(option => option.option.toLowerCase().includes(term)) ||
          `${survey.firstname} ${survey.lastname}`.toLowerCase().includes(term)
      );
    }
  },
  async mounted() {
    this.checkAuth();
    await this.fetchSurveys();
    if (this.isLoggedIn) {
      await this.fetchUserVotes();
    }
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    },

    async fetchSurveys() {
      try {
        this.loading = true;
        const response = await axios.get(`${this.API_URL}/surveys`);
        this.surveys = response.data || [];
        this.loading = false;
      } catch (error) {
        console.error('Erreur lors de la récupération des sondages:', error);
        this.loading = false;
      }
    },

    async fetchUserVotes() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Récupérer les votes de l'utilisateur pour tous les sondages affichés
        const promises = this.surveys.map(survey =>
            axios.get(`${this.API_URL}/surveys/${survey.id}`, {
              headers: {Authorization: `Bearer ${token}`}
            })
        );

        const responses = await Promise.all(promises);

        // Stocker les votes de l'utilisateur
        responses.forEach(response => {
          if (response.data.userVote) {
            this.userVotes[response.data.survey.id] = response.data.userVote.survey_option_id;
          }
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des votes:', error);
      }
    },

    viewSurveyDetails(id) {
      if (!this.isLoggedIn) {
        this.$router.push('/login');
        return;
      }

      const survey = this.surveys.find(s => s.id === id);
      if (!survey) return;

      this.selectedSurvey = survey;
      this.selectedOptionId = this.userVotes[id] || null;
      this.showVoteModal = true;
    },

    async submitVote() {
      try {
        if (!this.selectedOptionId || !this.selectedSurvey) {
          alert('Veuillez sélectionner une option');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          alert('Vous devez être connecté pour voter');
          return;
        }

        await axios.post(
            `${this.API_URL}/surveys/${this.selectedSurvey.id}/vote`,
            {option_id: this.selectedOptionId},
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
        );

        // Mettre à jour le vote de l'utilisateur
        this.userVotes[this.selectedSurvey.id] = this.selectedOptionId;

        this.showVoteModal = false;
        await this.fetchSurveys();

      } catch (error) {
        console.error('Erreur:', error.response?.data || error);
        alert('Erreur lors de l\'enregistrement du vote');
      }
    },

    userHasVoted(surveyId) {
      return !!this.userVotes[surveyId];
    },

    getTotalVotes(options) {
      return options.reduce((sum, option) => {
        return sum + (option.count || 0);
      }, 0);
    },

    getPercentage(option, allOptions) {
      const total = this.getTotalVotes(allOptions);
      if (!total) return 0;

      const count = option.count || 0;
      return Math.round((count / total) * 100);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(date);
    }
  },
  head() {
    return {
      title: 'CityLink | Sondages',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.surveys.meta.description')
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.surveys-page {
  background-color: #f8fafc;

  .hero-section {
    position: relative;
    background-color: #4299e1;
    color: white;
    padding: 4rem 1rem;
    text-align: center;

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .hero-content {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      z-index: 1;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.2rem;
        opacity: 0.9;
      }
    }
  }

  .search-filter-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;

    .search-bar {
      position: relative;
      flex: 1;
      min-width: 300px;

      input {
        width: 100%;
        padding: 0.8rem 1rem 0.8rem 3rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        font-size: 1rem;
      }

      .search-button {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #718096;
        cursor: pointer;
      }
    }
  }

  .surveys-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;

    .loading-indicator, .no-results {
      text-align: center;
      padding: 3rem 0;
      color: #718096;
    }

    .surveys-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .survey-card {
      background-color: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        color: #718096;
        font-size: 0.9rem;

        .author {
          font-weight: 500;
        }
      }

      h3 {
        font-size: 1.3rem;
        color: #2d3748;
        margin-bottom: 1.2rem;
      }

      .survey-stats {
        margin-bottom: 1.5rem;

        .stat-item {
          margin-bottom: 0.8rem;

          .option-text {
            margin-bottom: 0.3rem;
            font-size: 0.95rem;
            color: #4a5568;
          }

          .stat-bar {
            height: 0.8rem;
            background-color: #edf2f7;
            border-radius: 0.4rem;
            overflow: hidden;
            margin-bottom: 0.2rem;
            position: relative;

            .stat-fill {
              height: 100%;
              background-color: #4299e1;
              border-radius: 0.4rem;
              transition: width 0.3s ease;
            }
          }

          .stat-percentage {
            text-align: right;
            font-size: 0.85rem;
            color: #718096;
          }
        }
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .vote-button {
          background-color: #4299e1;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.4rem;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .votes-count {
          color: #718096;
          font-size: 0.85rem;
        }
      }
    }
  }

  // Styles pour la modal de vote
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .modal-content {
      background-color: white;
      border-radius: 0.5rem;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-size: 1.5rem;
        color: #2d3748;
        margin: 0;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.8rem;
        cursor: pointer;
        color: #718096;
      }
    }

    .modal-body {
      padding: 1.5rem;

      .vote-options {
        .vote-option {
          margin-bottom: 1rem;
          padding: 0.8rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.4rem;
          transition: background-color 0.2s;

          &:hover {
            background-color: #f7fafc;
          }

          label {
            cursor: pointer;
            display: inline-block;
            padding-left: 0.5rem;
          }

          input {
            cursor: pointer;
          }
        }
      }
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;

      .btn {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 0.4rem;
        cursor: pointer;
        font-weight: 500;

        &.btn-primary {
          background-color: #4299e1;
          color: white;

          &:hover {
            background-color: #3182ce;
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }

        &.btn-secondary {
          background-color: #e2e8f0;
          color: #4a5568;

          &:hover {
            background-color: #cbd5e0;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .surveys-page {
    .hero-section {
      padding: 3rem 1rem;

      .hero-content {
        h1 {
          font-size: 2rem;
        }
      }
    }

    .surveys-section {
      .surveys-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>