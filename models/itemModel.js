import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    nombre: { type: String, required: true },
    tipo: { type: String, required: true }, // "medicina", "comida", "juguete", "cura"
    efecto: { type: String, required: true }, // "salud", "felicidad", "ambos"
    valor: { type: Number, required: true }, // Cantidad que restaura
    precio: { type: Number, default: 0 }, // 0 para items gratuitos
    esGratuito: { type: Boolean, default: true },
    descripcion: { type: String, default: "" },
    fechaCreacion: { type: Date, default: Date.now }
}, {
    timestamps: true
})

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema)

export default Item 