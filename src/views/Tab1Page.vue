<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>QR-CODE SCAN</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="fixed-content">
      <div class="button-container">
        <ion-fab-button v-if="!isScanning" style="display: inline-block;vertical-align: middle !important;" v-on:click="startScan" class="round-button">
          <span>Сканирование</span>
        </ion-fab-button>
      </div>
      <div>
        <video class="fullscreen-video" id="videoElement" playsinline autoplay></video>
      </div>
    </ion-content>
  </ion-page>
</template>



<style scoped>
.fixed-content {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.video-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 0%;
    overflow: hidden;
    background: #000;
    z-index: 9999; 
  }
.fullscreen-video {
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: none;
  pointer-events: none;
}

.hide-button {
  display: none;
}


.button-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100vh;
    padding-bottom: 50px;
  }
  .button-container ion-fab-button.round-button {
    width: 40vw;
    height: 40vw;
    border-radius: 50%;
    background-color: #216ad8;
    color: #e7e7e7;
    font-size: 1.2 rch;
    position: fixed;
    line-height: 40vw;
    text-align: center;
    
    bottom: 2%;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 2px 4px 10px #397ee6;
  }

</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
</script>

<script lang="ts">
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { alertController, isPlatform } from '@ionic/vue';
import axios from 'axios';
import databaseJson from '@/JSON/database.json';

export default {
  data() {
    return {
      isScanning: false,
    };
  },
  
  methods: {
    async startScan() {
      this.isScanning = true;

      
      await BarcodeScanner.checkPermission({ force: true });


      BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');


      if (isPlatform('android')) {
        const videoElement = document.getElementById('videoElement');
        // TODO Тут не нужно убирать ошибку, после устранения ошибки. код перестаёт работать 
        videoElement.style.display = 'block';

        const result = await BarcodeScanner.startScan({ targetedFormats: 'QR_CODE', previewElement: videoElement });


        if (result.hasContent) {
          try {
            let message = result.content;

            if (!message.includes('georeport.ru')) {
              throw new Error('QR-CODE не является кодом GeoReport');
            }
            const url = new URL(result.content);
            const port = 443;
            url.port = port.toString();

            const response = await axios.get(url.toString(), {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; MultiOS; MobileApp Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.5735.196 Mobile Safari/537.36',
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
                'Host': 'georeport.ru',
                'Referer': 'https://localhost/',
              },
              timeout: 5000,
            });
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


function saveToLocalStorage(data: Database): void {
  localStorage.setItem('myAppDatabase', JSON.stringify(data));
  const updateDataEvent = new Event('updateData');
  window.dispatchEvent(updateDataEvent);
}
const database: Database = loadFromLocalStorage();
function getMaxIdFromJson(data: Database): number {
  let maxId = -1;
  data.items.forEach(item => {
    if (item.id > maxId) {
      maxId = item.id;
    }
  });
  return maxId;
}
const maxId = getMaxIdFromJson(database);
            const html = response.data;
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(html, 'text/html');

            const table = htmlDoc.querySelector('.table__tbody');
            const rows = table ? table.querySelectorAll('.table__tr') : [];

            let parsedData = '';
            let message_alert = '';
            const newData: Data = {};
            if (rows.length > 0) {
  rows.forEach(row => {
    const cells = row.querySelectorAll('.table__td');
    const label = cells[0].innerHTML.trim();
    const value = cells[1].innerHTML.trim();


    newData[label] = value;
  });
  if (Object.keys(newData).length > 0) {
    const newItem: Item = {
      id: maxId + 1,
      data: newData,
    };
    database.items.push(newItem);
    saveToLocalStorage(database);
  }
              
              message_alert = parsedData;
            } else {
              message_alert = 'Ошибка чтения кода';
            }

            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.background = '#696969;';
            modal.style.padding = '20px';
            modal.style.width = '90%';
            modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            modal.style.height = '40%';
            modal.style.maxHeight = '80%';

            const messageDiv = document.createElement('div');
            messageDiv.innerHTML = message_alert.replace(/\n/g, '<br>');
            messageDiv.style.fontSize = '18px';
            modal.appendChild(messageDiv);

            const okButton = document.createElement('button');
            okButton.innerHTML = 'OK';

            okButton.classList.add('ion-button', 'ion-color');
            okButton.style.width = '90%';
            okButton.style.height = '15%'
            okButton.style.position = 'absolute';
            okButton.style.bottom = '20px';
            okButton.style.backgroundColor = "#808080"
            okButton.style.marginTop = '20px';

            okButton.classList.add('ion-color-danger');
            okButton.classList.add('ion-color-light');

            okButton.addEventListener('click', () => {
              modal.style.display = 'none';
            });
            modal.appendChild(okButton);

            document.body.appendChild(modal);
            document.addEventListener('click', handleClickOutsideModal);
            function handleClickOutsideModal(event: MouseEvent) {
              const targetNode = event.target as Node;

              if (modal.contains(targetNode)) {
                return;
              }

              closeModal();
            }

            function closeModal() {
              modal.style.display = 'none';
              document.removeEventListener('click', handleClickOutsideModal);
            }

          } catch (error) {
            if (error instanceof Error) {
              const alert = await alertController.create({
                header: 'Ошибка',
                message: error.message,
                buttons: ['OK'],
              });

              await alert.present();
            } else {
              console.error(error);
            }
          }
        }
      } else {

        const result = await BarcodeScanner.startScan();

        document.querySelector('body')?.classList.remove('scanner-active');

        if (result.hasContent) {
          const alert = await alertController.create({
            header: 'QR',
            subHeader: 'Сканированные данные',
            message: result.content,
            buttons: ['OK'],
          });

          await alert.present();
        }
      }

      this.isScanning = false;
    }
  }
}

</script>
