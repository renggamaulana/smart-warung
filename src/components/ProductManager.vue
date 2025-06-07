<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore'
  import { db } from '../firebase.js'

  const form = ref({ name: '', price: '', category: '', unit: '' })
  const products = ref([])
  const isEditing = ref(false)
  const currentId = ref(null)

  const satuanList = [
      'pcs', 'ikat', 'butir', 'liter', 'bungkus', 'per ons', '1/4 kg', '1/2 kg', '1 kg', 
  ]

  const colRef = collection(db, 'products')

  onMounted(() => {
      onSnapshot(colRef, (snapshot) => {
      products.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      })
  })

  const searchQuery = ref('')

  const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
    return products.value.filter(product =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })


  async function saveProduct() {
    if (!form.value.name || !form.value.price || !form.value.category || !form.value.unit) {
      alert("Semua field wajib diisi");
      return;
    }

    if (isEditing.value) {
      const docRef = doc(db, 'products', currentId.value);
      await updateDoc(docRef, { ...form.value });
      isEditing.value = false;
      currentId.value = null;
    } else {
      await addDoc(colRef, { ...form.value });
    }

    resetForm();
  }

  function editProduct(item) {
      form.value = { ...item }
      currentId.value = item.id
      isEditing.value = true
  }

  async function deleteProduct(id) {
    const confirmDelete = confirm("Yakin ingin menghapus barang ini?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, 'products', id));
  }


  function resetForm() {
      form.value = { name: '', price: '', category: '', unit: '' }
  }
</script>

<template>
  <div class="space-y-8 p-4 bg-white rounded-xl">
    <!-- Form -->
    <form @submit.prevent="saveProduct" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <input
        v-model="form.name"
        type="text"
        placeholder="Nama Barang"
        class="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <input
        v-model.number="form.price"
        type="number"
        placeholder="Harga"
        class="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <select
        v-model="form.category"
        class="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <option disabled value="">Pilih Kategori</option>
        <option value="sayuran & lauk pauk">Sayuran & Lauk Pauk</option>
        <option value="sembako">Sembako</option>
        <option value="kebutuhan rumah tangga">Kebutuhan Rumah Tangga</option>
        <option value="kebutuhan pribadi">Kebutuhan Pribadi</option>
      </select>

      <select
        v-model="form.unit"
        class="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <option disabled value="">Pilih Satuan</option>
        <option v-for="unit in satuanList" :key="unit" :value="unit">{{ unit }}</option>
      </select>

      <button
        type="submit"
        class="sm:col-span-2 md:col-span-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-xl transition shadow-sm"
      >
        {{ isEditing ? "Update Barang" : "Tambah Barang" }}
      </button>
    </form>

    <!-- Search -->
    <div class="relative w-full sm:w-1/2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari barang..."
        class="border border-gray-300 pl-10 pr-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <span class="absolute left-3 top-3 text-gray-400">🔍</span>
    </div>

    <!-- Card -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in filteredProducts"
        :key="item.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ item.name }}</h3>
          <p class="text-gray-600 mb-1"><strong>Harga:</strong> Rp{{ item.price.toLocaleString('id-ID') }}</p>
          <p class="text-gray-600 mb-1"><strong>Kategori:</strong> {{ item.category }}</p>
          <p class="text-gray-600"><strong>Satuan:</strong> {{ item.unit }}</p>
        </div>
        <div class="mt-4 flex gap-2">
          <button
            @click="editProduct(item)"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg transition"
          >
            Edit
          </button>
          <button
            @click="deleteProduct(item.id)"
            class="flex-1 bg-red-400 hover:bg-red-500 text-white text-sm px-3 py-2 rounded-lg transition"
          >
            Hapus
          </button>
        </div>
      </div>

     <!-- Jika tidak ada data -->
      <div v-if="products.length === 0" class="col-span-full text-center text-gray-400 py-10">
        <div class="flex flex-col items-center justify-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 10-8 0v4a4 4 0 008 0v-4" />
          </svg>
          <p class="text-gray-500 text-sm">Belum ada barang yang ditambahkan</p>
        </div>
      </div>

    </div>

  </div>
</template>
  
  
  
  <style scoped>
  
  </style>
  