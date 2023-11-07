<template>
  <div>
    <span class="button-container">
      <ion-fab-button style="display: inline-block; vertical-align: middle !important; margin: auto;" class="round-button" id="clearButton" @click="handleClearButtonClick">
        <span>Очистить</span>
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
        <div class="container-buttons" style="padding-top: 10%;width: 100%;">
        <button @click="closeModal" style="width: 40%; height: 50px;margin-left: 20%; ">OK</button>
        <button @click="removeModalData()" style="width: 40%;height: 50px; margin-left: 20%; background: brown;" value="{{ item.data.Объект }}">DEL</button>
      </div>
      
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { data } from 'cheerio/lib/api/attributes';
import { key } from 'ionicons/icons';
import { ref, onBeforeMount } from 'vue';

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


function handleClearButtonClick() {
  localStorage.removeItem('myAppDatabase');
  items.value = []; 
}


window.addEventListener('load', () => {
  const clearButton = document.getElementById('clearButton') as HTMLIonFabButtonElement;
  clearButton.addEventListener('click', handleClearButtonClick);
});

window.addEventListener('storage', (event) => {
  if (event.key === 'myAppDatabase') {
    notifyDataChange();
  }
});

onBeforeMount(updateItems);

const onItemClick = (item: Item) => {
  let keySelect = '';
  let formattedData = '';
  for (const key in item.data) {
    formattedData += `${key}: ${item.data[key]}<br>`;
  }
  modalMessage.value = formattedData;
  keySelect = key
  
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
//position: absolute; #button
const removeModalData = (key: string) => {
  delete items[key as keyof typeof items];
  isModalOpen.value = false;
}

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
