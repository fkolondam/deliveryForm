<template>
  <div 
    class="border-2 border-dashed border-gray-300 rounded-lg p-4"
    :class="{ 'border-blue-500 bg-blue-50': isDragging }"
    @dragenter.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <div v-if="!modelValue" class="text-center">
      <Camera class="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <label 
        :for="inputId"
        class="text-sm text-blue-600 font-medium cursor-pointer"
      >
        Pilih Foto
      </label>
      <input 
        :id="inputId"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handlePhotoSelect"
      />
      <p class="text-xs text-gray-500 mt-1">atau drag and drop foto disini</p>
    </div>
    <div v-else class="space-y-3">
      <img 
        :src="modelValue" 
        class="w-full h-48 object-cover rounded-lg"
        alt="Preview"
      />
      <div v-if="storeInfo" class="bg-black bg-opacity-75 text-white text-xs p-2 rounded">
        <p>Timestamp: {{ currentTimestamp }}</p>
        <p>Location: {{ demoLocation }}</p>
        <p>Toko: {{ storeName || 'Nama Toko' }}</p>
        <p>No Polisi: {{ plateNumber || 'No Polisi' }}</p>
      </div>
      <button 
        type="button"
        @click="retakePhoto"
        class="w-full py-2 px-4 bg-red-600 text-white rounded-lg text-sm font-medium"
      >
        Ambil Ulang Foto
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Camera } from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  storeInfo: {
    type: Boolean,
    default: false
  },
  storeName: String,
  plateNumber: String
})

const emit = defineEmits(['update:modelValue'])

const isDragging = ref(false)
const currentTimestamp = ref(new Date().toLocaleString())
const demoLocation = ref('0.5163° N, 101.4478° E')
const inputId = `photo-upload-${Math.random().toString(36).substr(2, 9)}`

function handlePhotoSelect(event) {
  const file = event.target.files[0]
  if (file) {
    previewImage(file)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    previewImage(file)
  }
}

function previewImage(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:modelValue', e.target.result)
    currentTimestamp.value = new Date().toLocaleString()
  }
  reader.readAsDataURL(file)
}

function retakePhoto() {
  emit('update:modelValue', null)
  const input = document.getElementById(inputId)
  if (input) input.value = ''
}
</script>