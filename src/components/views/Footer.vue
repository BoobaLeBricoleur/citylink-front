<script>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="footer">
        <div class="footer-logo footer-element">
            <img src="../../assets/citylink-logo.svg" alt="citylink-logo">
        </div>
        <div class="copyright footer-element">
            <p>© 2025 CityLink. All rights reserved.</p>
        </div>
        <div class="socials-logo footer-element">
            <a href="" target="_blank">
                <img src="../../assets/logo-x.svg" alt="logo-x" height="30px" width="30px">
            </a>
            <a href="" target="_blank">
                <img src="../../assets/logo-facebook.svg" alt="logo-facebook" height="30px" width="30px">
            </a>
            <a href="" target="_blank">
                <img src="../../assets/logo-instagram.svg" alt="logo-instagram" height="30px" width="30px">
            </a>
        </div>
    </div>
</template>

<style lang="scss">
.footer {
    background-color: var(--cl-dark-active);
    height: 50px;
    display: flex;
    justify-content: space-between;
    padding: 30px 20px;

    .footer-element {
        display: flex;
        align-items: center;
    }

    .copyright {
        color: white;
    }

    .socials-logo {
        display: flex;
        gap: 5px;

        img {
            background-color: white;
            border-radius: 50px;
            padding: 5px;
        }
    }
}
</style>