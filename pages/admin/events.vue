<template>
  <div class="admin-portal">
    <AdminSidebar />
    <div class="main">
      <AdminHeader />
      <div class="intro">
        <div class="intro-header">
          <h1>{{ $t('pages.admin.events.title') }}</h1>
          <button @click="showCreateModal = true" class="btn btn-primary">
            <font-awesome-icon icon="plus" /> {{ $t('pages.admin.events.newButton') }}
          </button>
        </div>
        <p>{{ $t('pages.admin.events.subtitle') }}</p>
      </div>

      <div class="search-bar">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('pages.admin.events.searchPlaceholder')"
              class="search-input"
          >
        </div>
      </div>

      <!-- Modal de création -->
      <div v-if="showCreateModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ $t('pages.admin.events.modal.title') }}</h2>
            <button class="close-btn" @click="showCreateModal = false">×</button>
          </div>
          <form @submit.prevent="createEvent" class="business-form">
            <div class="form-group">
              <label for="name">{{ $t('pages.admin.events.form.titleLabel') }}</label>
              <input
                  type="text"
                  id="name"
                  v-model="newEvent.name"
                  required
                  class="form-control"
                  placeholder="Nom de l'événement"
              >
            </div>
            <div class="form-group">
              <label for="description">{{ $t('pages.admin.events.form.descriptionLabel') }}</label>
              <textarea
                  id="description"
                  v-model="newEvent.description"
                  required
                  class="form-control"
                  rows="4"
                  placeholder="Description détaillée de l'événement"
              ></textarea>
            </div>
            <div class="form-row">
              <div class="form-group half">
                <label for="date">{{ $t('pages.admin.events.form.dateLabel') }}</label>
                <input
                    type="date"
                    id="date"
                    v-model="newEvent.date"
                    required
                    class="form-control"
                >
              </div>
              <div class="form-group half">
                <label for="time">{{ $t('pages.admin.events.form.timeLabel') }}</label>
                <input
                    type="time"
                    id="time"
                    v-model="newEvent.time"
                    required
                    class="form-control"
                >
              </div>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="newEvent.is_featured">
                {{ $t('pages.admin.events.form.featuredLabel') }}
              </label>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCreateModal = false">
                {{ $t('pages.admin.events.buttons.cancel') }}
              </button>
              <button type="submit" class="btn btn-primary">
                <font-awesome-icon icon="plus" /> {{ $t('pages.admin.events.buttons.create') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Liste des événements -->
      <div class="event-list">
        <div v-if="filteredEvents.length === 0" class="no-events">
          {{ $t('pages.admin.events.noResults') }}
        </div>
        <ul v-else>
          <li v-for="(item, index) in filteredEvents"
              :key="index"
              class="event-item"
              @click="viewEventDetails(item.id)">
            <div class="event-header">
              <strong>{{ item.name }}</strong>
              <span v-if="item.is_featured" class="featured-badge">{{ $t('pages.admin.events.featured') }}</span>
            </div>
            <div class="event-content">{{ item.description }}</div>
            <div class="event-footer">
              <div class="event-info">
                <span><i class="fas fa-calendar"></i> {{ formatDate(item.event_date) }}</span>
                <span><i class="fas fa-users"></i> {{ item.participants_count || 0 }}</span>
              </div>
              <div class="view-details">
                {{ $t('pages.admin.events.viewDetails') }} <i class="fas fa-chevron-right"></i>
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
    name: 'AdminEvents',
    data() {
        return {
            events: [],
            businesses: [],
            searchQuery: '',
            showCreateModal: false,
            newEvent: {
                name: '',
                description: '',
                event_date: '',
                business_id: '',
                is_reservable: false
            },
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    computed: {
        filteredEvents() {
            if (!this.searchQuery) return this.events;

            const query = this.searchQuery.toLowerCase();
            return this.events.filter(event =>
                event.name.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query)
            );
        }
    },
    async mounted() {
        await this.fetchEvents()
        await this.fetchBusinesses()
    },
    methods: {
        async fetchEvents() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${this.API_URL}/events/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                this.events = response.data || []
            } catch (error) {
                console.error('Erreur lors de la récupération des événements:', error)
            }
        },
        async fetchBusinesses() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${this.API_URL}/business/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                this.businesses = response.data || []
            } catch (error) {
                console.error('Erreur lors de la récupération des commerces:', error)
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        async createEvent() {
            try {
                const token = localStorage.getItem('token')
                await axios.post(
                    `${this.API_URL}/events/`,
                    this.newEvent,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                this.newEvent = {
                    name: '',
                    description: '',
                    event_date: '',
                    business_id: '',
                    is_reservable: false
                }

                this.showCreateModal = false
                await this.fetchEvents()

            } catch (error) {
                console.error('Erreur lors de la création de l\'événement:', error)
            }
        }
    }
}
</script>