<template>
    <div class="emergency-page">
        <Header />
        
        <div class="emergency-container">
            
            <!-- Numéros d'urgence -->
            <div class="emergency-numbers">
                <div class="emergency-card">
                    <font-awesome-icon :icon="['fas', 'ambulance']" />
                    <h3>SAMU</h3>
                    <div class="number">15</div>
                    <p>Service d'Aide Médicale d'Urgence</p>
                </div>
                <div class="emergency-card">
                <font-awesome-icon :icon="['fas', 'shield-alt']" />
                <h3>Police</h3>
                <div class="number">17</div>
                <p>Police Nationale / Gendarmerie</p>
                </div>

                <div class="emergency-card">
                <font-awesome-icon :icon="['fas', 'fire-extinguisher']" />
                <h3>Pompiers</h3>
                <div class="number">18</div>
                <p>Sapeurs-Pompiers</p>
                </div>

                <div class="emergency-card">
                <font-awesome-icon :icon="['fas', 'phone']" />
                <h3>Europe</h3>
                <div class="number">112</div>
                <p>Numéro d'Urgence Européen</p>
                </div>
            </div>

            <!-- Formulaire de signalement -->
            <div class="report-section">
                <h2>Signaler une Urgence</h2>
                <form @submit.prevent="submitEmergency" class="emergency-form">
                    <div class="form-group">
                        <label for="emergency_type">Type d'urgence*</label>
                        <select 
                            id="emergency_type" 
                            v-model="newEmergency.emergency_type" 
                            required
                            class="form-control"
                        >
                            <option value="">Sélectionner le type d'urgence</option>
                            <option value="medical">Médicale</option>
                            <option value="security">Sécurité</option>
                            <option value="fire">Incendie</option>
                            <option value="other">Autre</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="description">Description de l'urgence*</label>
                        <textarea 
                            id="description"
                            v-model="newEmergency.description"
                            required
                            class="form-control"
                            rows="4"
                            placeholder="Décrivez la situation d'urgence en détail..."
                        ></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-emergency">
                            Signaler l'urgence
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <Footer />
    </div>
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
    data() {
        return {
            newEmergency: {
                emergency_type: '',
                description: ''
            },
            API_URL: process.env.API_URL || 'http://localhost:3000/api'
        }
    },
    methods: {
        async submitEmergency() {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.post(
                    `${this.API_URL}/emergency/`,
                    this.newEmergency,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                
                // Réinitialiser le formulaire
                this.newEmergency = {
                    emergency_type: '',
                    description: ''
                }
                
                alert('Votre signalement d\'urgence a été envoyé avec succès')
            } catch (error) {
                console.error('Erreur lors de l\'envoi du signalement:', error)
                alert('Une erreur est survenue lors de l\'envoi du signalement')
            }
        }
    }
}
</script>