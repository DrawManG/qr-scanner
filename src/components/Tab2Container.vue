<template>
  <div>
    <span class="button-container">
      <ion-fab-button
        style="display: inline-block; vertical-align: middle !important; margin: auto;"
        class="round-button"
        id="clearButton"
        @click="handleClearButtonClick"
      >
      <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" style="width: 50%;height: 50%;" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
      </ion-fab-button>
    </span>
    
    <div v-for="item in items" :key="item.id" class="item-container" @click="onItemClick(item)">
      <div class="item-content">
        <div class="item-data">
          <span class="item-key"></span> <span class="item-value">{{ item.data.Объект }} </span>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-container">
      <div class="modal-content">
        <div v-html="modalMessage"></div>
        <div class="container-buttons" style="padding-top: 10%; width: 100%;">
          <ion-button @click="closeModal" ><svg xmlns="http://www.w3.org/2000/svg" class="ionicon" style="width: 40%; height: 50px;" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 128L192 384l-96-96"/></svg></ion-button>
          <ion-button @click="removeModalData" color="danger" style="margin-left: 20%;background-color: brown;" value="{{ item.data.Объект }}"><svg xmlns="http://www.w3.org/2000/svg" class="ionicon" style="width: 40%; height: 50px;" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg></ion-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import {IonIcon,IonButton,IonFabButton} from '@ionic/vue'
const items = ref<Item[]>([]);
const isModalOpen = ref(false);
const modalMessage = ref('');
const trash_icon = ref('trash-outline');

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

function saveToLocalStorage(data: Database): void {
  localStorage.setItem('myAppDatabase', JSON.stringify(data));
  notifyDataChange();
}

function loadFromLocalStorage(): Database {
  const savedData = localStorage.getItem('myAppDatabase');
  return savedData ? JSON.parse(savedData) : { items: [] };
}

const updateItems = () => {
  const database = loadFromLocalStorage();
  items.value = database.items;
};

const notifyDataChange = () => {
  window.dispatchEvent(new Event('updateData'));
};

function handleClearButtonClick() {
  localStorage.removeItem('myAppDatabase');
  items.value = [];
  notifyDataChange();
}

function onItemClick(item: Item) {
  let formattedData = '';
  for (const key in item.data) {
    formattedData += `${key}: ${item.data[key]}<br>`;
  }
  modalMessage.value = formattedData;
  selectedItem.value = item;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

const selectedItem = ref<Item | null>(null);

function removeModalData() {
  if (selectedItem.value) {
    const updatedItems = items.value.filter((item) => item.id !== selectedItem.value.id);
    const updatedDatabase: Database = { items: updatedItems };
    saveToLocalStorage(updatedDatabase);
    isModalOpen.value = false;
  }
}

window.addEventListener('updateData', updateItems);

onBeforeMount(updateItems);
</script>




<style>

.container-buttons {
  display: flex;
  justify-content: space-around;
}

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
.button-container {
  position: fixed;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%);
}

.button-container::after {
  content: '';
  display: block;
  width: 15vw;
  height: 15vw;
}

.button-container ion-fab-button.round-button {
  width: 15vw;
  height: 15vw;
  border-radius: 50%;
  background-color: #216ad8;
  color: #e7e7e7;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  left: 240%;
  box-shadow: 1px 2px 10px #397ee6;
}

</style>
