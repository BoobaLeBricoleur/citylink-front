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