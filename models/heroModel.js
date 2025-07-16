import mongoose from 'mongoose'

const heroSchema = new mongoose.Schema({
    name: { type: String, required: true },
    alias: { type: String, required: true },
    city: { type: String, required: true },
    team: { type: String, required: true },
    mascotaId: { type: Number, default: null }
}, {
    timestamps: true
})

const Hero = mongoose.models.Hero || mongoose.model('Hero', heroSchema)

export default Hero 