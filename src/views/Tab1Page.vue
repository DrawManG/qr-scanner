<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="center">
        <ion-button v-if="!isScanning" v-on:click="startScan">Сканировать код</ion-button>
      </div>
      <div>
        <video class="fullscreen-video" id="videoElement" playsinline autoplay></video>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.center {
  height: 100%;
  display: flex;
  
  
}
.fullscreen-video {
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: none;
}
.hide-button {
  display: none;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
</script>

<script lang="ts">
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { alertController, isPlatform } from '@ionic/vue';
import axios from 'axios';

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
        videoElement.style.display = 'block';

        const result = await BarcodeScanner.startScan({ targetedFormats: 'QR_CODE', previewElement: videoElement });


        if (result.hasContent) {
          try {
            let message = result.content;

            if (!message.includes('georeport.ru')) {
              throw new Error('QR-CODE не является кодом GeoReport');
            }


            const response = await axios.get('https://georeport.ru', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; RMX3472 Build/TP1A.220905.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.5735.196 Mobile Safari/537.36',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'Host': 'georeport.ru',
    'Referer': 'https://localhost/',
  },
  timeout: 5000,
});



            const html = response.data;
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(html, 'text/html');

            const table = htmlDoc.querySelector('.table__tbody');
            const rows = table ? table.querySelectorAll('.table__tr') : [];

            let parsedData = '';
            if (rows.length > 0) {
              rows.forEach(row => {
                const cells = row.querySelectorAll('.table__td');
                const label = cells[0].textContent.trim();
                const value = cells[1].textContent.trim();
                parsedData += `${label}: ${value}\n`;
              });
            } else {
              parsedData = 'Ошибка чтения кода';
            }

            message = parsedData;

            const alert = await alertController.create({
              header: 'QR',
              subHeader: 'Сканированные данные',
              message: message,
              buttons: ['OK'],
            });

            await alert.present();
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
