<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-8">
    <div class="max-w-5xl mx-auto bg-white p-4 rounded shadow">
      <h1 class="text-2xl font-bold text-center mb-6 text-gray-700">Smart Warung 🛒</h1>
      <ProductManager />
    </div>
  </div>
</template>

<script setup>
import ProductManager from './components/ProductManager.vue'
</script>
