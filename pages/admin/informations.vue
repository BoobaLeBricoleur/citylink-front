<template>
  <div class="admin-portal">
    <AdminSidebar />
    <div class="main">
      <AdminHeader />

      <!-- En-tête de la page -->
      <div class="intro">
        <div class="intro-header">
          <h1>Gestion des informations et tags</h1>
          <div class="action-buttons">
            <button @click="showCreateInfoModal = true" class="btn btn-primary mr-2">
              <Icon name="heroicons:plus" /> Nouvelle information
            </button>
            <button @click="showCreateTagModal = true" class="btn btn-secondary">
              <Icon name="heroicons:plus" /> Nouveau tag
            </button>
          </div>
        </div>
        <p>Gérez les informations et tags disponibles sur votre plateforme</p>
      </div>

      <!-- Onglets pour choisir entre informations et tags -->
      <div class="tabs">
        <button
            :class="['tab-btn', activeTab === 'information' ? 'active' : '']"
            @click="activeTab = 'information'"
        >
          Informations
        </button>
        <button
            :class="['tab-btn', activeTab === 'tags' ? 'active' : '']"
            @click="activeTab = 'tags'"
        >
          Tags
        </button>
      </div>

      <!-- Barre de recherche -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <Icon name="heroicons:magnifying-glass" class="search-icon" />
          <input
              type="text"
              v-model="searchQuery"
              :placeholder="activeTab === 'information' ? 'Rechercher une information...' : 'Rechercher un tag...'"
              class="search-input"
          >
        </div>
      </div>

      <!-- Section des informations -->
      <div v-if="activeTab === 'information'" class="business-list">
        <div v-if="filteredInformations.length === 0" class="no-items">
          Aucune information trouvée
        </div>
        <ul v-else>
          <li v-for="item in filteredInformations" :key="item.id" class="business-item">
            <div class="business-header">
              <strong>{{ item.title }}</strong>
              <div class="tags-container">
                <span
                    v-for="tag in item.tags"
                    :key="tag.id"
                    class="category-badge"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>
            <div class="business-content">
              <p><strong>Résumé :</strong> {{ item.summary || 'Aucun résumé' }}</p>
              <p class="info-content">{{ truncateText(item.content, 150) }}</p>
              <p><strong>Date de publication :</strong> {{ formatDate(item.publication_date) }}</p>
            </div>
            <div class="business-footer">
              <div class="action-buttons">
                <button @click.stop="editInformation(item)" class="btn btn-sm btn-secondary">
                  <Icon name="heroicons:pencil" /> Modifier
                </button>
                <button @click.stop="manageInfoTags(item)" class="btn btn-sm btn-secondary">
                  <Icon name="heroicons:tag" /> Gérer les tags
                </button>
                <button @click.stop="confirmDeleteInfo(item.id)" class="btn btn-sm btn-danger">
                  <Icon name="heroicons:trash" /> Supprimer
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Section des tags -->
      <div v-if="activeTab === 'tags'" class="business-list">
        <div v-if="filteredTags.length === 0" class="no-items">
          Aucun tag trouvé
        </div>
        <ul v-else class="tags-grid">
          <li v-for="tag in filteredTags" :key="tag.id" class="tag-item">
            <div class="tag-name">{{ tag.name }}</div>
            <div class="tag-actions">
              <button @click="editTag(tag)" class="btn btn-sm btn-secondary">
                <Icon name="heroicons:pencil" /> Modifier
              </button>
              <button @click="confirmDeleteTag(tag.id)" class="btn btn-sm btn-danger">
                <Icon name="heroicons:trash" /> Supprimer
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Modal de création d'information -->
      <div v-if="showCreateInfoModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ editMode ? 'Modifier une information' : 'Créer une nouvelle information' }}</h3>
            <button class="close-btn" @click="closeInfoModal">&times;</button>
          </div>
          <form @submit.prevent="submitInformation" class="business-form">
            <div class="form-group">
              <label for="title">Titre</label>
              <input
                  type="text"
                  id="title"
                  v-model="infoForm.title"
                  required
                  class="form-control"
                  placeholder="Titre de l'information"
              >
            </div>
            <div class="form-group">
              <label for="summary">Résumé</label>
              <input
                  type="text"
                  id="summary"
                  v-model="infoForm.summary"
                  class="form-control"
                  placeholder="Résumé de l'information"
              >
            </div>
            <div class="form-group">
              <label for="content">Contenu</label>
              <textarea
                  id="content"
                  v-model="infoForm.content"
                  required
                  class="form-control"
                  rows="6"
                  placeholder="Contenu détaillé de l'information"
              ></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeInfoModal">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary">
                {{ editMode ? 'Mettre à jour' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de création/modification de tag -->
      <div v-if="showCreateTagModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ editMode ? 'Modifier un tag' : 'Créer un nouveau tag' }}</h3>
            <button class="close-btn" @click="closeTagModal">&times;</button>
          </div>
          <form @submit.prevent="submitTag" class="business-form">
            <div class="form-group">
              <label for="name">Nom du tag</label>
              <input
                  type="text"
                  id="name"
                  v-model="tagForm.name"
                  required
                  class="form-control"
                  placeholder="Nom du tag"
              >
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeTagModal">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary">
                {{ editMode ? 'Mettre à jour' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de gestion des tags pour une information -->
      <div v-if="showManageTagsModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Gérer les tags pour "{{ selectedInfo?.title }}"</h3>
            <button class="close-btn" @click="showManageTagsModal = false">&times;</button>
          </div>
          <div class="business-form">
            <div class="selected-tags">
              <p><strong>Tags associés:</strong></p>
              <div class="tags-list">
                <div v-if="selectedInfoTags.length === 0" class="no-tags">
                  Aucun tag associé
                </div>
                <div
                    v-for="tag in selectedInfoTags"
                    :key="tag.id"
                    class="tag-chip"
                >
                  {{ tag.name }}
                  <button @click="removeTagFromInfo(tag.id)" class="remove-tag">×</button>
                </div>
              </div>
            </div>

            <div class="add-tag-section">
              <p><strong>Ajouter un tag:</strong></p>
              <div class="form-row">
                <select
                    v-model="selectedTagToAdd"
                    class="form-control"
                >
                  <option value="">Sélectionnez un tag</option>
                  <option
                      v-for="tag in availableTags"
                      :key="tag.id"
                      :value="tag.id"
                  >
                    {{ tag.name }}
                  </option>
                </select>
                <button
                    @click="addTagToInfo"
                    class="btn btn-primary"
                    :disabled="!selectedTagToAdd"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" @click="showManageTagsModal = false">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de confirmation de suppression -->
      <div v-if="showDeleteConfirmModal" class="modal">
        <div class="modal-content modal-sm">
          <div class="modal-header">
            <h3>Confirmation de suppression</h3>
            <button class="close-btn" @click="showDeleteConfirmModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteConfirmModal = false">
              Annuler
            </button>
            <button class="btn btn-danger" @click="confirmDelete">
              Supprimer
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
  components: { AdminSidebar, AdminHeader },
  name: 'AdminInformationTags',
  data() {
    return {
      activeTab: 'information',
      searchQuery: '',
      informations: [],
      tags: [],

      // Modals
      showCreateInfoModal: false,
      showCreateTagModal: false,
      showManageTagsModal: false,
      showDeleteConfirmModal: false,

      // Forms
      infoForm: {
        title: '',
        content: '',
        summary: ''
      },
      tagForm: {
        name: ''
      },

      // États
      editMode: false,
      selectedItemId: null,
      selectedInfo: null,
      selectedInfoTags: [],
      selectedTagToAdd: '',
      itemToDelete: {
        id: null,
        type: null
      },

      API_URL: process.env.API_URL || 'http://localhost:3000/api'
    };
  },
  computed: {
    filteredInformations() {
      if (!this.searchQuery) return this.informations;

      const query = this.searchQuery.toLowerCase();
      return this.informations.filter(info =>
          info.title.toLowerCase().includes(query) ||
          (info.summary && info.summary.toLowerCase().includes(query)) ||
          info.content.toLowerCase().includes(query) ||
          (info.tags && info.tags.some(tag => tag.name.toLowerCase().includes(query)))
      );
    },
    filteredTags() {
      if (!this.searchQuery) return this.tags;

      const query = this.searchQuery.toLowerCase();
      return this.tags.filter(tag => tag.name.toLowerCase().includes(query));
    },
    availableTags() {
      // Filtrer les tags qui ne sont pas déjà associés à l'information
      return this.tags.filter(tag =>
          !this.selectedInfoTags.some(infoTag => infoTag.id === tag.id)
      );
    }
  },
  async mounted() {
    await this.fetchInformations();
    await this.fetchTags();
  },
  methods: {
    async fetchInformations() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${this.API_URL}/information?withTags=true`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.informations = response.data || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des informations:', error);
      }
    },

    async fetchTags() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${this.API_URL}/tags`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.tags = response.data || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des tags:', error);
      }
    },

    // Méthodes pour les informations
    editInformation(info) {
      this.editMode = true;
      this.selectedItemId = info.id;
      this.infoForm = {
        title: info.title,
        content: info.content,
        summary: info.summary || ''
      };
      this.showCreateInfoModal = true;
    },

    async submitInformation() {
      try {
        const token = localStorage.getItem('token');

        if (this.editMode) {
          await axios.put(
              `${this.API_URL}/information/${this.selectedItemId}`,
              this.infoForm,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
          );
        } else {
          await axios.post(
              `${this.API_URL}/information`,
              this.infoForm,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
          );
        }

        this.closeInfoModal();
        await this.fetchInformations();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'information:', error.response?.data || error);
      }
    },

    closeInfoModal() {
      this.showCreateInfoModal = false;
      this.editMode = false;
      this.selectedItemId = null;
      this.infoForm = {
        title: '',
        content: '',
        summary: ''
      };
    },

    confirmDeleteInfo(id) {
      this.itemToDelete = {
        id: id,
        type: 'information'
      };
      this.showDeleteConfirmModal = true;
    },

    // Méthodes pour les tags
    editTag(tag) {
      this.editMode = true;
      this.selectedItemId = tag.id;
      this.tagForm = {
        name: tag.name
      };
      this.showCreateTagModal = true;
    },

    async submitTag() {
      try {
        const token = localStorage.getItem('token');

        if (this.editMode) {
          await axios.put(
              `${this.API_URL}/tags/${this.selectedItemId}`,
              this.tagForm,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
          );
        } else {
          await axios.post(
              `${this.API_URL}/tags`,
              this.tagForm,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
          );
        }

        this.closeTagModal();
        await this.fetchTags();
        await this.fetchInformations(); // Pour mettre à jour les tags dans les informations
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du tag:', error.response?.data || error);
      }
    },

    closeTagModal() {
      this.showCreateTagModal = false;
      this.editMode = false;
      this.selectedItemId = null;
      this.tagForm = {
        name: ''
      };
    },

    confirmDeleteTag(id) {
      this.itemToDelete = {
        id: id,
        type: 'tag'
      };
      this.showDeleteConfirmModal = true;
    },

    async confirmDelete() {
      try {
        const token = localStorage.getItem('token');

        if (this.itemToDelete.type === 'information') {
          await axios.delete(`${this.API_URL}/information/${this.itemToDelete.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          await this.fetchInformations();
        } else if (this.itemToDelete.type === 'tag') {
          await axios.delete(`${this.API_URL}/tags/${this.itemToDelete.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          await this.fetchTags();
          await this.fetchInformations();
        }

        this.showDeleteConfirmModal = false;
      } catch (error) {
        console.error('Erreur lors de la suppression:', error.response?.data || error);
      }
    },

    // Gestion des associations entre informations et tags
    async manageInfoTags(info) {
      this.selectedInfo = info;
      this.selectedInfoTags = info.tags || [];
      this.showManageTagsModal = true;
    },

    async addTagToInfo() {
      if (!this.selectedTagToAdd) return;

      try {
        const token = localStorage.getItem('token');

        await axios.post(
            `${this.API_URL}/information/${this.selectedInfo.id}/tags/${this.selectedTagToAdd}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` }
            }
        );

        // Mettre à jour la liste des tags pour cette information
        const tagToAdd = this.tags.find(t => t.id === parseInt(this.selectedTagToAdd));
        if (tagToAdd) {
          this.selectedInfoTags.push(tagToAdd);
        }

        this.selectedTagToAdd = '';
        await this.fetchInformations();
      } catch (error) {
        console.error('Erreur lors de l\'ajout du tag:', error.response?.data || error);
      }
    },

    async removeTagFromInfo(tagId) {
      try {
        const token = localStorage.getItem('token');

        await axios.delete(
            `${this.API_URL}/information/${this.selectedInfo.id}/tags/${tagId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
        );

        // Mettre à jour la liste des tags pour cette information
        this.selectedInfoTags = this.selectedInfoTags.filter(tag => tag.id !== tagId);
        await this.fetchInformations();
      } catch (error) {
        console.error('Erreur lors de la suppression du tag:', error.response?.data || error);
      }
    },

    // Utilitaires
    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
  }
};
</script>