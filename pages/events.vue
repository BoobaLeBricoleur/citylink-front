<template>
  <div class="events-page">
    <Header />
    <section class="hero">
      <div class="hero-content">
        <h1>{{ $t('pages.events.eventsList.title') }}</h1>
        <p>{{ $t('pages.events.hero.subtitle') }}</p>
      </div>
    </section>

    <div class="events-container">
      <div class="events-grid">
        <div v-for="event in events"
             :key="event.id"
             class="event-card">
          <div class="event-image">
            <img :src="event.image || '/default-event.jpg'" :alt="event.name">
          </div>
          <div class="event-info">
            <h3>{{ event.name }}</h3>
            <p class="event-date">{{ formatDate(event.event_date) }}</p>
            <p class="event-description">{{ event.description }}</p>
            <p class="event-location">{{ event.business_name }}</p>

            <div class="event-actions">
              <button
                  v-if="event.is_reservable && isLoggedIn"
                  @click="toggleReservation(event)"
                  :class="['btn-reserve', {
                                    'reserved': isEventReserved(event.id)
                                }]"
              >
                {{ isEventReserved(event.id) ? $t('pages.events.actions.cancel') : $t('pages.events.actions.reserve') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Header from '../components/views/Header.vue'
import Footer from '../components/views/Footer.vue'
import axios from 'axios'

export default {
    components: {
        Header,
        Footer
    },
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('token');
        }
    },
    data() {
        return {
            events: [],
            userRegistrations: [],
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    methods: {
        async fetchEvents() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${this.API_URL}/events/`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                })
                this.events = response.data
            } catch (error) {
                console.error('Erreur lors de la récupération des événements:', error)
            }
        },
        async fetchUserRegistrations() {
            if (!this.isLoggedIn) {
                this.userRegistrations = [];
                return;
            }
            
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${this.API_URL}/event-registrations/user`, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Réservations reçues:', response.data); // Debug
                this.userRegistrations = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations:', error);
                this.userRegistrations = [];
            }
        },
        async toggleReservation(event) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token manquant');
                    return;
                }

                const isRegistered = this.isEventReserved(event.id);
                console.log('État de la réservation:', isRegistered); // Debug

                if (isRegistered) {
                    const registration = this.userRegistrations.find(
                        reg => reg.event_id === event.id
                    );
                    
                    if (!registration) {
                        console.error('Réservation non trouvée');
                        return;
                    }

                    await axios.delete(
                        `${this.API_URL}/event-registrations/${event.id}`,
                        {
                            headers: { 
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                } else {
                    await axios.post(
                        `${this.API_URL}/event-registrations`,
                        {
                            event_id: event.id,
                            reserved: true
                        },
                        { 
                            headers: { 
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                }
                
                // Rafraîchir les réservations
                await this.fetchUserRegistrations();
                
            } catch (error) {
                console.error('Erreur détaillée:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
            }
        },
        isEventReserved(eventId) {
            return this.userRegistrations.some(reg => reg.event_id === eventId);
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(this.$i18n.locale, options);
        }
    },
    async mounted() {
        await Promise.all([
            this.fetchEvents(),
            this.fetchUserRegistrations()
        ])
    }
}
</script>
