<template>
    <div class="announcements-page">
        <Header />

        <section class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1>{{ $t('hero.title') }}</h1>
                <p>{{ $t('hero.subtitle') }}</p>
            </div>
        </section>

        <!-- Nouvelle section pour l'annonce mise en valeur -->
        <section v-if="featuredAnnouncement" class="featured-announcement-section">
            <div class="featured-announcement">
                <div class="featured-badge">{{ $t('featured.badge') }}</div>
                <h2>{{ featuredAnnouncement.title }}</h2>
                <p class="featured-date">{{ featuredAnnouncement.date }}</p>
                <p class="featured-description">{{ featuredAnnouncement.description }}</p>
            </div>
        </section>
        
        <section class="announcements-list-section">
            <h2>{{ $t('recent.title') }}</h2>
            <ul class="announcements-list">
                <li v-for="announcement in announcements" :key="announcement.id" class="announcement-item"
                    :class="{ 'is-featured': announcement === featuredAnnouncement }">
                    <div class="announcement-content">
                        <h3>{{ announcement.title }}</h3>
                        <p class="announcement-date">{{ announcement.date }}</p>
                        <p class="announcement-description">{{ announcement.description }}</p>
                        <button @click="setFeaturedAnnouncement(announcement)"
                            :disabled="announcement === featuredAnnouncement" class="feature-button">
                            {{ announcement === featuredAnnouncement ? $t('recent.mainButton') : $t('recent.setAsMainButton') }}
                        </button>
                    </div>
                </li>
            </ul>
        </section>

        <section class="add-announcement-section">
            <h2>{{ $t('form.sectionTitle') }}</h2>
            <form @submit.prevent="addAnnouncement" class="announcement-form">
                <div class="form-group">
                    <label for="title">{{ $t('form.titleLabel') }}</label>
                    <input id="title" v-model="newAnnouncement.title" type="text" 
                           :placeholder="$t('form.titlePlaceholder')" required />
                </div>
                <div class="form-group">
                    <label for="description">{{ $t('form.descriptionLabel') }}</label>
                    <textarea id="description" v-model="newAnnouncement.description"
                        :placeholder="$t('form.descriptionPlaceholder')" required></textarea>
                </div>
                <button type="submit" class="cta-button">{{ $t('form.submitButton') }}</button>
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
                    title: this.$t('demoData.roadwork.title'),
                    date: "2025-04-01",
                    description: this.$t('demoData.roadwork.description'),
                },
                {
                    id: 2,
                    title: this.$t('demoData.playground.title'),
                    date: "2025-03-28",
                    description: this.$t('demoData.playground.description'),
                },
            ],
            newAnnouncement: {
                title: "",
                description: "",
            },
            featuredAnnouncement: null,
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
            alert(this.$t('form.successMessage'));
        },
        setFeaturedAnnouncement(announcement) {
            this.featuredAnnouncement = announcement;
        }
    },
};
</script>