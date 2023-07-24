<template>
    <ion-modal v-model="modalVisible">
      <ion-header>
        <ion-toolbar>
          <ion-title>QR</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Сканированные данные</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content v-html="messageContent"></ion-card-content>
        </ion-card>
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-button expand="full" @click="closeModal">OK</ion-button>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { IonModal, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/vue';
  
  export default defineComponent({
    components: {
      IonModal,
      IonCard,
      IonCardHeader,
      IonCardSubtitle,
      IonCardContent,
      IonButton,
    },
    props: {
      message: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const modalVisible = ref(true);
      const messageContent = ref(props.message);
  
      const closeModal = () => {
        modalVisible.value = false;
      };
  
      return {
        modalVisible,
        messageContent,
        closeModal,
      };
    },
  });
  </script>
  