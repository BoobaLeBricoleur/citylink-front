<template>
    <div class="events-page">
        <Header />

        <section class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1>{{ $t('hero.title') }}</h1>
                <p>{{ $t('hero.subtitle') }}</p>
                <button class="cta-button" @click="scrollToEvents">{{ $t('hero.button') }}</button>
            </div>
        </section>

        <section class="filters-section">
            <div class="filters">
                <div class="filter-item">
                    <label for="search">{{ $t('filters.search.label') }}</label>
                    <input id="search" type="text" v-model="searchQuery" :placeholder="$t('filters.search.placeholder')"
                        :aria-label="$t('filters.search.placeholder')" />
                </div>
                <div class="filter-item">
                    <label for="category">{{ $t('filters.category.label') }}</label>
                    <select id="category" v-model="selectedCategory" :aria-label="$t('filters.category.label')">
                        <option value="">{{ $t('filters.category.all') }}</option>
                        <option v-for="category in categories" :key="category.value" :value="category.value">
                            {{ category.label }}
                        </option>
                    </select>
                </div>
            </div>
        </section>

        <section class="events-list-section">
            <h2>{{ $t('eventsList.title') }}</h2>
            <ul class="events-list">
                <li v-for="event in filteredEvents" :key="event.id" class="event-item" tabindex="0"
                    :aria-label="$t('eventsList.details')">
                    <div class="event-content">
                        <h3>{{ event.title }}</h3>
                        <p class="event-date">{{ event.date }} - {{ event.location }}</p>
                        <p class="event-description">{{ event.description }}</p>
                    </div>
                    <button @click="participate(event.id)" :aria-label="$t('eventsList.participate')">
                        {{ $t('eventsList.participate') }}
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
            categories: [
                { value: "Culture", label: this.$t('categories.culture') },
                { value: "Sport", label: this.$t('categories.sport') },
                { value: "Musique", label: this.$t('categories.music') },
                { value: "Conférence", label: this.$t('categories.conference') }
            ],
            events: [
                {
                    id: 1,
                    title: this.$t('events.jazzConcert.title'),
                    date: "2025-04-10",
                    location: this.$t('events.jazzConcert.location'),
                    description: this.$t('events.jazzConcert.description'),
                    category: "Musique",
                },
                {
                    id: 2,
                    title: this.$t('events.marathon.title'),
                    date: "2025-04-15",
                    location: this.$t('events.marathon.location'),
                    description: this.$t('events.marathon.description'),
                    category: "Sport",
                },
                {
                    id: 3,
                    title: this.$t('events.jazzConcert.title'),
                    date: "2025-04-10",
                    location: this.$t('events.jazzConcert.location'),
                    description: this.$t('events.jazzConcert.description'),
                    category: "Musique",
                },
                {
                    id: 4,
                    title: this.$t('events.marathon.title'),
                    date: "2025-04-15",
                    location: this.$t('events.marathon.location'),
                    description: this.$t('events.marathon.description'),
                    category: "Sport",
                },
                {
                    id: 5,
                    title: this.$t('events.jazzConcert.title'),
                    date: "2025-04-10",
                    location: this.$t('events.jazzConcert.location'),
                    description: this.$t('events.jazzConcert.description'),
                    category: "Musique",
                },
                {
                    id: 6,
                    title: this.$t('events.marathon.title'),
                    date: "2025-04-15",
                    location: this.$t('events.marathon.location'),
                    description: this.$t('events.marathon.description'),
                    category: "Sport",
                },
            ],
        };
    },
    methods: {
        updateTranslations() {
            this.categories = [
                { value: "Culture", label: this.$t('categories.culture') },
                { value: "Sport", label: this.$t('categories.sport') },
                { value: "Musique", label: this.$t('categories.music') },
                { value: "Conférence", label: this.$t('categories.conference') }
            ];
            
            this.events = [
                {
                    id: 1,
                    title: this.$t('events.jazzConcert.title'),
                    date: "2025-04-10",
                    location: this.$t('events.jazzConcert.location'),
                    description: this.$t('events.jazzConcert.description'),
                    category: "Musique",
                },
                {
                    id: 2,
                    title: this.$t('events.marathon.title'),
                    date: "2025-04-15",
                    location: this.$t('events.marathon.location'),
                    description: this.$t('events.marathon.description'),
                    category: "Sport",
                },
                {
                    id: 3,
                    title: this.$t('events.jazzConcert.title'),
                    date: "2025-04-10",
                    location: this.$t('events.jazzConcert.location'),
                    description: this.$t('events.jazzConcert.description'),
                    category: "Musique",
                },
                {
                    id: 4,
                    title: this.$t('events.marathon.title'),
                    date: "2025-04-15",
                    location: this.$t('events.marathon.location'),
                    description: this.$t('events.marathon.description'),
                    category: "Sport",
                },
                {
                    id: 5,
                    title: this.$t('events.jazzConcert.title'),
                    date: "2025-04-10",
                    location: this.$t('events.jazzConcert.location'),
                    description: this.$t('events.jazzConcert.description'),
                    category: "Musique",
                },
                {
                    id: 6,
                    title: this.$t('events.marathon.title'),
                    date: "2025-04-15",
                    location: this.$t('events.marathon.location'),
                    description: this.$t('events.marathon.description'),
                    category: "Sport",
                },
            ];
        },
        participate(eventId) {
            const message = this.$t('alerts.participation').replace('{id}', eventId);
            alert(message);
        },
        scrollToEvents() {
            const eventsSection = document.querySelector(".events-list-section");
            if (eventsSection) {
                eventsSection.scrollIntoView({ behavior: "smooth" });
            }
        },
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
    watch: {
        '$i18n.locale'() {
            this.updateTranslations();
        }
    },
    mounted() {
        this.updateTranslations();
    }
};
</script>