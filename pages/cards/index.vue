<template>
    <Sidebar>
        <div v-if="!loading">
            <h1 class="text-2xl font-bold border-b-2 w-fit">Cartas</h1>
            <div class="mt-6">
                <h1 class="text-xl font-semibold">Adicione cartas a sua coleção:</h1>
                <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div v-for="card in paginatedCards" :key="card.id"
                        class="bg-white rounded-lg shadow-md p-4 flex flex-col">
                        <img :src="card.imageUrl" alt="Card Image" class="w-full h-full object-cover rounded-t-lg">
                        <button @click="addCard(card.id)"
                            class="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg">Adicionar</button>
                    </div>
                </div>
                <div class="mt-4 flex justify-center">
                    <button @click="prevPage" :disabled="page === 1"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Anterior</button>
                    <button @click="nextPage" :disabled="!hasNextPage"
                        class="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">Próximo</button>
                </div>
            </div>
        </div>
        <Loading v-else />
        <ToastSuccess v-if="showSuccessToast" :success-message="successMessage" @close="showSuccessToast = false"
            class="fixed bottom-5 right-5" />
        <ToastError v-if="showErrorToast" :error-message="errorMessage" @close="showErrorToast = false"
            class="fixed bottom-5 right-5" />
    </Sidebar>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from '@/components/sidebar.vue'
import Loading from '@/components/loading.vue'
import ToastSuccess from '@/components/toast-success.vue'
import ToastError from '@/components/toast-error.vue'

const cards = ref([])
const rpp = 8
const page = ref(1)
const hasNextPage = ref(false)
const loading = ref(true)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const isWindowDefined = () => typeof window !== 'undefined'

const fetchCards = async () => {
    try {
        loading.value = true
        const response = await fetch(`https://cards-marketplace-api.onrender.com/cards?rpp=100&page=1`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        cards.value = data.list.filter(card => card.imageUrl)
        updatePagination()
    } catch (error) {
        showErrorToast.value = true
        errorMessage.value = error.message || 'Erro desconhecido'
        setTimeout(() => {
            showErrorToast.value = false
        }, 5000)
    } finally {
        loading.value = false
    }
}

const addCard = async (uuid) => {
    try {
        const response = await fetch(`https://cards-marketplace-api.onrender.com/me/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                cardIds: [uuid]
            })
        })

        showSuccessToast.value = true
        successMessage.value = 'Carta adicionada a sua coleção!'
        setTimeout(() => {
            showSuccessToast.value = false
        }, 3000)

    } catch (error) {
        console.error('Error adding card:', error)
    }
}

const updatePagination = () => {
    const totalCards = filteredCards.value.length
    const startIndex = (page.value - 1) * rpp
    const endIndex = startIndex + rpp
    paginatedCards.value = filteredCards.value.slice(startIndex, endIndex)
    hasNextPage.value = endIndex < totalCards

    if (isWindowDefined()) {
        const queryParams = new URLSearchParams(window.location.search)
        queryParams.set('page', page.value)
        window.history.replaceState({}, '', `${window.location.pathname}?${queryParams.toString()}`)
    }
}

const prevPage = () => {
    if (page.value > 1) {
        page.value--
        updatePagination()
    }
}

const nextPage = () => {
    if (hasNextPage.value) {
        page.value++
        updatePagination()
    }
}

const filteredCards = computed(() => cards.value)
const paginatedCards = ref([])

onMounted(() => {
    fetchCards()
    if (isWindowDefined()) {
        page.value = parseInt(new URLSearchParams(window.location.search).get('page')) || 1
    }
})

watch(page, updatePagination)
</script>

<style scoped>
button[disabled] {
    background-color: #e0e0e0;
    cursor: not-allowed;
}
</style>
