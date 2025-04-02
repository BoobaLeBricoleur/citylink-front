<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
    <div class="header">
        <div class="logo header-component">
            <NuxtImg src="/citylink-logo.svg" alt="Logo" height="40px" />
        </div>

        <div class="burger-menu" @click="toggleMenu">
            <div :class="{ 'bar': true, 'open': isMenuOpen }"></div>
            <div :class="{ 'bar': true, 'open': isMenuOpen }"></div>
            <div :class="{ 'bar': true, 'open': isMenuOpen }"></div>
        </div>

        <div class="links-container" :class="{ 'active': isMenuOpen }">
            <div class="links">
                <RouterLink to="/forum">Forum</RouterLink>
                <RouterLink to="/merchants">Merchants</RouterLink>
                <RouterLink to="/events">Events</RouterLink>
                <RouterLink to="/informations">Informations</RouterLink>
                <RouterLink to="/announcements">Announcements</RouterLink>
                <RouterLink to="/account" class="account-button">Login</RouterLink>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import "@/assets/base.css";

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: var(--cl-normal);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid white;
    position: relative;
    z-index: 100;

    .header-component {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .links-container {
        display: flex;
        align-items: center;
        
        .links {
            display: flex;
            gap: 20px;

            .account-button {
                background-color: white;
                color: var(--cl-normal);

                &:hover {
                    transition: all 0.5s ease-in-out;
                    background: rgba(255, 255, 255, 0.7);
                }
            }

            a {
                text-decoration: none;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;

                &:hover {
                    transition: all 0.5s ease;
                    background: rgba(255, 255, 255, 0.1);
                }
            }
        }
    }

    .burger-menu {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 30px;
        height: 25px;
        cursor: pointer;
        z-index: 200;

        .bar {
            width: 100%;
            height: 4px;
            background-color: white;
            transition: 0.4s;
        }

        &.open {
            .bar:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
            .bar:nth-child(2) { opacity: 0; }
            .bar:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        }
    }
}

@media (max-width: 850px) {
    .header {
        .links-container {
            position: absolute;
            top: 60px;
            right: 0;
            width: 100%;
            background: var(--cl-normal);
            flex-direction: column;
            text-align: center;
            overflow: hidden;
            max-height: 0;
            visibility: hidden;
            opacity: 0;
            transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;

            .links {
                display: flex;
                flex-direction: column;
                padding: 20px 0;

                a {
                    padding: 15px 0;
                    width: 100%;
                    display: block;
                    color: white;
                    text-decoration: none;
                    font-size: 18px;
                    font-weight: bold;

                    &:hover {
                        background: rgba(255, 255, 255, 0.1);
                        transition: background 0.3s;
                    }
                }
            }
        }

        .links-container.active {
            max-height: 500px;
            visibility: visible;
            opacity: 1;
        }

        .burger-menu {
            display: flex;
        }
    }
}
</style>