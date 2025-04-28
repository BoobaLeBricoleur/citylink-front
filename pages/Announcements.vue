<template>
    <div class="announcements-page">
        <Header />

        <section class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1>Dernières Annonces de la Ville</h1>
                <p>Restez informé des actualités et des annonces importantes de votre communauté.</p>
            </div>
        </section>

        <!-- Nouvelle section pour l'annonce mise en valeur -->
        <section v-if="featuredAnnouncement" class="featured-announcement-section">
            <div class="featured-announcement">
                <div class="featured-badge">Annonce à la une</div>
                <h2>{{ featuredAnnouncement.title }}</h2>
                <p class="featured-date">{{ featuredAnnouncement.date }}</p>
                <p class="featured-description">{{ featuredAnnouncement.description }}</p>
            </div>
        </section>

        <section class="announcements-list-section">
            <h2>Annonces Récentes</h2>
            <ul class="announcements-list">
                <li v-for="announcement in announcements" :key="announcement.id" class="announcement-item" 
                    :class="{ 'is-featured': announcement === featuredAnnouncement }">
                    <div class="announcement-content">
                        <h3>{{ announcement.title }}</h3>
                        <p class="announcement-date">{{ announcement.date }}</p>
                        <p class="announcement-description">{{ announcement.description }}</p>
                        <button @click="setFeaturedAnnouncement(announcement)" 
                                :disabled="announcement === featuredAnnouncement"
                                class="feature-button">
                            {{ announcement === featuredAnnouncement ? 'Annonce principale' : 'Définir comme principale' }}
                        </button>
                    </div>
                </li>
            </ul>
        </section>

        <section class="add-announcement-section">
            <h2>Ajouter une Nouvelle Annonce</h2>
            <form @submit.prevent="addAnnouncement" class="announcement-form">
                <div class="form-group">
                    <label for="title">Titre :</label>
                    <input id="title" v-model="newAnnouncement.title" type="text" placeholder="Titre de l'annonce"
                        required />
                </div>
                <div class="form-group">
                    <label for="description">Description :</label>
                    <textarea id="description" v-model="newAnnouncement.description"
                        placeholder="Description de l'annonce" required></textarea>
                </div>
                <button type="submit" class="cta-button">Publier</button>
            </form>
        </section>

        <Footer />
    </div>
</template>

<script>
import Header from "../components/views/Header.vue";
import Footer from "../components/views/Footer.vue";

export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            announcements: [
                {
                    id: 1,
                    title: "Travaux sur la Route Principale",
                    date: "2025-04-01",
                    description: "Des travaux auront lieu sur la route principale du 5 au 10 avril.",
                },
                {
                    id: 2,
                    title: "Nouvelle Aire de Jeux",
                    date: "2025-03-28",
                    description: "Une nouvelle aire de jeux a été inaugurée au parc central.",
                },
            ],
            newAnnouncement: {
                title: "",
                description: "",
            },
            featuredAnnouncement: null, // Ajout de la propriété manquante
        };
    },
    methods: {
        addAnnouncement() {
            const newId = this.announcements.length + 1;
            const newDate = new Date().toISOString().split("T")[0];
            this.announcements.unshift({
                id: newId,
                title: this.newAnnouncement.title,
                date: newDate,
                description: this.newAnnouncement.description,
                isFeatured: false,
            });
            this.newAnnouncement.title = "";
            this.newAnnouncement.description = "";
            alert("Annonce ajoutée avec succès !");
        },
        // Ajout de la méthode manquante
        setFeaturedAnnouncement(announcement) {
            this.featuredAnnouncement = announcement;
        }
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/base.css";

.announcements-page {
    background-color: var(--cl-normal);

    .hero-section {
        position: relative;
        background-image: url('/bg-lyon-login.jpg');
        height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
        }

        .hero-content {
            position: relative;
            z-index: 1;
            max-width: 800px;
            padding: 20px;

            h1 {
                font-size: 3rem;
                font-weight: bold;
                margin-bottom: 10px;
            }

            p {
                font-size: 1.2rem;
            }
        }
    }

    // Ajout des styles pour l'annonce mise en valeur
    .featured-announcement-section {
        padding: 30px 20px;
        color: white;
        
        .featured-announcement {
            max-width: 1000px;
            margin: 0 auto;
            padding: 30px;
            border-radius: 15px;
            background-color: var(--cl-dark-active);
            position: relative;
            
            .featured-badge {
                position: absolute;
                top: -15px;
                left: 30px;
                background-color: #ffcc00;
                color: #333;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 0.9rem;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
            
            h2 {
                font-size: 2.5rem;
                margin-bottom: 15px;
                margin-top: 10px;
            }
            
            .featured-date {
                font-weight: bold;
                margin-bottom: 15px;
                font-size: 1.1rem;
            }
            
            .featured-description {
                font-size: 1.2rem;
                line-height: 1.6;
            }
        }
    }

    .announcements-list-section {
        padding: 20px;

        h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        .announcements-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(2, minmax(300px, 1fr));
            gap: 20px;

            .announcement-item {
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 20px;
                background-color: #f9f9f9;
                box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;

                &.is-featured {
                    border: 2px solid var(--cl-bold);
                    background-color: var(--cl-light-active);
                }

                .announcement-content {
                    h3 {
                        color: var(--cl-normal);
                        margin: 0 0 10px;
                        font-size: 1.5rem;
                    }

                    .announcement-date {
                        font-weight: bold;
                        margin-bottom: 10px;
                    }

                    .announcement-description {
                        margin-bottom: 10px;
                    }

                    .feature-button {
                        background-color: var(--cl-normal);
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 10px;
                        font-size: 0.9rem;
                        
                        &:hover:not(:disabled) {
                            background-color: #0056b3;
                        }
                        
                        &:disabled {
                            background-color: #28a745;
                            cursor: default;
                        }
                    }
                }
            }
        }
    }

    .add-announcement-section {
        padding: 20px;
        background-color: #f1f1f1;
        border-radius: 10px;
        margin: 20px;

        h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        .announcement-form {
            display: flex;
            flex-direction: column;
            gap: 15px;

            .form-group {
                display: flex;
                flex-direction: column;

                label {
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                input,
                textarea {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 1rem;
                }
            }

            .cta-button {
                align-self: center;
                background-color: #007bff;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;

                &:hover {
                    background-color: #0056b3;
                }
            }
        }
    }
}
</style>