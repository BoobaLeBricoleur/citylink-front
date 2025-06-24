import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
    faAmbulance,
    faShieldAlt,
    faFireExtinguisher,
    faPhone,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'


library.add(
    faAmbulance,
    faShieldAlt,
    faFireExtinguisher,
    faPhone,
    faExclamationTriangle
)

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})