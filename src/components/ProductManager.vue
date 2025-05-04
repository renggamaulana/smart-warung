<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore'
  import { db } from '../firebase.js'

  const form = ref({ name: '', price: '', category: '', unit: '' })
  const products = ref([])
  const isEditing = ref(false)
  const currentId = ref(null)

  const satuanList = [
      'per ons', '1/4 kg', '1/2 kg', '1 kg', 'ikat', 'butir', 'liter', 'bungkus'
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
    <div class="space-y-6">
      <form @submit.prevent="saveProduct" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <input v-model="form.name" type="text" placeholder="Nama Barang" class="border p-2 rounded w-full" />
        <input v-model.number="form.price" type="number" placeholder="Harga" class="border p-2 rounded w-full" />
        <select v-model="form.category" class="border p-2 rounded w-full">
          <option disabled value="">Pilih Kategori</option>
          <option value="sayuran">Sayuran</option>
          <option value="sembako">Sembako</option>
        </select>
  
        <select v-model="form.unit" class="border p-2 rounded w-full">
          <option disabled value="">Pilih Satuan</option>
          <option v-for="unit in satuanList" :key="unit" :value="unit">{{ unit }}</option>
        </select>
  
        <button type="submit" class="sm:col-span-2 md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          {{ isEditing ? "Update Barang" : "Tambah Barang" }}
        </button>
      </form>

    <div class="relative w-full sm:w-1/2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari barang..."
        class="border pl-10 pr-3 py-2 rounded w-full"
      />
        <span class="absolute left-3 top-2.5 text-gray-400">
            🔍
        </span>
    </div>


  
    <div class="overflow-x-auto">
        <table class="w-full text-left border">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-2 border">Nama</th>
              <th class="p-2 border">Harga</th>
              <th class="p-2 border">Kategori</th>
              <th class="p-2 border">Satuan</th>
              <th class="p-2 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredProducts" :key="item.id" class="hover:bg-gray-50">
              <td class="p-2 border">{{ item.name }}</td>
              <td class="p-2 border">Rp{{ item.price.toLocaleString('id-ID') }}</td>
              <td class="p-2 border capitalize">{{ item.category }}</td>
              <td class="p-2 border">{{ item.unit }}</td>
              <td class="p-2 border text-center space-x-2">
                <button @click="editProduct(item)" class="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                <button @click="deleteProduct(item.id)" class="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="5" class="text-center text-gray-400 py-4">Belum ada barang</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  
  
  <style scoped>
  
  </style>
  