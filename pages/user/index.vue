<template>
  <Sidebar>
    <div v-if="!loading">
      <h1 class="text-2xl font-bold border-b-2 w-fit">Perfil do usuário</h1>
      <div class="mt-6 space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Nome: </label>
          <p class="text-sm">{{ profile.name }}</p>
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">E-mail: </label>
          <p class="text-sm">{{ profile.email }}</p>
        </div>
      </div>
      <div class="mt-6">
        <h1 class="text-xl font-semibold">Minha Coleção</h1>
        <div v-if="profile.cards.length !== 0" class="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="card in profile.cards" :key="card.id" class="bg-white rounded-lg shadow-md p-4">
            <img :src="card.imageUrl" alt="Card Image" class="w-full h-full object-cover rounded-t-lg">
          </div>
        </div>
        <div v-else class="mt-4">
          <p>Você ainda não tem cartas em sua coleção...</p>
        </div>
      </div>
    </div>
    <Loading v-else />
  </Sidebar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/sidebar.vue'
import Loading from '@/components/loading.vue'

const profile = ref({
  name: '',
  email: '',
  cards: []
})
const loading = ref(true)

const fetchProfile = async () => {
  try {
    loading.value = true
    const response = await fetch('https://cards-marketplace-api.onrender.com/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    profile.value = data
  } catch (error) {
    console.error('Error fetching profile:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped></style>
