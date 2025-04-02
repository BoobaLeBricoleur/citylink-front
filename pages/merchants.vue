<script>
import Header from '../components/views/Header.vue';
import Footer from '../components/views/Footer.vue';
import defaultImage from '/shop-logo.png';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            merchants: [
                { id: 1, name: "Boulangerie du Vieux Lyon", address: "12 Rue Saint-Jean, Lyon", description: "Une boulangerie artisanale avec des produits frais chaque jour.", image: defaultImage },
                { id: 2, name: "Librairie Lumière", address: "5 Place Bellecour, Lyon", description: "Un endroit chaleureux pour les amateurs de lecture.", image: defaultImage },
                { id: 3, name: "Café des Artistes", address: "25 Quai Saint-Vincent, Lyon", description: "Un café cosy avec une ambiance artistique et locale.", image: defaultImage }
            ]
        };
    }
};
</script>

<template>
    <Header />
    <div class="merchants-page">
        <h2>Découvrez les commerçants de votre ville</h2>
        <div class="merchants-container">
            <div v-for="merchant in merchants" :key="merchant.id" class="merchant-card">
                <img :src="merchant.image" alt="Merchant Image">
                <h3>{{ merchant.name }}</h3>
                <p class="address">{{ merchant.address }}</p>
                <p class="description">{{ merchant.description }}</p>
            </div>
        </div>
    </div>
    <Footer />
</template>

<style lang="scss">
.merchants-page {
    text-align: center;
    background-color: var(--cl-normal);
    padding: 50px;
    min-height: 100vh;
}

h2 {
    color: var(--cl-light);
    font-size: 2.5rem;
    margin-bottom: 30px;
}

.merchants-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
}

.merchant-card {
    background-color: var(--cl-dark-active);
    padding: 20px;
    border-radius: 15px;
    width: 300px;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-10px);
        box-shadow: rgba(0, 0, 0, 0.5) 0px 10px 20px;
    }
}

.merchant-card img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 15px;
}

h3 {
    color: var(--cl-light);
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.address {
    color: var(--cl-light);
    font-weight: bold;
}

.description {
    color: white;
    font-size: 1rem;
    margin-top: 10px;
}

@media (max-width: 700px) {
    .merchants-container {
        flex-direction: column;
        align-items: center;
    }
}
</style>
