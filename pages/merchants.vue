<template>
    <Header />
    <section class="hero">
        <div class="hero-content">
            <h1>Découvrez nos commerçants locaux</h1>
            <p>Faites vivre votre quartier en soutenant les boutiques près de chez vous.</p>
        </div>
    </section>

        <div class="featured-container" v-if="featuredMerchant">
            <div class="featured-image">
                <div class="image-frame">
                    <img :src="featuredMerchant.image" alt="Featured Merchant" />
                </div>
            </div>
            <div class="featured-content">
                <div class="premium-badge">
                    <span>Commerçant de la semaine</span>
                </div>
                <h2>{{ featuredMerchant.name }}</h2>
                <p class="featured-address">{{ featuredMerchant.address }}</p>
                <p class="featured-description">{{ featuredMerchant.description }}</p>
                <div class="featured-cta">
                    <button class="btn-discover">Découvrir</button>
                </div>
            </div>
        </div>

    <div class="merchants-page">
        <h2>Découvrez les commerçants de votre ville</h2>
        <div class="merchants-container">
            <div v-for="merchant in merchants" :key="merchant.id" class="merchant-card">
                <img :src="merchant.image" alt="Merchant Image" />
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
                    name: "Boulangerie du Vieux Lyon",
                    address: "12 Rue Saint-Jean, Lyon",
                    description: "Une boulangerie artisanale avec des produits frais chaque jour.",
                    image: defaultImage
                },
                {
                    id: 2,
                    name: "Librairie Lumière",
                    address: "5 Place Bellecour, Lyon",
                    description: "Un endroit chaleureux pour les amateurs de lecture.",
                    image: defaultImage
                },
                {
                    id: 3,
                    name: "Café des Artistes",
                    address: "25 Quai Saint-Vincent, Lyon",
                    description: "Un café cosy avec une ambiance artistique et locale.",
                    image: defaultImage
                }
            ],
            featuredMerchant: {
                id: 999,
                name: "WestField Lyon Part-Dieu",
                address: "Centre Commercial Part-Dieu, Lyon",
                description: "Le plus grand centre commercial de Lyon avec plus de 260 boutiques.",
                image: westFieldImage
            }
        };
    }
};
</script>

<style lang="scss">
/* --- Section HERO --- */
.hero {
    position: relative;
    width: 100%;
    height: 60vh;
    background-image: linear-gradient(to bottom, #383838, rgba(15, 15, 15, 0.306)), url('/merchants.jpg');
    background-blend-mode: multiply;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.35);
        z-index: 1;
    }

    .hero-content {
        position: relative;
        z-index: 5;
        max-width: 800px;
        padding: 20px;
        color: #fff;

        h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        p {
            font-size: 1.2rem;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
    }

    /* Nouvelle transition en vague */
    .hero-wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        z-index: 3;
        transform: rotate(180deg);

        svg {
            position: relative;
            display: block;
            width: calc(100% + 1.3px);
            height: 80px;
        }

        .shape-fill {
            fill: #f0f7fd;
            /* Couleur de fond de la section featured */
        }
    }
}

/* --- Animations --- */
@keyframes float {
    0% {
        transform: translate(0, 0) rotate(0deg);
    }

    50% {
        transform: translate(15px, 15px) rotate(5deg);
    }

    100% {
        transform: translate(0, 0) rotate(0deg);
    }
}

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

/* --- Section FEATURED MERCHANT --- */
.featured-merchant {
    padding: 80px 20px 100px;
    background: linear-gradient(170deg, #f0f7fd 0%, #ebf4f9 50%, #e7f0f7 100%);
    position: relative;
    overflow: visible;
    /* Modifier pour que la vague dépasse */
    margin-bottom: -2px;
    /* Empêche les espaces entre les sections */

    &::before {
        content: "";
        position: absolute;
        top: -10%;
        right: -5%;
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, rgba(41, 128, 185, 0.1), rgba(109, 213, 250, 0.1));
        border-radius: 50%;
        z-index: 0;
        animation: float 15s infinite ease-in-out;
    }

    /* Transition en vague revue */
    .featured-wave {
        position: absolute;
        bottom: -1px;
        /* Assure qu'il n'y a pas d'espace */
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        z-index: 3;

        svg {
            position: relative;
            display: block;
            width: calc(100% + 1.3px);
            height: 80px;
        }

        .shape-fill {
            fill: #f0f4f8;
            /* Couleur de fond de la section merchants */
        }
    }
}

.featured-container {
    max-width: 1200px;
    margin: 30px auto;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 2;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.featured-image {
    flex: 0 0 45%;
    padding: 30px;
    position: relative;

    .image-frame {
        position: relative;
        display: block; // Changed from inline-block
        width: 100%; // Added to ensure full width
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.267);
        border: 1px solid rgb(41, 127, 185);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            transform-origin: center;
            display: block; // Added to remove potential whitespace
        }
    }
}

.featured-content {
    flex: 0 0 55%;
    padding: 30px;

    .premium-badge {
        display: inline-block;
        margin-bottom: 15px;

        span {
            background: linear-gradient(135deg, #2980B9, #6DD5FA);
            color: white;
            padding: 8px 16px;
            border-radius: 30px;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    }

    h2 {
        font-size: 2.5rem;
        margin-bottom: 15px;
        color: #2c3e50;
        font-weight: 700;
    }

    .featured-address {
        font-size: 1.1rem;
        color: #7f8c8d;
        margin-bottom: 20px;
    }

    .featured-description {
        font-size: 1.2rem;
        line-height: 1.6;
        color: #34495e;
        margin-bottom: 30px;
    }

    .featured-cta {
        .btn-discover {
            background: linear-gradient(135deg, #2980B9, #6DD5FA);
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 1.1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(41, 128, 185, 0.3);

            &:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(41, 128, 185, 0.4);
            }
        }
    }
}

/* --- Section MERCHANTS LIST --- */
.merchants-page {
    text-align: center;
    background-color: #f0f4f8;
    padding: 60px 50px 80px;
    position: relative;
    z-index: 1;

    h2 {
        margin-bottom: 40px;
        color: #2c3e50;
        font-size: 2.2rem;
        font-weight: 700;
    }
}

.merchants-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
}

.merchant-card {
    background: linear-gradient(135deg, #6DD5FA, #2980B9);
    padding: 25px;
    border-radius: 20px;
    width: 320px;
    text-align: center;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
    transition: transform 0.5s ease, box-shadow 0.5s ease, border-radius 0.5s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: rotate(-3deg) scale(1.05);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        border-radius: 25px;
    }

    img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin-bottom: 15px;
        border: 4px solid #eee;
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
    }

    h3 {
        color: #222;
        font-size: 1.6rem;
        margin-bottom: 8px;
        font-weight: bold;
    }

    .address {
        color: #333;
        margin-bottom: 10px;
        font-weight: 600;
        font-size: 1rem;
    }

    .description {
        color: #555;
        font-size: 0.95rem;
    }

    &::before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        left: -50%;
        width: 200%;
        height: 0%;
        background: linear-gradient(135deg, #0074D9, #7FDBFF);
        transform: rotate(45deg);
        transition: all 0.4s ease;
    }

    &:hover::before {
        height: 250%;
    }
}

/* --- RESPONSIVE --- */
@media (max-width: 900px) {
    .featured-container {
        flex-direction: column;
        text-align: center;
    }

    .featured-image,
    .featured-content {
        flex: 0 0 100%;
    }

    .featured-image {
        margin-bottom: 20px;
    }

    .hero-wave svg,
    .featured-wave svg {
        height: 50px;
        /* Plus petit sur mobile */
    }
}

@media (max-width: 700px) {
    .hero {
        height: auto;
        padding: 70px 0 50px;
    }

    .hero-content h1 {
        font-size: 2.3rem;
    }

    .featured-merchant {
        padding: 70px 15px 90px;
    }

    .featured-container {
        padding: 20px;
    }

    .featured-image .image-frame img {
        height: 280px;
    }

    .featured-content h2 {
        font-size: 2rem;
    }

    .merchants-container {
        flex-direction: column;
        align-items: center;
    }

    .merchants-page {
        padding: 50px 20px 70px;
    }
}
</style>