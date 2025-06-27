<template>
  <header class="header" :class="{ 'scrolled': isScrolled }">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <NuxtLinkLocale to="/">
          <NuxtImg src="/citylink-logo.svg" alt="CityLink" height="40" />
        </NuxtLinkLocale>
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
          <li><NuxtLinkLocale to="/forum" @click="isMenuOpen = false">{{ $t('header.menu.forum') }}</NuxtLinkLocale></li>
          <li><NuxtLinkLocale to="/merchants" @click="isMenuOpen = false">{{ $t('header.menu.merchants') }}</NuxtLinkLocale></li>
          <li><NuxtLinkLocale to="/events" @click="isMenuOpen = false">{{ $t('header.menu.events') }}</NuxtLinkLocale></li>
          <li><NuxtLinkLocale to="/informations" @click="isMenuOpen = false">{{ $t('header.menu.information') }}</NuxtLinkLocale></li>
          <li><NuxtLinkLocale to="/announcements" @click="isMenuOpen = false">{{ $t('header.menu.announcements') }}</NuxtLinkLocale></li>
          <li><NuxtLinkLocale to="/emergency" @click="isMenuOpen = false">{{ $t('header.menu.emergency') }}</NuxtLinkLocale></li>
        </ul>

        <!-- Sélecteur de langue -->
        <div class="language-selector">
          <button @click="switchLanguage" class="language-button" :title="$t('header.language.switch')">
            <Icon name="ph:globe" />
            <span>{{ currentLanguage.toUpperCase() }}</span>
          </button>
        </div>

        <!-- Actions de connexion -->
        <div class="auth-actions">
          <!-- Si connecté -->
          <div v-if="isLoggedIn" class="user-profile" @click="toggleDropdown">
            <div class="avatar-circle">
              <Icon name="ph:user" />
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
                  <NuxtLinkLocale to="/profile" class="dropdown-item" @click="isDropdownOpen = false">
                    <Icon name="ph:user" /> {{ $t('header.dropdown.profile') }}
                  </NuxtLinkLocale>
                  <NuxtLinkLocale to="/admin" class="dropdown-item" @click="isDropdownOpen = false">
                    <Icon name="ph:squares-four" /> {{ $t('header.dropdown.dashboard') }}
                  </NuxtLinkLocale>

                  <NuxtLinkLocale to="/settings" class="dropdown-item" @click="isDropdownOpen = false">
                    <Icon name="ph:gear" /> {{ $t('header.dropdown.settings') }}
                  </NuxtLinkLocale>
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
            <NuxtLinkLocale to="/account" class="login-button" @click="isMenuOpen = false">
              <i class="fa-solid fa-user"></i>
              <span>{{ $t('header.login') }}</span>
            </NuxtLinkLocale>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const { locale, locales, setLocale } = useI18n()
const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const isLoggedIn = ref(false)
const userData = ref({})
const isScrolled = ref(false)

const currentLanguage = computed(() => locale.value)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.classList.toggle('no-scroll', isMenuOpen.value)
}

const toggleDropdown = (event) => {
  event.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value
}

const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  isLoggedIn.value = false
  isDropdownOpen.value = false
  router.push('/')
}

const switchLanguage = async () => {
  const newLocale = locale.value === 'fr' ? 'en' : 'fr'
  await setLocale(newLocale)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const closeDropdown = (event) => {
  if (!event.target.closest('.user-profile') && isDropdownOpen.value) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  if (process.client) {
    const user = localStorage.getItem('user')
    if (user) {
      isLoggedIn.value = true
      userData.value = JSON.parse(user)
    }
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', closeDropdown)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', closeDropdown)
  }
})
</script>
