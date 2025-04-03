<template>
    <div class="events-page">
        <Header />

        <section class="hero-section">
            <div class="hero-content">
                <h1>Découvrez les Événements de Votre Ville</h1>
                <p>Plongez au cœur de la vie locale et participez aux activités qui animent votre communauté.</p>
                <button class="cta-button" @click="scrollToEvents">Voir les événements</button>
            </div>
            <div class="hero-overlay"></div>
        </section>

        <section class="filters-section">
            <div class="filters">
                <div class="filter-item">
                    <label for="search">Rechercher :</label>
                    <input id="search" type="text" v-model="searchQuery" placeholder="Recherchez un événement..."
                        aria-label="Rechercher un événement" />
                </div>
                <div class="filter-item">
                    <label for="category">Catégorie :</label>
                    <select id="category" v-model="selectedCategory" aria-label="Filtrer par catégorie">
                        <option value="">Toutes</option>
                        <option v-for="category in categories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>
            </div>
        </section>

        <section class="events-list-section">
            <h2>Événements à Venir</h2>
            <ul class="events-list">
                <li v-for="event in filteredEvents" :key="event.id" class="event-item" tabindex="0"
                    aria-label="Détails de l'événement">
                    <div class="event-content">
                        <h3>{{ event.title }}</h3>
                        <p class="event-date">{{ event.date }} - {{ event.location }}</p>
                        <p class="event-description">{{ event.description }}</p>
                    </div>
                    <button @click="participate(event.id)" aria-label="Participer à cet événement">
                        Participer
                    </button>
                </li>
            </ul>
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
            searchQuery: "",
            selectedCategory: "",
            categories: ["Culture", "Sport", "Musique", "Conférence"],
            events: [
                {
                    id: 1,
                    title: "Concert de Jazz",
                    date: "2025-04-10",
                    location: "Salle des Fêtes",
                    description: "Un concert de jazz avec des artistes locaux.",
                    category: "Musique",
                },
                {
                    id: 2,
                    title: "Marathon de la Ville",
                    date: "2025-04-15",
                    location: "Centre-ville",
                    description: "Participez au marathon annuel de la ville.",
                    category: "Sport",
                },{
                    id: 1,
                    title: "Concert de Jazz",
                    date: "2025-04-10",
                    location: "Salle des Fêtes",
                    description: "Un concert de jazz avec des artistes locaux.",
                    category: "Musique",
                },
                {
                    id: 2,
                    title: "Marathon de la Ville",
                    date: "2025-04-15",
                    location: "Centre-ville",
                    description: "Participez au marathon annuel de la ville.",
                    category: "Sport",
                },{
                    id: 1,
                    title: "Concert de Jazz",
                    date: "2025-04-10",
                    location: "Salle des Fêtes",
                    description: "Un concert de jazz avec des artistes locaux.",
                    category: "Musique",
                },
                {
                    id: 2,
                    title: "Marathon de la Ville",
                    date: "2025-04-15",
                    location: "Centre-ville",
                    description: "Participez au marathon annuel de la ville.",
                    category: "Sport",
                },
            ],
        };
    },
    computed: {
        filteredEvents() {
            return this.events.filter((event) => {
                const matchesSearch = event.title
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase());
                const matchesCategory =
                    !this.selectedCategory || event.category === this.selectedCategory;
                return matchesSearch && matchesCategory;
            });
        },
    },
    methods: {
        participate(eventId) {
            alert(`Vous avez choisi de participer à l'événement ${eventId}!`);
        },
        scrollToEvents() {
            const eventsSection = document.querySelector(".events-list-section");
            if (eventsSection) {
                eventsSection.scrollIntoView({ behavior: "smooth" });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/base.css";

.events-page {
    font-family: Arial, sans-serif;
    background-color: var(--cl-normal);

    .hero-section {
        position: relative;
        background-image: url('/bg-lyon-login.jpg');
        height: 85vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: white;
        overflow: hidden;

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
                font-size: 4rem;
                font-weight: bold;
                margin-bottom: 20px;
                text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
            }

            p {
                font-size: 1.5rem;
                margin-bottom: 30px;
                text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
            }

            .cta-button {
                background: linear-gradient(90deg, rgba(255, 226, 89, 1) 0%, rgba(255, 167, 81, 1) 100%);
                color: white;
                padding: 15px 30px;
                font-size: 1.2rem;
                font-weight: bold;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: transform 0.3s ease, background 0.3s ease;

                &:hover {
                    transform: scale(1.1);
                }
            }
        }

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, var(--cl-normal) 100%);
            pointer-events: none;
        }
    }

    .filters-section {
        padding: 30px;
        display: flex;
        justify-content: center;

        .filters {
            display: flex;
            gap: 20px;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;

            .filter-item {
                display: flex;
                flex-direction: column;

                label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: var(--cl-dark);
                }

                input,
                select {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 1rem;
                    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

                    &:focus {
                        border-color: #007bff;
                        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
                        outline: none;
                    }
                }
            }
        }
    }

    .events-list-section {
        padding: 20px;

        h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        .events-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(2, minmax(300px, 1fr));
            gap: 20px;

            .event-item {
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 20px;
                background-color: #f9f9f9;
                box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
                transition: transform 0.2s ease-in-out;

                &:hover {
                    transform: scale(1.05);
                }

                .event-content {
                    h3 {
                        color: var(--cl-normal);
                        margin: 0 0 10px;
                        font-size: 1.5rem;
                    }

                    .event-date {
                        font-weight: bold;
                        margin-bottom: 10px;
                    }

                    .event-description {
                        margin-bottom: 20px;
                    }
                }

                button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.2s ease-in-out;

                    &:hover {
                        background-color: #0056b3;
                    }
                }
            }
        }
    }

    .cta-section {
        background-color: var(--cl-dark-active);
        color: white;
        text-align: center;
        padding: 50px 20px;

        .cta-container {
            max-width: 600px;
            margin: 0 auto;

            .cta-button {
                background: linear-gradient(90deg, rgba(255, 226, 89, 1) 0%, rgba(255, 167, 81, 1) 100%);
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.2s ease-in-out;

                &:hover {
                    transform: scale(1.1);
                }
            }
        }
    }
}
</style>