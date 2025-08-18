<template>
  <div class="admin-portal">
    <AdminSidebar/>
    <div class="main">
      <AdminHeader/>
      <div class="intro">
        <div class="intro-header">
          <h1>{{ $t('pages.admin.survey.title', 'Gestion des sondages') }}</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            <Icon name="heroicons:plus"/>
            {{ $t('pages.admin.survey.newButton', 'Créer un sondage') }}
          </button>
        </div>
        <p>{{
            $t('pages.admin.survey.subtitle', 'Créez et gérez les sondages pour recueillir l\'opinion des utilisateurs.')
          }}</p>
      </div>

      <div class="search-bar">
        <div class="search-input-wrapper">
          <Icon name="heroicons:magnifying-glass" class="search-icon"/>
          <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('pages.admin.survey.searchPlaceholder', 'Rechercher un sondage...')"
              class="search-input"
          >
        </div>
      </div>

      <!-- Modal de création -->
      <div v-if="showCreateModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ $t('pages.admin.survey.modal.title', 'Créer un nouveau sondage') }}</h3>
            <button class="close-btn" @click="showCreateModal = false">&times;</button>
          </div>
          <form @submit.prevent="createSurvey" class="survey-form">
            <div class="form-group">
              <label for="question">{{ $t('pages.admin.survey.form.questionLabel', 'Question') }}</label>
              <input
                  type="text"
                  id="question"
                  v-model="newSurvey.question"
                  required
                  class="form-control"
                  placeholder="Posez votre question ici"
              >
            </div>
            <div class="form-group">
              <label>{{ $t('pages.admin.survey.form.optionsLabel', 'Options de réponse') }}</label>
              <div v-for="(option, index) in newSurvey.options" :key="index" class="option-row">
                <input
                    type="text"
                    v-model="newSurvey.options[index]"
                    required
                    class="form-control"
                    :placeholder="`Option ${index + 1}`"
                >
                <button
                    type="button"
                    @click="removeOption(index)"
                    class="btn btn-danger option-btn"
                    :disabled="newSurvey.options.length <= 2"
                >
                  <Icon name="heroicons:trash"/>
                </button>
              </div>
              <button type="button" @click="addOption" class="btn btn-secondary add-option-btn">
                <Icon name="heroicons:plus"/>
                {{ $t('pages.admin.survey.buttons.addOption', 'Ajouter une option') }}
              </button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCreateModal = false">
                {{ $t('pages.admin.survey.buttons.cancel', 'Annuler') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="newSurvey.options.length < 2">
                <Icon name="heroicons:plus"/>
                {{ $t('pages.admin.survey.buttons.create', 'Créer') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de modification -->
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ $t('pages.admin.survey.modal.editTitle', 'Modifier le sondage') }}</h3>
            <button class="close-btn" @click="showEditModal = false">&times;</button>
          </div>
          <form @submit.prevent="updateSurvey" class="survey-form">
            <div class="form-group">
              <label for="edit-question">{{ $t('pages.admin.survey.form.questionLabel', 'Question') }}</label>
              <input
                  type="text"
                  id="edit-question"
                  v-model="editingSurvey.question"
                  required
                  class="form-control"
              >
            </div>
            <div class="form-group">
              <label>{{ $t('pages.admin.survey.form.optionsLabel', 'Options de réponse') }}</label>
              <div v-for="(option, index) in editingSurvey.options" :key="index" class="option-row">
                <input
                    type="text"
                    v-model="editingOptions[index]"
                    required
                    class="form-control"
                    :placeholder="`Option ${index + 1}`"
                    :disabled="option.hasResponses"
                >
                <button
                    type="button"
                    @click="removeEditOption(index)"
                    class="btn btn-danger option-btn"
                    :disabled="editingOptions.length <= 2 || option.hasResponses"
                >
                  <Icon name="heroicons:trash"/>
                </button>
              </div>
              <button type="button" @click="addEditOption" class="btn btn-secondary add-option-btn">
                <Icon name="heroicons:plus"/>
                {{ $t('pages.admin.survey.buttons.addOption', 'Ajouter une option') }}
              </button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showEditModal = false">
                {{ $t('pages.admin.survey.buttons.cancel', 'Annuler') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="editingOptions.length < 2">
                {{ $t('pages.admin.survey.buttons.update', 'Mettre à jour') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Liste des sondages -->
      <div class="survey-list">
        <div v-if="filteredSurveys.length === 0" class="no-surveys">
          {{ $t('pages.admin.survey.noResults', 'Aucun sondage trouvé') }}
        </div>
        <ul v-else>
          <li v-for="survey in filteredSurveys" :key="survey.id" class="survey-item">
            <div class="survey-header">
              <strong>{{ survey.question }}</strong>
              <div class="survey-actions">
                <button @click="editSurvey(survey)" class="btn btn-secondary btn-sm">
                  <Icon name="heroicons:pencil"/>
                  {{ $t('pages.admin.survey.buttons.edit', 'Modifier') }}
                </button>
                <button @click="confirmDelete(survey.id)" class="btn btn-danger btn-sm">
                  <Icon name="heroicons:trash"/>
                  {{ $t('pages.admin.survey.buttons.delete', 'Supprimer') }}
                </button>
              </div>
            </div>
            <div class="survey-content">
              <p>{{ $t('pages.admin.survey.createdBy', 'Créé par') }}: {{ survey.firstname }} {{ survey.lastname }}</p>
              <p>{{ $t('pages.admin.survey.createdAt', 'Date de création') }}: {{
                  formatDate(survey.creation_date)
                }}</p>
            </div>
            <div class="survey-options">
              <h4>{{ $t('pages.admin.survey.options', 'Options') }}:</h4>
              <ul>
                <li v-for="option in survey.options" :key="option.id">
                  {{ option.option }}
                </li>
              </ul>
            </div>
            <div class="survey-stats" v-if="survey.stats">
              <h4>{{ $t('pages.admin.survey.results', 'Résultats') }}:</h4>
              <div class="stats-bars">
                <div v-for="stat in survey.stats" :key="stat.id" class="stat-item">
                  <div class="stat-label">{{ stat.option }}: {{ stat.count }} votes ({{ stat.percentage }}%)</div>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: stat.percentage + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Modal de confirmation de suppression -->
      <div v-if="showDeleteModal" class="modal">
        <div class="modal-content delete-modal">
          <div class="modal-header">
            <h3>{{ $t('pages.admin.survey.modal.confirmDelete', 'Confirmer la suppression') }}</h3>
            <button class="close-btn" @click="showDeleteModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <p>{{
                $t('pages.admin.survey.modal.deleteWarning', 'Êtes-vous sûr de vouloir supprimer ce sondage ? Cette action est irréversible.')
              }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">
              {{ $t('pages.admin.survey.buttons.cancel', 'Annuler') }}
            </button>
            <button type="button" class="btn btn-danger" @click="deleteSurvey">
              {{ $t('pages.admin.survey.buttons.confirmDelete', 'Oui, supprimer') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AdminSidebar from '~/components/admin/AdminSidebar.vue';
import AdminHeader from '~/components/admin/AdminHeader.vue';

export default {
  components: {AdminSidebar, AdminHeader},
  name: 'AdminSurveys',
  data() {
    return {
      surveys: [],
      searchQuery: '',
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      newSurvey: {
        question: '',
        options: ['', ''] // Minimum 2 options par défaut
      },
      editingSurvey: null,
      editingOptions: [],
      surveyToDelete: null,
      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    };
  },
  computed: {
    filteredSurveys() {
      if (!this.searchQuery) return this.surveys;

      const query = this.searchQuery.toLowerCase();
      return this.surveys.filter(survey =>
          survey.question.toLowerCase().includes(query)
      );
    }
  },
  async mounted() {
    await this.fetchSurveys();
  },
  methods: {
    async fetchSurveys() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${this.API_URL}/surveys/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.surveys = response.data || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des sondages:', error);
      }
    },

    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    addOption() {
      this.newSurvey.options.push('');
    },

    removeOption(index) {
      if (this.newSurvey.options.length > 2) {
        this.newSurvey.options.splice(index, 1);
      }
    },

    addEditOption() {
      this.editingOptions.push('');
    },

    removeEditOption(index) {
      if (this.editingOptions.length > 2 && !this.editingSurvey.options[index].hasResponses) {
        this.editingOptions.splice(index, 1);
      }
    },

    async createSurvey() {
      try {
        // Filtrer les options vides
        const options = this.newSurvey.options.filter(option => option.trim() !== '');

        if (options.length < 2) {
          alert('Veuillez ajouter au moins deux options');
          return;
        }

        const token = localStorage.getItem('token');
        await axios.post(
            `${this.API_URL}/surveys/`,
            {
              question: this.newSurvey.question,
              options: options
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
        );

        // Réinitialiser le formulaire
        this.newSurvey = {
          question: '',
          options: ['', '']
        };

        this.showCreateModal = false;
        await this.fetchSurveys();

      } catch (error) {
        console.error('Erreur:', error.response?.data || error);
        alert('Erreur lors de la création du sondage');
      }
    },

    editSurvey(survey) {
      this.editingSurvey = {...survey};

      // Préparer les options pour l'édition
      // Marquer les options qui ont des réponses pour les désactiver
      this.editingOptions = survey.options.map(opt => opt.option);

      this.showEditModal = true;
    },

    async updateSurvey() {
      try {
        const token = localStorage.getItem('token');

        // Filtrer les options vides
        const options = this.editingOptions.filter(option => option.trim() !== '');

        if (options.length < 2) {
          alert('Veuillez ajouter au moins deux options');
          return;
        }

        await axios.put(
            `${this.API_URL}/surveys/${this.editingSurvey.id}`,
            {
              question: this.editingSurvey.question,
              options: options
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
        );

        this.showEditModal = false;
        await this.fetchSurveys();

      } catch (error) {
        console.error('Erreur:', error.response?.data || error);
        alert('Erreur lors de la mise à jour du sondage');
      }
    },

    confirmDelete(id) {
      this.surveyToDelete = id;
      this.showDeleteModal = true;
    },

    async deleteSurvey() {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${this.API_URL}/surveys/${this.surveyToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.showDeleteModal = false;
        await this.fetchSurveys();

      } catch (error) {
        console.error('Erreur:', error.response?.data || error);
        alert('Erreur lors de la suppression du sondage');
      }
    }
  }
};
</script>
