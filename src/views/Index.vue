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
    <Header />
    <div class="index-page">
        <div class="upper-index">
            <h2>La ville de Lyon va prendre vie. Allez-vous y participer ?</h2>
            <div class="message-bubble thought">
                <p class="message-text">CityLink représente un pas majeur dans la digitalisation et la mise en relations
                    entre les citoyens
                    de la ville de Lyon, vous êtes au coeur de ce projet.</p>
                <p class="gold-button">Qu'est ce qui se passe dans ma ville ?</p>
            </div>

            <div class="message-bubble-reverse thought-reverse">
                <p class="message-text-title">Qu'est ce que CityLink ?</p>
                <p class="message-text">CityLink est un site internet, mis en place par la mairie de Lyon afin de
                    faciliter la mise en relation entre les citoyens, la mairie et les commerçants de la ville.</p>
            </div>
        </div>
        <svg viewBox="0 0 1440 320">
            <path fill="var(--cl-dark-active)" fill-opacity="1"
                d="M0,160L48,170.7C96,181,192,203,288,213.3C384,224,480,224,576,213.3C672,203,768,181,864,186.7C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
        </svg>
        <div class="lower-index">

            <div class="merchant-introduction-container">
                <div class="merchant-introduction">
                    <h3>Besoin d'un coup de pouce ?</h3>
                    <p>Cette plateforme permet de mettre en valeur votre boutique !<br><br>
                        Toutes les boutiques de la ville peuvent avoir leurs vitrine içi, et tout les citoyens peuvent y
                        accéder !</p>
                </div>
            </div>

            <div class="merchant-presentation">
                <img src="../assets/shop-logo.png" alt="shop-logo">
                <a href="">Cliquez ici pour voir toutes les boutiques de votre ville !</a>
            </div>
        </div>
    </div>
    <Footer />
</template>

<style lang="scss">
.index-page {
    display: flex;
    flex-direction: column;
    background-color: var(--cl-normal);

    .lower-index {
        background-color: var(--cl-dark-active);
        display: flex;
        justify-content: space-around;

        .merchant-introduction-container {
            width: 40%;
            height: auto;
            background-color: white;
            border-radius: 20px;

            .merchant-introduction {
                margin-top: 20%;
                padding: 15px;

                h3 {
                    font-size: 3rem;
                    font-weight: 500;
                    margin-bottom: 50px;
                }

                p {
                    font-size: 1.5rem;
                }
            }
        }

        .merchant-presentation {
            border-radius: 20px;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            padding: 0 50px;
            background-color: white;
            display: flex;
            flex-direction: column;
            width: 40%;

            a {
                text-align: center;
                color: black;
                padding: 15px;
                box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
                font-size: 2rem;
                text-decoration: none;
                margin-bottom: 20px;
                background-color: var(--cl-light);
                transition: all 0.2s linear;

                &:hover {
                    background-color: var(--cl-light-hover);
                }
            }
        }
    }
}

.upper-index {
    margin: 0 50px;
    min-height: 100%;

    h2 {
        font-size: 2rem;
        font-weight: 500;
        color: var(--cl-light);
        margin: 40px 0;
    }

    div.message-bubble {
        float: left;
    }

    div.message-bubble,
    div.message-bubble-reverse {

        background-color: var(--cl-dark-active);
        width: 50%;
        border-radius: 30px;
        padding: 25px 25px;


        position: relative;
        text-align: center;
        line-height: 1.4em;
        font-family: sans-serif;
        font-size: large;
    }

    div.message-bubble:before,
    div.message-bubble:after {
        content: ' ';
        position: absolute;
        width: 0;
        height: 0;
    }

    div.thought:before,
    div.thought:after {
        left: 10px;
        bottom: -45px;
        width: 40px;
        height: 40px;
        background-color: var(--cl-dark-active);
        -webkit-border-radius: 28px;
        -moz-border-radius: 28px;
        border-radius: 28px;
    }

    div.thought:after {
        left: -10px;
        bottom: -70px;
        width: 25px;
        height: 25px;
        background-color: var(--cl-dark-active);
        -webkit-border-radius: 28px;
        -moz-border-radius: 28px;
        border-radius: 28px;
    }

    div.message-bubble-reverse:before,
    div.message-bubble-reverse:after {
        content: ' ';
        position: absolute;
        width: 0;
        height: 0;
    }

    div.thought-reverse:before,
    div.thought-reverse:after {
        right: 10px;
        bottom: -45px;
        width: 40px;
        height: 40px;
        background-color: var(--cl-dark-active);
        -webkit-border-radius: 28px;
        -moz-border-radius: 28px;
        border-radius: 28px;
    }

    div.thought-reverse:after {
        right: -10px;
        bottom: -70px;
        width: 25px;
        height: 25px;
        background-color: var(--cl-dark-active);
        -webkit-border-radius: 28px;
        -moz-border-radius: 28px;
        border-radius: 28px;
    }

    .message-bubble-reverse {
        float: right;
        margin-top: 200px;

        .message-text-title {
            font-size: 1.5rem;
            font-weight: 500;
            background: linear-gradient(90deg, rgba(255, 226, 89, 1) 0%, rgba(255, 167, 81, 1) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 10px;
        }
    }

    .message-bubble .message-text,
    .message-bubble-reverse .message-text {
        color: white;
        margin-bottom: 20px;
    }

    .gold-button {
        background: rgb(255, 226, 89);
        background: linear-gradient(90deg, rgba(255, 226, 89, 1) 0%, rgba(255, 167, 81, 1) 100%);
        padding: 5px 5px;
        margin: 10px 0;
        height: auto;
        width: fit-content;
        border-radius: 5px;
    }
}

@media (max-width: 700px) {

    .upper-index {

        div.message-bubble,
        div.message-bubble-reverse {
            width: 100%;
        }

        .message-bubble-reverse {
            margin-top: 100px;
        }
    }

    .index-page {
        .lower-index {
            flex-direction: column;

            .merchant-introduction-container,
            .merchant-presentation {
                margin: 20px auto;
                width: 80%;
            }
        }
    }
}
</style>