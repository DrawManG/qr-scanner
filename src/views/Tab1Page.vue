<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="center">
        <ion-button v-on:click="startScan">Сканировать код</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.center {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton} from '@ionic/vue';
</script>

<script lang="ts">
import {BarcodeScanner} from "@capacitor-community/barcode-scanner";
import { alertController, isPlatform, getPlatforms } from '@ionic/vue';
export default {
  methods: {
    async startScan() {
      // Check camera permission
      // This is just a simple example, check out the better checks below
      await BarcodeScanner.checkPermission({force: true});

      // make background of WebView transparent
      // note: if you are using ionic this might not be enough, check below
      //BarcodeScanner.hideBackground();
      //document.querySelector('body')?.classList.add('scanner-active');

      if ((isPlatform('capacitor') && isPlatform('ios')) || isPlatform('capacitor') && isPlatform('android')) {
        //document.querySelector('ion-content')?.classList.add('scanner-active');
      }

      console.log(getPlatforms())

      const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

      //document.querySelector('body')?.classList.remove('scanner-active');
      if ((isPlatform('capacitor') && isPlatform('ios')) || (isPlatform('capacitor') && isPlatform('android'))) {
        //document.querySelector('ion-content')?.classList.remove('scanner-active');
      }

      // if the result has content
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
  }
}
</script>
