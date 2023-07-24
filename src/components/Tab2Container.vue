<template>
  <div>
    <div v-for="item in items" :key="item.id" class="item-container" @click="onItemClick(item)">
  <div class="item-content">
    <div class="item-data">
      <span class="item-key"></span> <span class="item-value">{{ item.data.Номер }}</span>
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
import { ref, onBeforeMount } from 'vue';
import database from '@/JSON/database.json';

const items = ref<Array<Item>>([]);
const isModalOpen = ref<boolean>(false);
const modalMessage = ref<string>('');

onBeforeMount(() => {
  items.value = database.items;
});

interface Item {
  id: number;
  data: Record<string, string | number>;
}

const onItemClick = (item: Item) => {
  let formattedData = '';
  for (const key in item.data) {
    formattedData += `${key} - ${item.data[key]}<br>`;
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
  background: #696969;
  padding: 20px;
  width: 90%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  height: 40%;
  max-height: 80%;
}

.modal-content {
  font-size: 18px;
}

button {
  width: 90%;
  height: 15%;
  background-color: #808080;
  position: absolute;
  bottom: 20px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
