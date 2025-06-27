<template>
  <div class="admin-portal">
    <AdminSidebar />
    <div class="main">
      <AdminHeader />
      <div class="intro">
        <div class="intro-header">
          <h1>{{ $t('pages.admin.business.title') }}</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            <Icon name="heroicons:plus" /> {{ $t('pages.admin.business.newButton') }}
          </button>
        </div>
        <p>{{ $t('pages.admin.business.subtitle') }}</p>
      </div>

      <div class="search-bar">
        <div class="search-input-wrapper">
          <Icon name="heroicons:magnifying-glass" class="search-icon" />

          <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('pages.admin.business.searchPlaceholder')"
              class="search-input"
          >
        </div>
      </div>

      <!-- Modal de création -->
      <div v-if="showCreateModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ $t('pages.admin.business.modal.title') }}</h3>
            <button class="close-btn" @click="showCreateModal = false">&times;</button>
          </div>
          <form @submit.prevent="createBusiness" class="business-form">
            <div class="form-group">
              <label for="name">{{ $t('pages.admin.business.form.nameLabel') }}</label>
              <input
                  type="text"
                  id="name"
                  v-model="newBusiness.name"
                  required
                  class="form-control"
                  placeholder="Nom du commerce"
              >
            </div>
            <div class="form-group">
              <label for="description">{{ $t('pages.admin.business.form.descriptionLabel') }}</label>
              <textarea
                  id="description"
                  v-model="newBusiness.description"
                  required
                  class="form-control"
                  rows="4"
                  placeholder="Description détaillée du commerce"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="category_id">{{ $t('pages.admin.business.form.categoryLabel') }}</label>
              <select
                  id="category_id"
                  v-model="newBusiness.category_id"
                  required
                  class="form-control"
              >
                <option value="">Sélectionner une catégorie</option>
                <option v-for="(name, id) in categories"
                        :key="id"
                        :value="Number(id)">
                  {{ name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="user_id">{{ $t('pages.admin.business.form.ownerLabel') }}</label>
              <select
                  id="user_id"
                  v-model="newBusiness.user_id"
                  required
                  class="form-control"
              >
                <option value="">Sélectionner un utilisateur</option>
                <option
                    v-for="user in users"
                    :key="user.id"
                    :value="user.id"
                >
                  {{ user.firstname }} {{ user.lastname }} ({{ user.email }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="address">{{ $t('pages.admin.business.form.addressLabel') }}</label>
              <input
                  type="text"
                  id="address"
                  v-model="newBusiness.address"
                  required
                  class="form-control"
                  placeholder="Adresse complète"
              >
            </div>
            <div class="form-row">
              <div class="form-group half">
                <label for="phone">Téléphone*</label>
                <input
                    type="tel"
                    id="phone"
                    v-model="newBusiness.phone_number"
                    required
                    class="form-control"
                    placeholder="0123456789"
                >
              </div>
              <div class="form-group half">
                <label for="email">Email*</label>
                <input
                    type="email"
                    id="email"
                    v-model="newBusiness.email"
                    required
                    class="form-control"
                    placeholder="email@exemple.com"
                >
              </div>
            </div>
            <div class="form-group">
              <label for="website">{{ $t('pages.admin.business.form.websiteLabel') }}</label>
              <input
                  type="url"
                  id="website"
                  v-model="newBusiness.website_url"
                  class="form-control"
                  placeholder="https://www.exemple.com"
              >
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCreateModal = false">
                {{ $t('pages.admin.business.buttons.cancel') }}
              </button>
              <button type="submit" class="btn btn-primary">
                <Icon name="heroicons:plus" /> {{ $t('pages.admin.business.buttons.create') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Liste des commerces -->
      <div class="business-list">
        <div v-if="filteredBusiness.length === 0" class="no-business">
          {{ $t('pages.admin.business.noResults') }}
        </div>
        <ul v-else>
          <li v-for="(item, index) in filteredBusiness"
              :key="index"
              class="business-item"
              @click="viewBusinessDetails(item.id)">
            <div class="business-header">
              <strong>{{ item.name }}</strong>
              <span class="category-badge">{{ getCategoryName(item.category_id) }}</span>
            </div>
            <div class="business-content">{{ item.description }}</div>
            <div class="business-footer">
              <div class="business-info">
                <div class="business-contact">
                  <span>Adresse : {{ item.address }}</span>
                  <span>Numéro de téléphone : {{ item.phone_number }}</span>
                  <span>E-mail : {{ item.email }}</span>
                </div>
                <div class="business-owner">
                  Géré par: {{ item.firstname }} {{ item.lastname }}
                </div>
              </div>
              <div class="view-details">
                {{ $t('pages.admin.business.viewDetails') }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminHeader from '~/components/admin/AdminHeader.vue'

export default {
    components: { AdminSidebar, AdminHeader },
    name: 'AdminBusiness',
    data() {
        return {
            Business: [],
            categories: [],
            searchQuery: '',
            showCreateModal: false,
            newBusiness: {
                name: '',
                description: '',
                category_id: '',
                address: '',
                phone_number: '',
                email: '',
                website_url: '',
                user_id: ''
            },
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    computed: {
        filteredBusiness() {
            if (!this.searchQuery) return this.Business;
            
            const query = this.searchQuery.toLowerCase();
            return this.Business.filter(business => 
                business.name.toLowerCase().includes(query) ||
                business.description.toLowerCase().includes(query)
            );
        }
    },
    async mounted() {
        await this.fetchBusiness()
        await this.fetchUsers()
        await this.fetchCategories()
    },
    methods: {
        async fetchUsers() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${this.API_URL}/users/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                this.users = response.data || []
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error)
            }
        },
        async fetchBusiness() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${this.API_URL}/business/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                this.Business = response.data || []
            } catch (error) {
                console.error('Erreur lors de la récupération des commerces:', error)
            }
        },
        async fetchCategories() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${this.API_URL}/business/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                // Transformer le tableau en objet pour faciliter l'utilisation
                this.categories = response.data.reduce((acc, cat) => {
                    acc[cat.id] = cat.name
                    return acc
                }, {})
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories:', error)
            }
        },
        getCategoryName(categoryId) {
            return this.categories[categoryId] || 'Autre'
        },
         async createBusiness() {
            try {
                const token = localStorage.getItem('token');
                console.log('Données envoyées:', this.newBusiness); // Log de débogage
                
                const response = await axios.post(
                    `${this.API_URL}/business/`,
                    this.newBusiness,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                console.log('Réponse:', response.data); // Log de débogage
                
                // Réinitialisation du formulaire
                this.newBusiness = {
                    name: '',
                    description: '',
                    category_id: 1,
                    address: '',
                    phone_number: '',
                    email: '',
                    website_url: ''
                };
                
                this.showCreateModal = false;
                await this.fetchBusiness();
                
            } catch (error) {
                console.error('Erreur détaillée:', error.response?.data || error); // Log d'erreur détaillé
                // Vous pouvez ajouter ici une notification d'erreur pour l'utilisateur
            }
        }
    }
}
</script>