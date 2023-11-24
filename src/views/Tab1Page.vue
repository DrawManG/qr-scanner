<template >
  <ion-page >
    <ion-header >
      <ion-toolbar  >
        <ion-title>QR-CODE SCAN</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="fixed-content"  >

      <div class="center" >
        <img class="icon" id="pic_qr_aim" style="width: 50%; height: 50%;position:fixed; visibility: hidden; " src="./QR-aim.svg" alt="dots icon">
      </div>

      <div class="button-container" >
        <ion-fab-button id="start_button_scan"  style="display: inline-block;vertical-align: middle !important;height: 80px; width: 80px; "
          v-on:click="startScan" class="round-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" style="width: 50%;height: 50%;" viewBox="0 0 512 512"><path d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="272" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M124 158v-22h-24v22"/></svg>
        </ion-fab-button>
      </div>
      <div style="position: absolute; top: -100%; left: -100%;" >
         <video  style="width: 0%; height: 0%;" id="videoElement" playsinline autoplay></video>
      </div>
    </ion-content>
  </ion-page>
</template>



<style scoped>
.body{
  overflow: 'hidden';
}
.aim {
  background-image:
    url(./icons/QR-aim.svg);
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* высота экрана */
}

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
  font-size: 1.2 rch;
  position: fixed;
  line-height: 40vw;
  text-align: center;
  background: #216ad8;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 2px 4px 10px #397ee6;
}

.button-container ion-fab-button.round-button-red {
  width: 40vw;
  height: 40vw;
  border-radius: 50%;
  background-color: brown;
  font-size: 1.2 rch;
  position: fixed;
  --background:#5e1317 !important;
  line-height: 40vw;
  text-align: center;
  background: brown;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 2px 4px 10px  rgb(255, 0, 0);
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
      const button = document.getElementById('start_button_scan');
      if (this.isScanning){
        document.querySelector('body')?.classList.remove('scanner-active');
        this.isScanning = false;
        document.getElementById("pic_qr_aim").style.visibility = "hidden";
        button.style.background = 'blue';
        button.classList.remove("round-button-red");
        button.classList.add("round-button");
        button.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" style="width: 50%;height: 50%;" viewBox="0 0 512 512"><path d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="272" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M124 158v-22h-24v22"/></svg>`;

        
        return;
        
      }

         this.isScanning = true;
         document.getElementById("pic_qr_aim").style.visibility = "visible";
         button.style.background = 'brown';
         button.classList.remove("round-button");
         button.classList.add("round-button-red");
         button.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192M192 320l128-128"/></svg>`;
         const body = document.querySelector('body');
  if (body) {
    body.style.background = 'transparent';
    // Добавить класс для активации сканера
    body.classList.add('scanner-active');
    // Запускать сканер баркодов
  }


      await BarcodeScanner.checkPermission({ force: true });


      BarcodeScanner.hideBackground();
      
      


      if (isPlatform('android')) {
        const videoElement = document.getElementById('videoElement');
        // TODO Тут не нужно убирать ошибку, после устранения ошибки. код перестаёт работать 
        videoElement.style.cssText = "display: block;"; 
        videoElement.setAttribute("style", "display: block;");

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
                parsedData += `${label}: ${value}\n`;

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
modal.style.background = 'transparent';
modal.style.padding = '20px';
modal.style.width = '80%';
modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
modal.style.height = '40%';
modal.style.maxHeight = '80%';
modal.style.backdropFilter = 'blur(100px)';

const messageDiv = document.createElement('div');
messageDiv.innerHTML = message_alert.replace(/\n/g, '<br>');
messageDiv.style.fontSize = '18px';
modal.appendChild(messageDiv);

const okButton = document.createElement('button');
okButton.innerHTML = 'OK';

okButton.classList.add('ion-button', 'ion-color');
okButton.style.width = '90%';
okButton.style.height = '15%';
okButton.style.position = 'absolute';
okButton.style.bottom = '20px';
okButton.style.cursor = 'pointer';
okButton.style.border = 'none';
okButton.style.borderRadius = '0.8%';
okButton.style.background = '#3171e0';
okButton.style.marginTop = '20px';
okButton.style.left = '50%';
okButton.style.top = '80%';
okButton.style.transform = 'translate(-50%, -50%)';
okButton.style.transition = 'background 0.3s ease';

okButton.addEventListener('click', () => {
  modal.style.display = 'none';
});
okButton.addEventListener('mouseover', () => {
  okButton.style.background = '#2654a8';
});

okButton.addEventListener('mousedown', () => {
  okButton.style.background = '#1c3b75';
});

okButton.addEventListener('mouseup', () => {
  okButton.style.background = '#2654a8';
});

okButton.addEventListener('mouseleave', () => {
  okButton.style.background = '#3171e0';
});

document.body.appendChild(modal);
modal.appendChild(okButton);

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
      button.style.background = 'blue';
      button.classList.remove("round-button-red");
      button.classList.add("round-button");
      button.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" style="width: 50%;height: 50%;" viewBox="0 0 512 512"><path d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="272" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M124 158v-22h-24v22"/></svg>`;

    }
  }
}

</script>
