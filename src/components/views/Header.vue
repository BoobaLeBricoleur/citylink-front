<script>
    import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="header">
        <div class="logo header-component">
            <img src="../../assets/logo.svg" alt="Logo" height="40px"/>
        </div>
        <div class="links header-component">
            <RouterLink to="/forum">Forum</RouterLink>
            <RouterLink to="/merchants">Merchants</RouterLink>
            <RouterLink to="/events">Events</RouterLink>
            <RouterLink to="/informations">Informations</RouterLink>
            <RouterLink to="/announcements">Announcements</RouterLink>
            <RouterLink to="/login" class="account-button">Login</RouterLink>
            
        </div>
    </div>
</template>

<style>

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: var(--cl-normal);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header .header-component {
    height: 100%;
    display: flex;
    align-items: center;
}

.header .links, .header .links a {
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
    color: white;
    gap: 20px;
}

.header .links p:hover, .header .links a:hover {
    transition: all 0.5s;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
    color: var(--cl-light-hover);
}



</style>