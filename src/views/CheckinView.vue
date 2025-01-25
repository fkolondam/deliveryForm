<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header -->
      <header class="bg-gradient-to-r from-navy-800 to-navy-600 px-4 py-3">
        <div class="flex items-center gap-2">
          <DoorOpen class="w-6 h-6 text-white" />
          <h1 class="text-lg font-bold text-white">Check In</h1>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="flex-1 p-4">
        <div class="space-y-6">
          <!-- Cabang -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Cabang
            </label>
            <div 
              class="relative bg-white rounded-lg border border-gray-300"
              :class="{ 'border-red-500': errors.cabang }"
              @click="showCabangPicker = true"
            >
              <div class="py-3 px-4 flex justify-between items-center">
                <span :class="formData.cabang ? 'text-gray-900' : 'text-gray-500'">
                  {{ formData.cabang || 'Pilih Cabang' }}
                </span>
                <ChevronDown class="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <span v-if="errors.cabang" class="text-xs text-red-600">{{ errors.cabang }}</span>
          </div>
  
          <!-- No Polisi -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              No Polisi Armada
            </label>
            <select
              v-model="formData.noPolisi"
              class="form-input"
              :class="{ 'error': errors.noPolisi }"
              required
            >
              <option value="">Pilih No Polisi</option>
              <option v-for="plate in availablePlates" :key="plate" :value="plate">
                {{ plate }}
              </option>
            </select>
            <span v-if="errors.noPolisi" class="text-xs text-red-600">{{ errors.noPolisi }}</span>
          </div>
  
          <!-- Odometer -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Odometer (KM)
            </label>
            <input 
              v-model="formData.odometer"
              type="number"
              class="form-input"
              :class="{ 'error': errors.odometer }"
              placeholder="Masukkan angka odometer"
              required
            />
            <span v-if="errors.odometer" class="text-xs text-red-600">{{ errors.odometer }}</span>
          </div>
  
          <!-- Foto Odometer -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Foto Odometer
            </label>
            <PhotoUpload
              v-model="formData.odometerPhoto"
              :store-info="false"
            />
            <span v-if="errors.odometerPhoto" class="text-xs text-red-600">{{ errors.odometerPhoto }}</span>
          </div>
  
          <!-- Location Status -->
          <div class="p-4 rounded-lg" :class="locationStatus.bgColor">
            <div class="flex items-start gap-3">
              <MapPin class="w-5 h-5 mt-0.5" :class="locationStatus.iconColor" />
              <div>
                <p class="font-medium" :class="locationStatus.textColor">
                  {{ locationStatus.message }}
                </p>
                <p class="text-sm text-gray-600" v-if="locationStatus.detail">
                  {{ locationStatus.detail }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Bottom Action -->
      <div class="p-4 bg-white border-t border-gray-200">
        <button 
          @click="handleCheckIn"
          class="w-full bg-navy-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
          :disabled="!isLocationValid || isLoading"
        >
          <span v-if="isLoading">Memproses...</span>
          <span v-else>Check In</span>
        </button>
      </div>
  
      <!-- Cabang Picker Modal -->
      <div 
        v-if="showCabangPicker"
        class="fixed inset-0 bg-black bg-opacity-50 z-50"
        @click="showCabangPicker = false"
      >
        <div 
          class="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4"
          @click.stop
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Pilih Cabang</h3>
            <button @click="showCabangPicker = false">
              <X class="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div class="space-y-2 max-h-[60vh] overflow-y-auto">
            <button
              v-for="branch in branchList"
              :key="branch.name"
              @click="selectCabang(branch)"
              class="w-full py-3 px-4 text-left text-sm rounded-lg hover:bg-gray-50"
              :class="formData.cabang === branch.name ? 'text-navy-600 font-medium' : 'text-gray-700'"
            >
              {{ branch.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSessionStore } from '../stores/session'
  import { useGeolocation } from '../composables/useGeolocation'
  import { fetchBranchConfig, fetchVehicleData, fetchInvoiceData, submitCheckIn } from '../services/api'
  import { DoorOpen, ChevronDown, X, MapPin } from 'lucide-vue-next'
  import PhotoUpload from '../components/PhotoUpload.vue'
  
  const router = useRouter()
  const sessionStore = useSessionStore()
  const { coords, error: geoError } = useGeolocation()
  
  const showCabangPicker = ref(false)
  const isLoading = ref(false)
  const errors = ref({})
  
  const branchList = ref([])
  const availablePlates = ref([])
  const selectedBranchGeoFence = ref(null)
  
  const formData = ref({
    cabang: '',
    noPolisi: '',
    odometer: '',
    odometerPhoto: null,
    checkInTime: null,
    location: null
  })
  
  const locationStatus = computed(() => {
    if (!coords.value) {
      return {
        message: 'Mendapatkan lokasi...',
        bgColor: 'bg-gray-100',
        iconColor: 'text-gray-400',
        textColor: 'text-gray-600'
      }
    }
  
    if (geoError.value) {
      return {
        message: 'Gagal mendapatkan lokasi',
        detail: geoError.value,
        bgColor: 'bg-red-100',
        iconColor: 'text-red-500',
        textColor: 'text-red-700'
      }
    }
  
    if (!selectedBranchGeoFence.value) {
      return {
        message: 'Pilih cabang terlebih dahulu',
        bgColor: 'bg-gray-100',
        iconColor: 'text-gray-400',
        textColor: 'text-gray-600'
      }
    }
  
    const isInGeofence = checkGeofence(
      coords.value,
      selectedBranchGeoFence.value
    )
  
    return isInGeofence ? {
      message: 'Lokasi valid',
      detail: 'Anda berada di area cabang',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500',
      textColor: 'text-green-700'
    } : {
      message: 'Lokasi tidak valid',
      detail: 'Anda berada di luar area cabang',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-500',
      textColor: 'text-red-700'
    }
  })
  
  const isLocationValid = computed(() => {
    return locationStatus.value.iconColor === 'text-green-500'
  })
  
  onMounted(async () => {
    try {
      const branchData = await fetchBranchConfig()
      branchList.value = branchData || []
    } catch (error) {
      console.error('Error initializing form:', error)
    }
  })
  
  async function selectCabang(branch) {
    if (!branch) return
    formData.value.cabang = branch.name || ''
    selectedBranchGeoFence.value = {
      lat: branch.coordinates?.lat,
      long: branch.coordinates?.long,
      radius: 100 // Radius dalam meter
    }
    
    try {
      const vehicleData = await fetchVehicleData(branch.name)
      availablePlates.value = vehicleData.map(vehicle => vehicle.licensePlate) || []
    } catch (error) {
      console.error('Error fetching vehicle data:', error)
    }
    
    formData.value.noPolisi = ''
    showCabangPicker.value = false
  }
  
  function checkGeofence(userCoords, geofence) {
    if (!userCoords || !geofence) return false
    
    const R = 6371e3 // Earth's radius in meters
    const φ1 = userCoords.latitude * Math.PI/180
    const φ2 = geofence.lat * Math.PI/180
    const Δφ = (geofence.lat - userCoords.latitude) * Math.PI/180
    const Δλ = (geofence.long - userCoords.longitude) * Math.PI/180
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
  
    return distance <= geofence.radius
  }
  
  function validateForm() {
    errors.value = {}
    
    const requiredFields = {
      cabang: 'Cabang harus dipilih',
      noPolisi: 'No Polisi harus dipilih',
      odometer: 'Odometer harus diisi',
      odometerPhoto: 'Foto Odometer harus diupload'
    }
  
    for (const [field, message] of Object.entries(requiredFields)) {
      if (!formData.value[field]) {
        errors.value[field] = message
      }
    }
  
    if (!isLocationValid.value) {
      errors.value.location = 'Lokasi tidak valid'
    }
  
    return Object.keys(errors.value).length === 0
  }
  
  async function handleCheckIn() {
    if (!validateForm()) return
    
    isLoading.value = true
    
    try {
      // Prepare check-in data
      const checkInData = {
        ...formData.value,
        checkInTime: new Date().toISOString(),
        location: coords.value
      }
      
      // Submit check-in
      const result = await submitCheckIn(checkInData)
      
      if (result.success) {
        // Set session data
        sessionStore.setSession({
          cabang: formData.value.cabang,
          noPolisi: formData.value.noPolisi,
          checkInTime: checkInData.checkInTime
        })
        
        // Fetch and store offline invoice data
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 3)
        
        const invoices = await fetchInvoiceData(
          formData.value.cabang,
          threeMonthsAgo.toISOString()
        )
        
        sessionStore.setOfflineInvoices(invoices)
        
        // Redirect to home
        router.push('/delivery')
      } else {
        alert('Gagal melakukan check in: ' + result.message)
      }
    } catch (error) {
      console.error('Error during check in:', error)
      alert('Terjadi kesalahan saat check in')
    } finally {
      isLoading.value = false
    }
  }
  </script>