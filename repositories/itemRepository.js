import fs from 'fs-extra';
import Item from '../models/itemModel.js';

const filePath = './data/items.json';

async function getItems() {
    try {
        const data = await fs.readJson(filePath);
        return data.map(item => new Item(
            item.id,
            item.nombre,
            item.tipo,
            item.efecto,
            item.valor,
            item.precio,
            item.esGratuito,
            item.descripcion
        ));
    } catch (error) {
        console.error('Error leyendo items:', error);
        return [];
    }
}

async function saveItems(items) {
    try {
        // Convertir las instancias de Item a objetos planos para guardar
        const itemsData = items.map(item => ({
            id: item.id,
            nombre: item.nombre,
            tipo: item.tipo,
            efecto: item.efecto,
            valor: item.valor,
            precio: item.precio,
            esGratuito: item.esGratuito,
            descripcion: item.descripcion,
            fechaCreacion: item.fechaCreacion
        }));
        
        await fs.writeJson(filePath, itemsData, { spaces: 2 });
    } catch (error) {
        console.error('Error guardando items:', error);
        throw new Error('No se pudo guardar los items');
    }
}

export default {
    getItems,
    saveItems
}; 