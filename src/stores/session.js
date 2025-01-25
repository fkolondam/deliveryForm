import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', () => {
  const isAuthenticated = ref(false)
  const currentSession = ref(null)
  const offlineInvoices = ref([])

  const isCheckedIn = computed(() => {
    return currentSession.value !== null
  })

  function setSession(sessionData) {
    currentSession.value = sessionData
    isAuthenticated.value = true
  }

  function clearSession() {
    currentSession.value = null
    isAuthenticated.value = false
    offlineInvoices.value = []
  }

  function setOfflineInvoices(invoices) {
    offlineInvoices.value = invoices
  }

  return {
    isAuthenticated,
    currentSession,
    offlineInvoices,
    isCheckedIn,
    setSession,
    clearSession,
    setOfflineInvoices
  }
})