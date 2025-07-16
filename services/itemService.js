import itemRepository from '../repositories/itemRepository.js';

async function getAllItems() {
    return await itemRepository.getItems();
}

async function getItemById(id) {
    const items = await itemRepository.getItems();
    const item = items.find(i => i.id === parseInt(id));
    if (!item) {
        throw new Error('Item no encontrado');
    }
    return item;
}

async function getItemsByType(tipo) {
    const items = await itemRepository.getItems();
    return items.filter(item => item.tipo.toLowerCase() === tipo.toLowerCase());
}

async function getFreeItems() {
    const items = await itemRepository.getItems();
    return items.filter(item => item.esGratuito === true);
}

async function getPaidItems() {
    const items = await itemRepository.getItems();
    return items.filter(item => item.esGratuito === false);
}

async function getItemsByPriceRange(minPrice, maxPrice) {
    const items = await itemRepository.getItems();
    return items.filter(item => item.precio >= minPrice && item.precio <= maxPrice);
}

async function addItem(item) {
    const items = await itemRepository.getItems();
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItem = { ...item, id: newId };
    items.push(newItem);
    await itemRepository.saveItems(items);
    return newItem;
}

async function updateItem(id, updatedItem) {
    const items = await itemRepository.getItems();
    const index = items.findIndex(item => item.id === parseInt(id));
    if (index === -1) {
        throw new Error('Item no encontrado');
    }
    
    delete updatedItem.id;
    items[index] = { ...items[index], ...updatedItem };
    await itemRepository.saveItems(items);
    return items[index];
}

async function deleteItem(id) {
    const items = await itemRepository.getItems();
    const index = items.findIndex(item => item.id === parseInt(id));
    if (index === -1) {
        throw new Error('Item no encontrado');
    }
    
    const deletedItem = items[index];
    items.splice(index, 1);
    await itemRepository.saveItems(items);
    return { message: `Item ${deletedItem.nombre} eliminado exitosamente` };
}

export default {
    getAllItems,
    getItemById,
    getItemsByType,
    getFreeItems,
    getPaidItems,
    getItemsByPriceRange,
    addItem,
    updateItem,
    deleteItem
}; 