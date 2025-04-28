<template>
    <Header />
    <section class="hero">
        <div class="hero-content">
            <h1>{{ $t('hero.title') }}</h1>
            <p>{{ $t('hero.subtitle') }}</p>
        </div>
    </section>

        <div class="featured-container" v-if="featuredMerchant">
            <div class="featured-image">
                <div class="image-frame">
                    <img :src="featuredMerchant.image" :alt="featuredMerchant.name" />
                </div>
            </div>
            <div class="featured-content">
                <div class="premium-badge">
                    <span>{{ $t('featured.badge') }}</span>
                </div>
                <h2>{{ featuredMerchant.name }}</h2>
                <p class="featured-address">{{ featuredMerchant.address }}</p>
                <p class="featured-description">{{ featuredMerchant.description }}</p>
                <div class="featured-cta">
                    <button class="btn-discover">{{ $t('featured.cta') }}</button>
                </div>
            </div>
        </div>

    <div class="merchants-page">
        <h2>{{ $t('section.title') }}</h2>
        <div class="merchants-container">
            <div v-for="merchant in merchants" :key="merchant.id" class="merchant-card">
                <img :src="merchant.image" :alt="merchant.name" />
                <h3>{{ merchant.name }}</h3>
                <p class="address">{{ merchant.address }}</p>
                <p class="description">{{ merchant.description }}</p>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script>
import Header from '../components/views/Header.vue';
import Footer from '../components/views/Footer.vue';
import defaultImage from '/shop-logo.png';
import westFieldImage from '/westfield-img.jpg';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            merchants: [
                {
                    id: 1,
                    name: this.$t('merchants.boulangerie.name'),
                    address: this.$t('merchants.boulangerie.address'),
                    description: this.$t('merchants.boulangerie.description'),
                    image: defaultImage
                },
                {
                    id: 2,
                    name: this.$t('merchants.librairie.name'),
                    address: this.$t('merchants.librairie.address'),
                    description: this.$t('merchants.librairie.description'),
                    image: defaultImage
                },
                {
                    id: 3,
                    name: this.$t('merchants.cafe.name'),
                    address: this.$t('merchants.cafe.address'),
                    description: this.$t('merchants.cafe.description'),
                    image: defaultImage
                }
            ],
            featuredMerchant: {
                id: 999,
                name: this.$t('merchants.westfield.name'),
                address: this.$t('merchants.westfield.address'),
                description: this.$t('merchants.westfield.description'),
                image: westFieldImage
            }
        };
    },
    // Pour s'assurer que les traductions sont réactives lors du changement de langue
    methods: {
        updateTranslations() {
            this.merchants = [
                {
                    id: 1,
                    name: this.$t('merchants.boulangerie.name'),
                    address: this.$t('merchants.boulangerie.address'),
                    description: this.$t('merchants.boulangerie.description'),
                    image: defaultImage
                },
                {
                    id: 2,
                    name: this.$t('merchants.librairie.name'),
                    address: this.$t('merchants.librairie.address'),
                    description: this.$t('merchants.librairie.description'),
                    image: defaultImage
                },
                {
                    id: 3,
                    name: this.$t('merchants.cafe.name'),
                    address: this.$t('merchants.cafe.address'),
                    description: this.$t('merchants.cafe.description'),
                    image: defaultImage
                }
            ];
            
            this.featuredMerchant = {
                id: 999,
                name: this.$t('merchants.westfield.name'),
                address: this.$t('merchants.westfield.address'),
                description: this.$t('merchants.westfield.description'),
                image: westFieldImage
            };
        }
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