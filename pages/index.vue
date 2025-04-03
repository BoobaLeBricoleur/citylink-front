<script>
import Header from '../components/views/Header.vue'
import Footer from '../components/views/Footer.vue'

export default {
    components: {
        Header,
        Footer
    }
}
</script>

<template>
    <div class="home-page">
        <Header />
        
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <h1>CityLink prend vie</h1>
                <p class="hero-subtitle">
                    Rejoignez le futur de la vie citoyenne avec CityLink, la plateforme qui rapproche citoyens, 
                    commerces et services municipaux.
                </p>
                <div class="hero-cta">
                    <a href="#about" class="secondary-button">Découvrir CityLink</a>
                    <a href="/events" class="secondary-button">Voir les événements</a>
                </div>
            </div>
            <div class="hero-overlay"></div>
        </section>
        
        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <div class="section-header">
                    <h2>Qu'est-ce que CityLink ?</h2>
                    <div class="section-divider"></div>
                </div>
                
                <div class="feature-cards">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <h3>Connecter</h3>
                        <p>CityLink représente un pas majeur dans la digitalisation et la mise en relation entre les citoyens 
                        de la ville de CityLink. Vous êtes au cœur de ce projet.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <h3>Centraliser</h3>
                        <p>Un site internet mis en place par la mairie de CityLink pour faciliter la relation entre 
                        les citoyens, l'administration et les commerçants de la ville.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <h3>Participer</h3>
                        <p>Restez informé des événements locaux, participez à la vie de votre quartier et 
                        contribuez à l'évolution de votre ville.</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Wave Separator -->
        <div class="wave-separator">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path fill="var(--cl-dark-active)" fill-opacity="1" 
                      d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,64C672,64,768,96,864,96C960,96,1056,64,1152,48C1248,32,1344,32,1392,32L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                </path>
            </svg>
        </div>
        
        <!-- Shop Section -->
        <section class="shop-section">
            <div class="container">
                <div class="shop-content">
                    <div class="shop-info">
                        <h2>Commerçants, valorisez votre activité</h2>
                        <div class="section-divider light"></div>
                        <p>CityLink offre une vitrine digitale à tous les commerces lyonnais. Gagnez en visibilité et connectez-vous 
                        directement avec vos clients.</p>
                        <ul class="benefits-list">
                            <li><i class="fas fa-check-circle"></i> Créez votre profil commercial gratuitement</li>
                            <li><i class="fas fa-check-circle"></i> Partagez vos actualités et promotions</li>
                            <li><i class="fas fa-check-circle"></i> Touchez une clientèle locale et engagée</li>
                        </ul>
                        <NuxtLink to="/shops" class="shop-cta-button">
                            Découvrir les commerces
                        </NuxtLink>
                    </div>
                    
                    <div class="shop-image">
                        <NuxtImg src="/shop-logo.png" alt="Boutiques locales" class="shop-illustration" />
                    </div>
                </div>
            </div>
        </section>
        
        <!-- CTA Section -->
        <section class="cta-section">
            <div class="container">
                <h2>Prêt à rejoindre la communauté CityLink ?</h2>
                <p>Créez votre compte en quelques minutes et participez à la vie de votre ville.</p>
                <NuxtLink to="/account" class="cta-button">Créer mon compte</NuxtLink>
            </div>
        </section>
        
        <Footer />
    </div>
</template>