<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with gradient pattern -->
    <header class="fixed top-0 left-0 right-0 z-10">
      <!-- Main Header -->
      <div class="bg-gradient-to-r from-navy-800 to-navy-600 relative overflow-hidden px-4 py-3">
        <!-- Decorative diagonal lines -->
        <div class="absolute inset-0" style="opacity: 0.1">
          <div class="absolute inset-0" style="background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%); background-size: 10px 10px;"></div>
        </div>
        
        <!-- Abstract shapes -->
        <div class="absolute inset-0" style="opacity: 0.1">
          <div class="absolute top-0 left-0 w-20 h-20 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"></div>
          <div class="absolute top-1/2 right-0 w-16 h-16 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full"></div>
        </div>

        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Truck class="w-6 h-6 text-white" />
            <h1 class="text-lg font-bold text-white">Form Pengiriman</h1>
          </div>
          <button 
            @click="submitForm"
            class="bg-white text-navy-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-100"
          >
            <Send class="w-4 h-4" />
            Kirim
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white border-b border-gray-200">
        <div class="flex h-10">
          <button 
            @click="activeTab = 'form'"
            class="flex-1 text-xs font-medium border-b-2"
            :class="activeTab === 'form' 
              ? 'border-navy-500 text-navy-800' 
              : 'border-transparent text-gray-500'"
          >
            <div class="flex items-center justify-center gap-1.5">
              <ClipboardList class="w-4 h-4" />
              Form
            </div>
          </button>
          <button 
            @click="activeTab = 'attachments'"
            class="flex-1 text-xs font-medium border-b-2"
            :class="activeTab === 'attachments' 
              ? 'border-navy-500 text-navy-800' 
              : 'border-transparent text-gray-500'"
          >
            <div class="flex items-center justify-center gap-1.5">
              <Camera class="w-4 h-4" />
              Lampiran
            </div>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-[104px] pb-20 px-4">
      <!-- Form Tab -->
      <div v-show="activeTab === 'form'" class="space-y-6">
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

        <!-- Driver Info -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Nama Driver
            </label>
            <input 
              v-model="formData.namaDriver"
              type="text"
              class="form-input"
              :class="{ 'error': errors.namaDriver }"
              required
            />
            <span v-if="errors.namaDriver" class="text-xs text-red-600">{{ errors.namaDriver }}</span>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Nama Helper
            </label>
            <input 
              v-model="formData.namaHelper"
              type="text"
              class="form-input"
              :class="{ 'error': errors.namaHelper }"
              required
            />
            <span v-if="errors.namaHelper" class="text-xs text-red-600">{{ errors.namaHelper }}</span>
          </div>

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
        </div>

        <!-- Delivery Info -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Waktu Pengiriman
            </label>
            <div 
              class="relative bg-white rounded-lg border border-gray-300"
              :class="{ 'border-red-500': errors.waktuPengiriman }"
              @click="showDatePicker = true"
            >
              <div class="py-3 px-4 flex justify-between items-center">
                <span :class="formData.waktuPengiriman ? 'text-gray-900' : 'text-gray-500'">
                  {{ formData.waktuPengiriman ? formatDateTime(formData.waktuPengiriman) : 'Pilih Waktu' }}
                </span>
                <Calendar class="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <span v-if="errors.waktuPengiriman" class="text-xs text-red-600">{{ errors.waktuPengiriman }}</span>
          </div>

          <!-- No Faktur -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              No Faktur
            </label>
            <div 
              class="relative bg-white rounded-lg border border-gray-300"
              :class="{ 'border-red-500': errors.noFaktur }"
              @click="showFakturPicker = true"
            >
              <div class="py-3 px-4 flex justify-between items-center">
                <span :class="formData.noFaktur ? 'text-gray-900' : 'text-gray-500'">
                  {{ formData.noFaktur || 'Pilih No Faktur' }}
                </span>
                <Search class="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <span v-if="errors.noFaktur" class="text-xs text-red-600">{{ errors.noFaktur }}</span>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Nama Toko
            </label>
            <input 
              v-model="formData.namaToko"
              type="text"
              class="form-input"
              :class="{ 'error': errors.namaToko }"
              required
              :disabled="!!formData.noFaktur"
            />
            <span v-if="errors.namaToko" class="text-xs text-red-600">{{ errors.namaToko }}</span>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Alamat Toko
            </label>
            <textarea 
              v-model="formData.alamatToko"
              rows="3"
              class="form-input"
              :class="{ 'error': errors.alamatToko }"
              required
              :disabled="!!formData.noFaktur"
            ></textarea>
            <span v-if="errors.alamatToko" class="text-xs text-red-600">{{ errors.alamatToko }}</span>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Nilai Dibayarkan
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <input 
                v-model="formData.nilaiFaktur"
                type="number"
                class="form-input pl-12"
                :class="{ 'error': errors.nilaiFaktur }"
                required
                :disabled="!!formData.noFaktur"
              />
            </div>
            <span v-if="errors.nilaiFaktur" class="text-xs text-red-600">{{ errors.nilaiFaktur }}</span>
            <p class="text-xs text-gray-500 mt-1">Input nominal tanpa tanda titik atau koma</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Pembayaran
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                v-for="method in paymentMethods" 
                :key="method"
                type="button"
                @click="formData.pembayaran = method"
                class="relative py-3 px-4 rounded-lg text-sm font-medium border"
                :class="[
                  formData.pembayaran === method 
                    ? 'bg-navy-50 border-navy-500 text-navy-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                ]"
              >
                {{ method }}
                <CheckCircle2 
                  v-if="formData.pembayaran === method"
                  class="absolute top-1 right-1 w-4 h-4 text-green-500"
                />
              </button>
            </div>
            <span v-if="errors.pembayaran" class="text-xs text-red-600">{{ errors.pembayaran }}</span>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 block">
              Status
            </label>
            <div class="space-y-2">
              <button 
                v-for="stat in statusList" 
                :key="stat"
                type="button"
                @click="formData.status = stat"
                class="relative w-full py-3 px-4 rounded-lg text-sm font-medium border text-left"
                :class="[
                  formData.status === stat 
                    ? 'bg-navy-50 border-navy-500 text-navy-700' 
                    : 'bg-white border-gray-300 text-gray-700'
                ]"
              >
                {{ stat }}
                <CheckCircle2 
                  v-if="formData.status === stat"
                  class="absolute top-1/2 right-3 w-5 h-5 -translate-y-1/2 text-green-500"
                />
              </button>
            </div>
            <span v-if="errors.status" class="text-xs text-red-600">{{ errors.status }}</span>
          </div>
        </div>
      </div>

      <!-- Attachments Tab -->
      <div v-show="activeTab === 'attachments'" class="space-y-6">
        <!-- Checkin Photo -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">
            Foto Check-in
          </label>
          <p class="text-xs text-gray-500">Foto Outlet dari Depan. Kelihatan Bangunan dan Nama Toko</p>
          <PhotoUpload
            v-model="formData.checkinPhoto"
            :store-info="true"
            :store-name="formData.namaToko"
            :plate-number="formData.noPolisi"
          />
          <span v-if="errors.checkinPhoto" class="text-xs text-red-600">{{ errors.checkinPhoto }}</span>
        </div>

        <!-- Delivery Photo -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">
            Foto Serah Terima Barang
          </label>
          <p class="text-xs text-gray-500">Foto Serah Terima Barang</p>
          <PhotoUpload
            v-model="formData.deliveryPhoto"
            :store-info="true"
            :store-name="formData.namaToko"
            :plate-number="formData.noPolisi"
          />
          <span v-if="errors.deliveryPhoto" class="text-xs text-red-600">{{ errors.deliveryPhoto }}</span>
        </div>

        <!-- Payment Photo -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 block">
            Foto Serah Terima Uang dan Faktur
          </label>
          <p class="text-xs text-gray-500">Foto Serah Terima Uang dan Faktur</p>
          <PhotoUpload
            v-model="formData.paymentPhoto"
            :store-info="true"
            :store-name="formData.namaToko"
            :plate-number="formData.noPolisi"
          />
          <span v-if="errors.paymentPhoto" class="text-xs text-red-600">{{ errors.paymentPhoto }}</span>
        </div>
      </div>
    </main>

    <!-- Mobile Pickers -->
    <!-- Cabang Picker -->
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
            v-for="cabang in branchList"
            :key="cabang.name"
            @click="selectCabang(cabang)"
            class="w-full py-3 px-4 text-left text-sm rounded-lg hover:bg-gray-50"
            :class="formData.cabang === cabang.name ? 'text-navy-600 font-medium' : 'text-gray-700'"
          >
            {{ cabang.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Date Picker -->
    <div 
      v-if="showDatePicker"
      class="fixed inset-0 bg-black bg-opacity-50 z-50"
      @click="showDatePicker = false"
    >
      <div 
        class="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-4"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Pilih Waktu</h3>
          <button @click="showDatePicker = false">
            <X class="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <input 
          type="datetime-local"
          v-model="formData.waktuPengiriman"
          class="w-full text-lg p-4 mb-4"
          @change="showDatePicker = false"
        />
      </div>
    </div>

    <!-- Faktur Picker -->
    <div 
      v-if="showFakturPicker"
      class="fixed inset-0 bg-white z-50"
    >
      <div class="flex flex-col h-full">
        <!-- Picker Header -->
        <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
          <button @click="showFakturPicker = false">
            <ArrowLeft class="w-6 h-6 text-gray-500" />
          </button>
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="fakturSearch"
              type="text"
              placeholder="Cari No Faktur"
              class="w-full pl-10 pr-4 py-2 border-0 focus:ring-0 text-base"
              autofocus
            />
          </div>
        </div>

        <!-- Faktur List -->
        <div class="flex-1 overflow-y-auto">
          <div class="divide-y divide-gray-200">
            <button
              v-for="faktur in filteredFakturList"
              :key="faktur.no"
              @click="selectFaktur(faktur)"
              class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <div class="flex flex-col items-start">
                <span class="text-sm font-medium text-gray-900">{{ faktur.no || 'No Faktur' }}</span>
                <span class="text-xs text-gray-500">{{ faktur.date || '-' }}</span>
              </div>
              <span class="text-sm text-gray-700">
                Rp {{ formatCurrency(faktur.amount) }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGeolocation } from './composables/useGeolocation'
import { usePhotoWithMetadata } from './composables/usePhotoWithMetadata'
import { fetchBranchConfig, fetchInvoiceData, fetchVehicleData, submitForm as submitFormToAPI } from './services/api'
import { 
  Send, 
  ChevronDown, 
  Camera, 
  Calendar,
  ClipboardList,
  X,
  CheckCircle2,
  Search,
  ArrowLeft,
  Truck
} from 'lucide-vue-next'
import PhotoUpload from './components/PhotoUpload.vue'

const activeTab = ref('form')
const showCabangPicker = ref(false)
const showDatePicker = ref(false)
const showFakturPicker = ref(false)
const fakturSearch = ref('')
const errors = ref({})

const branchList = ref([])
const availablePlates = ref([])
const fakturList = ref([])

const paymentMethods = ['TUNAI', 'TRANSFER', 'KREDIT']
const statusList = [
  'DITERIMA - SEMUA',
  'DITERIMA - SEBAGIAN',
  'BATAL - TOKO TUTUP'
]

const { coords, error: geoError } = useGeolocation()
const { addWatermark } = usePhotoWithMetadata()

const formData = ref({
  cabang: '',
  namaDriver: '',
  namaHelper: '',
  noPolisi: '',
  waktuPengiriman: '',
  namaToko: '',
  alamatToko: '',
  noFaktur: '',
  nilaiFaktur: '',
  pembayaran: 'TUNAI',
  status: 'DITERIMA - SEMUA',
  checkinPhoto: null,
  deliveryPhoto: null,
  paymentPhoto: null
})

function formatCurrency(amount) {
  if (typeof amount !== 'number') return '0'
  return amount.toLocaleString('id-ID')
}

const filteredFakturList = computed(() => {
  if (!fakturSearch.value) return fakturList.value || []
  const search = fakturSearch.value.toLowerCase()
  return (fakturList.value || []).filter(faktur => {
    if (!faktur) return false
    return (
      (faktur.no || '').toLowerCase().includes(search) ||
      (faktur.amount?.toString() || '').includes(search) ||
      (faktur.store?.name || '').toLowerCase().includes(search)
    )
  })
})

onMounted(async () => {
  try {
    // Set default datetime
    const now = new Date()
    formData.value.waktuPengiriman = now.toISOString().slice(0, 16)
    
    // Fetch initial data
    const [branchData] = await Promise.all([
      fetchBranchConfig()
    ])
    
    branchList.value = branchData || []

  } catch (error) {
    console.error('Error initializing form:', error)
  }
})

function formatDateTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

async function selectCabang(branch) {
  if (!branch) return
  formData.value.cabang = branch.name || ''
  // Fetch vehicle data based on the selected branch
  const vehicleData = await fetchVehicleData(branch.name);
  availablePlates.value = vehicleData || []
  formData.value.noPolisi = '' // Reset plate number when branch changes
  showCabangPicker.value = false
}

function selectFaktur(faktur) {
  if (!faktur) return
  formData.value.noFaktur = faktur.no || ''
  formData.value.nilaiFaktur = faktur.amount || 0
  formData.value.namaToko = faktur.store?.name || ''
  formData.value.alamatToko = faktur.store?.address || ''
  showFakturPicker.value = false
}

function validateForm() {
  errors.value = {}
  
  // Required fields validation
  const requiredFields = {
    cabang: 'Cabang harus dipilih',
    namaDriver: 'Nama Driver harus diisi',
    namaHelper: 'Nama Helper harus diisi',
    noPolisi: 'No Polisi harus dipilih',
    waktuPengiriman: 'Waktu Pengiriman harus diisi',
    namaToko: 'Nama Toko harus diisi',
    alamatToko: 'Alamat Toko harus diisi',
    nilaiFaktur: 'Nilai Faktur harus diisi',
    pembayaran: 'Metode Pembayaran harus dipilih',
    status: 'Status harus dipilih',
    checkinPhoto: 'Foto Check-in harus diupload',
    deliveryPhoto: 'Foto Serah Terima Barang harus diupload',
    paymentPhoto: 'Foto Serah Terima Uang dan Faktur harus diupload'
  }

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!formData.value[field]) {
      errors.value[field] = message
    }
  }

  return Object.keys(errors.value).length === 0
}

async function submitForm() {
  if (!validateForm()) {
    activeTab.value = Object.keys(errors.value).some(key => 
      ['checkinPhoto', 'deliveryPhoto', 'paymentPhoto'].includes(key)
    ) ? 'attachments' : 'form'
    return
  }

  try {
    const result = await submitFormToAPI({
      ...formData.value,
      location: coords.value
    })
    
    if (result.success) {
      alert('Form berhasil dikirim!')
      // Reset form
      formData.value = {
        cabang: '',
        namaDriver: '',
        namaHelper: '',
        noPolisi: '',
        waktuPengiriman: new Date().toISOString().slice(0, 16),
        namaToko: '',
        alamatToko: '',
        noFaktur: '',
        nilaiFaktur: '',
        pembayaran: 'TUNAI',
        status: 'DITERIMA - SEMUA',
        checkinPhoto: null,
        deliveryPhoto: null,
        paymentPhoto: null
      }
      activeTab.value = 'form'
    } else {
      alert('Gagal mengirim form: ' + result.message)
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Terjadi kesalahan saat mengirim form')
  }
}
</script>