<template>
  <div class="flex items-center justify-center h-screen bg-gray-500">
    <div class="w-80">
      <form @submit.prevent="handleSubmit" class="max-w-sm mx-auto">
        <div class="mb-5">
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
          <input type="text" id="name" v-model="name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Digite seu nome" required />
          <span v-if="nameError" class="text-red-500 text-sm">{{ nameError }}</span>
        </div>
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
          <input type="email" id="email" v-model="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@email.com" required />
          <span v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</span>
        </div>
        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
          <input type="password" id="password" v-model="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Digite sua senha"
            required />
          <span v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</span>
        </div>

        <button type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Registrar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}

const nameError = computed(() => {
  return name.value.length >= 4 ? '' : 'O nome deve ter no mínimo 4 caracteres.'
})

const emailError = computed(() => {
  return validateEmail(email.value) ? '' : 'Formato de email inválido.'
})

const passwordError = computed(() => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
  return re.test(password.value) ? '' : 'A senha deve conter letras, números e um caractere especial.'
})

const config = useRuntimeConfig()
const API_URL = config.public.apiUrl

const handleSubmit = async () => {
  if (nameError.value || emailError.value || passwordError.value) {
    return
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    })

    if (!response.ok) {
      throw new Error('Falha ao registrar')
    }

    const data = await response.json()

    // Aqui você pode redirecionar ou fazer algo com o resultado do registro
    console.log('Usuário registrado com sucesso:', data)

    // Limpa os campos após o registro bem-sucedido
    name.value = ''
    email.value = ''
    password.value = ''

    router.push('/')

  } catch (error) {
    console.error('Erro durante o registro:', error)
    alert('Erro durante o registro. Tente novamente.')
  }
}
</script>
