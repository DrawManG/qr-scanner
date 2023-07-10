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
  display: none; /* Скрыть видео на других платформах */
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

export default {
  data() {
    return {
      isScanning: false, // Флаг состояния сканирования
    };
  },
  methods: {
    async startScan() {
      this.isScanning = true; // Установка флага сканирования в true

      // Check camera permission
      await BarcodeScanner.checkPermission({ force: true });

      // make background of WebView transparent
      BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');

      // Check platform
      if (isPlatform('android')) {
        const videoElement = document.getElementById('videoElement');
        videoElement.style.display = 'block';

        const result = await BarcodeScanner.startScan({ targetedFormats: 'QR_CODE', previewElement: videoElement });

        // Обработка результата сканирования
        if (result.hasContent) {
          const alert = await alertController.create({
            header: 'QR',
            subHeader: 'Сканированные данные',
            message: result.content,
            buttons: ['OK'],
          });

          await alert.present();
        }
      } else {
        // For other platforms, continue with the existing logic
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

      this.isScanning = false; // Установка флага сканирования в false
    }
  }
}
</script>
