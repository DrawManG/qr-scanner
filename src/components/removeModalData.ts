import { items, saveToLocalStorage, isModalOpen } from './Tab2Container.vue';

//position: absolute; #button
export const removeModalData = (key: number) => {
const index = items.value.findIndex(item => item.id === key);
if (index !== -1) {

const updatedItems = items.value.filter(item => item.id !== key);
items.value = updatedItems;
saveToLocalStorage(updatedItems);
isModalOpen.value = false;
}
};
