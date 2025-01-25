<template>
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div class="flex justify-around">
        <router-link 
          to="/checkin" 
          class="flex flex-col items-center py-2 px-4"
          :class="route.path === '/checkin' ? 'text-navy-600' : 'text-gray-500'"
        >
          <DoorOpen class="w-6 h-6" />
          <span class="text-xs mt-1">{{ isCheckedIn ? 'Check Out' : 'Check In' }}</span>
        </router-link>
        
        <router-link 
          to="/delivery" 
          class="flex flex-col items-center py-2 px-4"
          :class="[
            route.path === '/delivery' ? 'text-navy-600' : 'text-gray-500',
            !isCheckedIn ? 'pointer-events-none opacity-50' : ''
          ]"
        >
          <Truck class="w-6 h-6" />
          <span class="text-xs mt-1">Pengiriman</span>
        </router-link>
        
        <router-link 
          to="/expenses" 
          class="flex flex-col items-center py-2 px-4"
          :class="[
            route.path === '/expenses' ? 'text-navy-600' : 'text-gray-500',
            !isCheckedIn ? 'pointer-events-none opacity-50' : ''
          ]"
        >
          <Receipt class="w-6 h-6" />
          <span class="text-xs mt-1">Pengeluaran</span>
        </router-link>
        
        <router-link 
          to="/profile" 
          class="flex flex-col items-center py-2 px-4"
          :class="route.path === '/profile' ? 'text-navy-600' : 'text-gray-500'"
        >
          <User class="w-6 h-6" />
          <span class="text-xs mt-1">Profile</span>
        </router-link>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import { useSessionStore } from '../stores/session'
  import { DoorOpen, Truck, Receipt, User } from 'lucide-vue-next'
  
  const route = useRoute()
  const sessionStore = useSessionStore()
  
  const isCheckedIn = computed(() => sessionStore.isCheckedIn)
  </script>