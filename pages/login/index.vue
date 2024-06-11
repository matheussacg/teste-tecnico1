<template>
  <div>
    <div className="h-screen flex flex-col items-center justify-center bg-gray-600 gap-8">
      <h1 className="text-lg">Login</h1>
      <form @submit.prevent="handleLogin" class="max-w-sm mx-auto bg-gray-500 p-16 rounded-lg">
        <div className="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
          <input type="email" id="email" v-model="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@email.com" required />
        </div>
        <div className="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
          <input type="password" id="password" v-model="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Digite sua senha"
            required />
        </div>
        <button type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Entrar</button>
      </form>
    </div>
    <nuxt-link to="/register">Registrar-se</nuxt-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'  

const email = ref('')
const password = ref('')
const router = useRouter()
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl 

const handleLogin = async () => {
  try {
    const response = await fetch(`${API_URL}/login`, {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    if (!response.ok) {
      throw new Error('Login falhou')
    }

    const data = await response.json()

    localStorage.setItem('token', data.token)

    router.push('/')

  } catch (error) {
    console.error('Erro durante o login:', error)
    alert('Erro durante o login. Verifique suas credenciais.')
  }
}
</script>
