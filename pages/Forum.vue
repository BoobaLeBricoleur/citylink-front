<template>
  <div class="forum-page">
    <Header />
    <section class="hero-forum">
      <div class="hero-content">
        <h1>Forum</h1>
        <p>Échanges entre habitants.</p>
      </div>
    </section>

    <!-- Toolbar filtres globale -->
    <div class="forum-toolbar">
      <div class="filters-inline">
        <div class="field search">
          <i class="icon fa fa-search"></i>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un topic..."
            aria-label="Recherche"
          />
        </div>
        <div class="field date">
            <label>De
              <input v-model="dateFrom" type="date" />
            </label>
            <label>À
              <input v-model="dateTo" type="date" />
            </label>
        </div>
        <div class="actions">
          <button
            class="btn secondary"
            @click="clearFilters"
            :disabled="!searchTerm && !dateFrom && !dateTo">
            Réinitialiser
          </button>
        </div>
      </div>
      <div class="quick-stats" v-if="forums.length">
        <span>{{ forums.length }} topics</span>
        <span v-if="filteredForums.length !== forums.length">
          / filtrés: {{ filteredForums.length }}
        </span>
      </div>
    </div>

    <div class="forum-layout">
      <!-- Sidebar topics récents -->
      <aside class="sidebar">
        <div class="create-forum card" v-if="isLoggedIn">
          <h4 class="section-title">Nouveau topic</h4>
          <input v-model="newForum.name" placeholder="Titre" />
            <textarea
              v-model="newForum.description"
              placeholder="Description (optionnel)"
              rows="3"></textarea>
          <button
            class="btn primary w100"
            @click="createForum"
            :disabled="!newForum.name || creating">
            <span v-if="!creating">Créer</span>
            <span v-else>...</span>
          </button>
          <div class="mini-error" v-if="forumError">{{ forumError }}</div>
        </div>

        <div class="recent-topics card" v-if="recentForums.length">
          <h4 class="section-title">Topics récents</h4>
          <ul>
            <li
              v-for="r in recentForums"
              :key="'recent-'+r.id"
              :class="{ active: r.id === activeForumId }"
              @click="selectForum(r.id)">
              <div class="title-line">
                <span class="name" :title="r.name">{{ truncate(r.name, 38) }}</span>
                <time class="date" :datetime="r.created_at">{{ shortDate(r.created_at) }}</time>
              </div>
              <p class="desc" v-if="r.description">{{ truncate(r.description, 60) }}</p>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Zone messages -->
      <main class="forum-main">
        <div class="topics-list card">
          <h4 class="section-title">Tous les topics</h4>
          <ul v-if="filteredForums.length" class="topics-grid">
            <li
              v-for="f in filteredForums"
              :key="f.id"
              :class="['topic-tile', { active: f.id === activeForumId }]"
              @click="selectForum(f.id)">
              <div class="tile-head">
                <h3 class="topic-title">{{ f.name }}</h3>
                <time class="topic-date" :datetime="f.created_at">{{ shortDate(f.created_at) }}</time>
              </div>
              <p class="topic-desc" v-if="f.description">{{ truncate(f.description, 120) }}</p>
              <div class="topic-meta">
                <span class="author" v-if="f.owner_name">
                  Par {{ f.owner_name }}
                </span>
              </div>
            </li>
          </ul>
          <div v-else class="empty-state">
            Aucun topic avec ces filtres.
          </div>
        </div>

        <div
          v-if="activeForum"
          class="messages-panel card">
          <header class="panel-header">
            <div class="info">
              <h2 class="forum-title">{{ activeForum.name }}</h2>
              <p class="forum-sub" v-if="activeForum.description">{{ activeForum.description }}</p>
            </div>
            <div class="panel-actions">
              <button
                v-if="isLoggedIn && canDeleteForum"
                class="btn danger subtle"
                @click="confirmDeleteForum">
                Supprimer
              </button>
            </div>
          </header>

          <div class="messages-container" ref="messagesScroll">
            <div v-if="messages.length === 0" class="empty-messages">
              Aucun message.
            </div>
            <div
              v-for="m in messages"
              :key="m.id"
              class="message-row">
              <div class="bubble">
                <div class="bubble-head">
                  <span class="author">{{ m.author_name || ('Utilisateur #' + m.user_id) }}</span>
                  <time class="date" :datetime="m.created_at">{{ formatDate(m.created_at) }}</time>
                </div>
                <p class="content">{{ m.message }}</p>
                <div class="bubble-actions" v-if="isLoggedIn && canDeleteMessage(m)">
                  <button class="link danger" @click="confirmDeleteMessage(m.id)">Supprimer</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isLoggedIn" class="composer">
            <textarea
              v-model="newMessage"
              placeholder="Votre message..."
              @keydown.ctrl.enter.prevent="postMessage"
              rows="3"></textarea>
            <div class="composer-actions">
              <span class="helper">Ctrl+Entrée pour envoyer</span>
              <button
                class="btn primary"
                @click="postMessage"
                :disabled="!newMessage || posting">
                <span v-if="!posting">Envoyer</span>
                <span v-else>...</span>
              </button>
            </div>
            <div class="mini-error" v-if="messageError">{{ messageError }}</div>
          </div>
        </div>
      </main>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '../components/views/Header.vue'
import Footer from '../components/views/Footer.vue'
import axios from 'axios'

export default {
  components: { Header, Footer },
  data() {
    return {
      API_URL: process.env.API_URL || 'http://localhost:3000/api',
      forums: [],
      activeForumId: null,
      activeForum: null,
      messages: [],
      newForum: { name: '', description: '' },
      newMessage: '',
      forumError: '',
      messageError: '',
      posting: false,
      creating: false,
      searchTerm: '',
      dateFrom: '',
      dateTo: ''
    }
  },
  computed: {
    isLoggedIn() { return !!localStorage.getItem('token') },
    currentUser() {
      try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
    },
    canDeleteForum() {
      if (!this.activeForum || !this.currentUser?.id) return false
      return this.activeForum.user_id === this.currentUser.id
    },
    filteredForums() {
      let list = [...this.forums]
      if (this.searchTerm.trim()) {
        const q = this.searchTerm.toLowerCase()
        list = list.filter(f => f.name?.toLowerCase().includes(q))
      }
      if (this.dateFrom) {
        const fromTs = new Date(this.dateFrom + 'T00:00:00').getTime()
        list = list.filter(f => new Date(f.created_at).getTime() >= fromTs)
      }
      if (this.dateTo) {
        const toTs = new Date(this.dateTo + 'T23:59:59').getTime()
        list = list.filter(f => new Date(f.created_at).getTime() <= toTs)
      }
      return list
    },
    recentForums() {
      return [...this.forums]
        .sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))
        .slice(0,5)
    }
  },
  async mounted() {
    await this.fetchForums()
  },
  methods: {
    truncate(str, n) {
      if (!str) return ''
      return str.length > n ? str.slice(0, n - 1) + '…' : str
    },
    clearErrors() { this.forumError=''; this.messageError='' },
    showTempError(type, msg, timeout = 6000) {
      if (type === 'forum') this.forumError = msg
      if (type === 'message') this.messageError = msg
      setTimeout(()=> {
        if (type === 'forum') this.forumError=''
        if (type === 'message') this.messageError=''
      }, timeout)
    },
    authHeaders() {
      const t = localStorage.getItem('token')
      return t ? { Authorization: `Bearer ${t}` } : {}
    },
    async fetchForums() {
      const { data } = await axios.get(`${this.API_URL}/forums`)
      this.forums = data
      if (!this.activeForumId && data.length) this.selectForum(data[0].id)
    },
    async selectForum(id) {
      this.activeForumId = id
      const { data } = await axios.get(`${this.API_URL}/forums/${id}`)
      this.activeForum = data
      await this.fetchMessages()
      this.$nextTick(()=> {
        const el = this.$refs.messagesScroll
        if (el) el.scrollTop = el.scrollHeight
      })
    },
    async fetchMessages() {
      if (!this.activeForumId) return
      const { data } = await axios.get(`${this.API_URL}/forums/${this.activeForumId}/messages`)
      this.messages = data
    },
    async createForum() {
      if (!this.isLoggedIn || !this.newForum.name) return
      this.creating = true
      this.forumError = ''
      try {
        await axios.post(`${this.API_URL}/forums`, this.newForum, { headers: this.authHeaders() })
        this.newForum = { name: '', description: '' }
        await this.fetchForums()
      } catch (e) {
        const msg = e.response?.data?.message || 'Erreur lors de la création'
        this.showTempError('forum', msg)
      } finally { this.creating = false }
    },
    async deleteForum(id) {
      try {
        await axios.delete(`${this.API_URL}/forums/${id}`, { headers: this.authHeaders() })
        this.activeForumId = null
        this.activeForum = null
        this.messages = []
        await this.fetchForums()
        this.showTempError('forum', 'Forum supprimé.', 3000)
      } catch (e) {
        const msg = e.response?.data?.message || 'Erreur suppression forum'
        this.showTempError('forum', msg)
      }
    },
    confirmDeleteForum() {
      if (!this.canDeleteForum) return
      if (confirm('Confirmer la suppression de ce forum ?')) this.deleteForum(this.activeForum.id)
    },
    async postMessage() {
      if (!this.newMessage.trim()) return
      this.posting = true
      this.messageError = ''
      try {
        await axios.post(
          `${this.API_URL}/forums/${this.activeForumId}/messages`,
          { message: this.newMessage },
          { headers: this.authHeaders() }
        )
        this.newMessage = ''
        await this.fetchMessages()
        this.$nextTick(()=> {
          const el = this.$refs.messagesScroll
            if (el) el.scrollTop = el.scrollHeight
        })
      } catch (e) {
        const msg = e.response?.data?.message || 'Erreur lors de l’envoi'
        this.showTempError('message', msg)
      } finally { this.posting = false }
    },
    confirmDeleteMessage(id) {
      if (confirm('Supprimer ce message ?')) this.deleteMessage(id)
    },
    async deleteMessage(id) {
      try {
        await axios.delete(
          `${this.API_URL}/forums/${this.activeForumId}/messages/${id}`,
          { headers: this.authHeaders() }
        )
        this.messages = this.messages.filter(m => m.id !== id)
        this.showTempError('message', 'Message supprimé.', 3000)
      } catch (e) {
        const msg = e.response?.data?.message || 'Erreur suppression message'
        this.showTempError('message', msg)
      }
    },
    canDeleteMessage(m) {
      return this.currentUser?.id && this.currentUser.id === m.user_id
    },
    formatDate(d) {
      if (!d) return ''
      return new Date(d).toLocaleString('fr-FR',
        { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric' })
    },
    shortDate(d) {
      if (!d) return ''
      return new Date(d).toLocaleDateString('fr-FR',
        { day:'2-digit', month:'2-digit' })
    },
    clearFilters() {
      this.searchTerm=''; this.dateFrom=''; this.dateTo=''
    }
  }
}
</script>