<template>
    <div class="events-page">
        <Header />
        <section class="hero">
            <div class="hero-content">
                <h1>Événements à venir</h1>
                <p>Découvrez les événements de votre ville</p>
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
                                {{ isEventReserved(event.id) ? 'Annuler' : 'Réserver' }}
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
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${this.API_URL}/event-registrations/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                this.userRegistrations = response.data
            } catch (error) {
                console.error('Erreur lors de la récupération des réservations:', error)
            }
        },
        async toggleReservation(event) {
            try {
                const token = localStorage.getItem('token')
                const isRegistered = this.isEventReserved(event.id)

                if (isRegistered) {
                    // Trouver l'ID de la réservation
                    const registration = this.userRegistrations.find(
                        reg => reg.event_id === event.id && reg.reserved
                    )
                    
                    // Supprimer la réservation
                    await axios.delete(
                        `${this.API_URL}/event-registrations/${event.id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    )
                } else {
                    // Créer une nouvelle réservation
                    await axios.post(
                        `${this.API_URL}/event-registrations`,
                        { 
                            event_id: event.id,
                            reserved: true
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                }
                
                // Rafraîchir les réservations
                await this.fetchUserRegistrations()
                
                // Afficher une notification
                const message = isRegistered 
                    ? 'Réservation annulée avec succès'
                    : 'Événement réservé avec succès'
            } catch (error) {
                console.error('Erreur:', error)
            }
        },
        isEventReserved(eventId) {
            return this.userRegistrations.some(
                reg => reg.event_id === eventId && reg.reserved
            )
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
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
