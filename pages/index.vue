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
                <h1>{{ $t('hero.title') }}</h1>
                <p class="hero-subtitle">
                    {{ $t('hero.subtitle') }}
                </p>
                <div class="hero-cta">
                    <a href="#about" class="secondary-button">{{ $t('hero.discover_button') }}</a>
                    <a href="/events" class="secondary-button">{{ $t('hero.events_button') }}</a>
                </div>
            </div>
            <div class="hero-overlay"></div>
        </section>
        
        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <div class="section-header">
                    <h2>{{ $t('about.title') }}</h2>
                    <div class="section-divider"></div>
                </div>
                
                <div class="feature-cards">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <h3>{{ $t('about.features.connect.title') }}</h3>
                        <p>{{ $t('about.features.connect.description') }}</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <h3>{{ $t('about.features.centralize.title') }}</h3>
                        <p>{{ $t('about.features.centralize.description') }}</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <h3>{{ $t('about.features.participate.title') }}</h3>
                        <p>{{ $t('about.features.participate.description') }}</p>
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
                        <h2>{{ $t('shop.title') }}</h2>
                        <div class="section-divider light"></div>
                        <p>{{ $t('shop.description') }}</p>
                        <ul class="benefits-list">
                            <li><i class="fas fa-check-circle"></i> {{ $t('shop.benefits.profile') }}</li>
                            <li><i class="fas fa-check-circle"></i> {{ $t('shop.benefits.share') }}</li>
                            <li><i class="fas fa-check-circle"></i> {{ $t('shop.benefits.reach') }}</li>
                        </ul>
                        <NuxtLink to="/merchants" class="shop-cta-button">
                            {{ $t('shop.discover_button') }}
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
                <h2>{{ $t('cta.title') }}</h2>
                <p>{{ $t('cta.description') }}</p>
                <NuxtLink to="/account" class="cta-button">{{ $t('cta.button') }}</NuxtLink>
            </div>
        </section>
        
        <Footer />
    </div>
</template>