<template>
  <div>
    <div v-for="item in items" :key="item.id" class="item-container" @click="onItemClick(item)">
      <div class="item-content">
        <div class="item-data">
          <span class="item-key"></span> <span class="item-value">{{ item.data.Объект }}</span>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-container">
      <div class="modal-content">
        <div v-html="modalMessage"></div>
        <button @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';

const items = ref<Array<Item>>([]);
const isModalOpen = ref<boolean>(false);
const modalMessage = ref<string>('');

interface Data {
  [key: string]: string | number;
}

interface Item {
  id: number;
  data: Data;
}

interface Database {
  items: Item[];
}

function loadFromLocalStorage(): Database {
  const savedData = localStorage.getItem('myAppDatabase');
  return savedData ? JSON.parse(savedData) : { items: [] };
}


const updateItems = () => {
  const database = loadFromLocalStorage();
  items.value = database.items;
};


window.addEventListener('updateData', updateItems);


const updateDataEvent = new Event('updateData');

const notifyDataChange = () => {
  window.dispatchEvent(updateDataEvent);
};


window.addEventListener('storage', (event) => {
  if (event.key === 'myAppDatabase') {
    notifyDataChange();
  }
});

onBeforeMount(updateItems);

const onItemClick = (item: Item) => {
  let formattedData = '';
  for (const key in item.data) {
    formattedData += `${key}: ${item.data[key]}<br>`;
  }
  modalMessage.value = formattedData;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>


<style>
.item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin: 10px auto;
  border: 1px solid #ccc;
  padding: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.item-data {
  margin-bottom: 8px;
}

.item-key {
  font-weight: bold;
  margin-right: 5px;
}

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 20px;
  width: 80%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  height: 40%;
  max-height: 80%;
  backdrop-filter: blur(100px);
}

.modal-content {
  font-size: 18px;
}

button {
  width: 80%;
  height: 15%;
  border-radius: 0.8%;
  background: #3171e0;
  position: absolute;
  bottom: 20px;
  margin-top: 20px;
  cursor: pointer;
  border: none;
  left: 50%;
  top: 80%;
  transform: translate(-50%, -50%);
  transition: background 0.3s ease;
}

button:hover {
  background: #2654a8;
}

button:active {
  background: #1c3b75;
}
</style>
