<template>
  <header class="header" :class="{ 'scrolled': isScrolled }">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <NuxtLink to="/">
          <NuxtImg src="/citylink-logo.svg" alt="CityLink" height="40" />
        </NuxtLink>
      </div>

      <!-- Menu burger mobile -->
      <button class="burger-button" @click="toggleMenu" :class="{ 'active': isMenuOpen }" :aria-label="$t('header.navigation_menu')">
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
      </button>

      <!-- Navigation -->
      <nav class="main-nav" :class="{ 'active': isMenuOpen }">
        <ul class="nav-list">
          <li><NuxtLink to="/forum" @click="isMenuOpen = false">{{ $t('header.menu.forum') }}</NuxtLink></li>
          <li><NuxtLink to="/merchants" @click="isMenuOpen = false">{{ $t('header.menu.merchants') }}</NuxtLink></li>
          <li><NuxtLink to="/events" @click="isMenuOpen = false">{{ $t('header.menu.events') }}</NuxtLink></li>
          <li><NuxtLink to="/informations" @click="isMenuOpen = false">{{ $t('header.menu.information') }}</NuxtLink></li>
          <li><NuxtLink to="/announcements" @click="isMenuOpen = false">{{ $t('header.menu.announcements') }}</NuxtLink></li>
          <li><NuxtLink to="/emergency" @click="isMenuOpen = false">{{ $t('header.menu.emergency') }}</NuxtLink></li>
        </ul>

        <!-- Actions de connexion -->
        <div class="auth-actions">
          <!-- Si connecté -->
          <div v-if="isLoggedIn" class="user-profile" @click="toggleDropdown">
            <div class="avatar-circle">
              <i class="fa-solid fa-user"></i>
            </div>
            <span class="user-name hide-mobile">{{ userData.firstname }}</span>

            <!-- Menu déroulant -->
            <transition name="dropdown">
              <div class="dropdown-menu" v-if="isDropdownOpen">
                <div class="dropdown-header">
                  <div class="dropdown-user-info">
                    <div class="dropdown-name">{{ userData.firstname }} {{ userData.lastname }}</div>
                    <div class="dropdown-email">{{ userData.email }}</div>
                  </div>
                </div>

                <div class="dropdown-content">
                  <NuxtLink to="/profile" class="dropdown-item" @click="isDropdownOpen = false">
                    <i class="fa-solid fa-user"></i> {{ $t('header.dropdown.profile') }}
                  </NuxtLink>
                  <NuxtLink to="/admin" class="dropdown-item" @click="isDropdownOpen = false">
                    <i class="fa-solid fa-user"></i> {{ $t('header.dropdown.dashboard') }}
                  </NuxtLink>

                  <NuxtLink to="/settings" class="dropdown-item" @click="isDropdownOpen = false">
                    <i class="fa-solid fa-user"></i> {{ $t('header.dropdown.settings') }}
                  </NuxtLink>
                </div>

                <div class="dropdown-footer">
                  <button @click="logout" class="dropdown-item logout">
                    <i class="fa-solid fa-user"></i> {{ $t('header.dropdown.logout') }}
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Si non connecté -->
          <div v-else class="auth-buttons">
            <NuxtLink to="/account" class="login-button" @click="isMenuOpen = false">
              <i class="fa-solid fa-user"></i>
              <span>{{ $t('header.login') }}</span>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// État du menu mobile
const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);
const isLoggedIn = ref(false);
const userData = ref({});
const isScrolled = ref(false);

// Détecte si l'utilisateur est connecté
onMounted(() => {
  if (process.client) {
    const user = localStorage.getItem('user');
    if (user) {
      isLoggedIn.value = true;
      userData.value = JSON.parse(user);
    
    }
    
    // Détection du scroll pour effet de header transparent/opaque
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', closeDropdown);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', closeDropdown);
  }
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// Fonctions
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
};

const toggleDropdown = (event) => {
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  isDropdownOpen.value = false;
  router.push('/');
};

// Ferme le menu quand l'utilisateur clique en dehors
const closeDropdown = (event) => {
  if (!event.target.closest('.user-profile') && isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
};
</script>