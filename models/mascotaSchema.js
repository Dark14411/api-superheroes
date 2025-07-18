import mongoose from 'mongoose';

// Esquema para enfermedades
const enfermedadSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        enum: [
            'sarna', 'gripe', 'pelos_estomago', 'bola_pelo_grave', 'obstruccion_pelo',
            'gastritis_pelo', 'sindrome_pelo', 'pata_rota', 'parasitos', 'alergia',
            'infeccion_oido', 'problemas_dentales', 'ansiedad', 'depresion', 'diabetes',
            'obesidad', 'artritis', 'cataratas', 'hipotiroidismo', 'hipertiroidismo',
            'insuficiencia_renal', 'enfermedad_cardiaca', 'cancer', 'epilepsia',
            'dermatitis', 'conjuntivitis', 'bronquitis', 'neumonia', 'pancreatitis',
            'hepatitis', 'colitis', 'cistitis', 'otitis_media', 'gingivitis',
            'absceso_dental', 'fractura_dental', 'tumor_benigno', 'hernia_discal',
            'luxacion_cadera', 'asma', 'hipoglucemia', 'hiperglucemia', 'anemia',
            'leucemia', 'linfoma', 'melanoma', 'osteosarcoma', 'mastocitoma',
            'adenoma', 'fibroma', 'lipoma', 'hemangioma', 'osteoma', 'condroma',
            'meningioma', 'glioma', 'neurofibroma', 'schwannoma', 'ependimoma',
            'meduloblastoma', 'astrocitoma', 'oligodendroglioma', 'glioblastoma',
            'carcinoma', 'sarcoma', 'adenocarcinoma', 'carcinoma_escamoso',
            'carcinoma_basal', 'melanoma_maligno', 'linfoma_hodgkin', 'linfoma_no_hodgkin',
            'leucemia_linfocitica', 'leucemia_mieloide', 'mieloma_multiple',
            'sarcoma_osteogenico', 'sarcoma_condrogenico', 'sarcoma_fibrogenico',
            'sarcoma_lipogenico', 'sarcoma_angiosarcoma', 'sarcoma_leiomiosarcoma',
            'sarcoma_rabdomiosarcoma', 'sarcoma_sinovial', 'sarcoma_epitelioide',
            'sarcoma_alveolar', 'sarcoma_pleomorfico', 'sarcoma_mixofibroso',
            'sarcoma_malignant_fibrous_histiocytoma', 'sarcoma_dermatofibrosarcoma',
            'sarcoma_angiosarcoma_cutaneo', 'sarcoma_leiomiosarcoma_cutaneo',
            'sarcoma_rabdomiosarcoma_embrionario', 'sarcoma_rabdomiosarcoma_alveolar',
            'sarcoma_rabdomiosarcoma_pleomorfico', 'sarcoma_sinovial_monofasico',
            'sarcoma_sinovial_bifasico', 'sarcoma_epitelioide_pleomorfo',
            'sarcoma_alveolar_parts', 'sarcoma_pleomorfo_undifferentiated',
            'sarcoma_mixofibroso_maligno', 'sarcoma_malignant_fibrous_histiocytoma_pleomorfo',
            'sarcoma_dermatofibrosarcoma_protuberans', 'sarcoma_angiosarcoma_cutaneo_epitelioide',
            'sarcoma_leiomiosarcoma_cutaneo_pleomorfo', 'sarcoma_rabdomiosarcoma_embrionario_botrioide',
            'sarcoma_rabdomiosarcoma_alveolar_solido', 'sarcoma_rabdomiosarcoma_pleomorfo_anaplasico',
            'sarcoma_sinovial_monofasico_fibroso', 'sarcoma_sinovial_bifasico_fibroso',
            'sarcoma_epitelioide_pleomorfo_giant_cell', 'sarcoma_alveolar_parts_tfe3',
            'sarcoma_pleomorfo_undifferentiated_high_grade', 'sarcoma_mixofibroso_maligno_high_grade',
            'sarcoma_malignant_fibrous_histiocytoma_pleomorfo_high_grade', 'sarcoma_dermatofibrosarcoma_protuberans_high_grade',
            'sarcoma_angiosarcoma_cutaneo_epitelioide_high_grade', 'sarcoma_leiomiosarcoma_cutaneo_pleomorfo_high_grade',
            'sarcoma_rabdomiosarcoma_embrionario_botrioide_high_grade', 'sarcoma_rabdomiosarcoma_alveolar_solido_high_grade',
            'sarcoma_rabdomiosarcoma_pleomorfo_anaplasico_high_grade', 'sarcoma_sinovial_monofasico_fibroso_high_grade',
            'sarcoma_sinovial_bifasico_fibroso_high_grade', 'sarcoma_epitelioide_pleomorfo_giant_cell_high_grade',
            'sarcoma_alveolar_parts_tfe3_high_grade', 'sarcoma_pleomorfo_undifferentiated_high_grade_metastatic',
            'sarcoma_mixofibroso_maligno_high_grade_metastatic', 'sarcoma_malignant_fibrous_histiocytoma_pleomorfo_high_grade_metastatic',
            'sarcoma_dermatofibrosarcoma_protuberans_high_grade_metastatic', 'sarcoma_angiosarcoma_cutaneo_epitelioide_high_grade_metastatic',
            'sarcoma_leiomiosarcoma_cutaneo_pleomorfo_high_grade_metastatic', 'sarcoma_rabdomiosarcoma_embrionario_botrioide_high_grade_metastatic',
            'sarcoma_rabdomiosarcoma_alveolar_solido_high_grade_metastatic', 'sarcoma_rabdomiosarcoma_pleomorfo_anaplasico_high_grade_metastatic',
            'sarcoma_sinovial_monofasico_fibroso_high_grade_metastatic', 'sarcoma_sinovial_bifasico_fibroso_high_grade_metastatic',
            'sarcoma_epitelioide_pleomorfo_giant_cell_high_grade_metastatic', 'sarcoma_alveolar_parts_tfe3_high_grade_metastatic'
        ]
    },
    fechaInicio: {
        type: Date,
        default: Date.now
    },
    fechaFin: {
        type: Date,
        default: null
    },
    curada: {
        type: Boolean,
        default: false
    },
    tratamientos: [{
        type: String
    }],
    sintomas: [{
        type: String
    }]
}, { _id: false });

// Esquema para problemas de pelo
const problemaPeloSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['leve', 'moderado', 'grave', 'crítico'],
        default: 'leve'
    },
    fechaInicio: {
        type: Date,
        default: Date.now
    },
    tratamientosAplicados: [{
        tratamiento: String,
        fecha: {
            type: Date,
            default: Date.now
        },
        efectividad: {
            type: Number,
            min: 0,
            max: 100,
            default: 50
        }
    }],
    cepillados: [{
        fecha: {
            type: Date,
            default: Date.now
        },
        intensidad: {
            type: String,
            enum: ['suave', 'normal', 'intenso'],
            default: 'normal'
        },
        duracion: {
            type: Number,
            min: 1,
            max: 60,
            default: 10
        }
    }]
}, { _id: false });

// Esquema principal de mascota
const mascotaSchema = new mongoose.Schema({
    // ID numérico simple para uso fácil
    id: {
        type: Number,
        required: true,
        unique: true,
        description: 'ID numérico simple para identificar la mascota'
    },
    // Campo de propietario - REQUERIDO para seguridad
    propietarioId: {
        type: String,
        required: false, // Cambiado a false para permitir mascotas sin propietario
        ref: 'User',
        description: 'ID del usuario propietario de la mascota'
    },
    // Estado de adopción
    adoptada: {
        type: Boolean,
        default: false,
        description: 'Indica si la mascota ha sido adoptada'
    },
    fechaAdopcion: {
        type: Date,
        default: null,
        description: 'Fecha cuando la mascota fue adoptada'
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50
    },
    tipo: {
        type: String,
        required: true,
        enum: ['dragon', 'fenix', 'unicornio', 'grifo', 'basilisco', 'sirena', 'centauro', 'minotauro', 'quimera', 'hidra'],
        default: 'dragon'
    },
    elemento: {
        type: String,
        required: true,
        enum: ['fuego', 'agua', 'tierra', 'aire', 'luz', 'oscuridad', 'electricidad', 'hielo', 'veneno', 'psiquico'],
        default: 'fuego'
    },
    poder: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    
    // Estadísticas básicas
    energia: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },
    felicidad: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },
    hambre: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    sed: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    cansancio: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    estres: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    
    // Estados booleanos
    tieneHambre: {
        type: Boolean,
        default: false
    },
    tieneSed: {
        type: Boolean,
        default: false
    },
    estaCansado: {
        type: Boolean,
        default: false
    },
    estaEstresado: {
        type: Boolean,
        default: false
    },
    
    // Estados descriptivos
    estadoHambre: {
        type: String,
        enum: ['Saciado', 'Ligeramente hambriento', 'Hambriento', 'Muy hambriento', 'Hambriento extremo'],
        default: 'Saciado'
    },
    estadoSed: {
        type: String,
        enum: ['Hidratado', 'Ligeramente sediento', 'Sediento', 'Muy sediento', 'Sediento extremo'],
        default: 'Hidratado'
    },
    estadoCansancio: {
        type: String,
        enum: ['Descansado', 'Ligeramente cansado', 'Cansado', 'Muy cansado', 'Agotado'],
        default: 'Descansado'
    },
    estadoEstres: {
        type: String,
        enum: ['Tranquilo', 'Ligeramente estresado', 'Estresado', 'Muy estresado', 'Estresado extremo'],
        default: 'Tranquilo'
    },
    estadoEnergia: {
        type: String,
        enum: ['Lleno de energía', 'Energético', 'Normal', 'Bajo en energía', 'Sin energía'],
        default: 'Lleno de energía'
    },
    estadoFelicidad: {
        type: String,
        enum: ['Muy feliz', 'Feliz', 'Contento', 'Triste', 'Muy triste'],
        default: 'Muy feliz'
    },
    
    // Sistema de salud
    enfermedades: [enfermedadSchema],
    problemasPelo: problemaPeloSchema,
    muerto: {
        type: Boolean,
        default: false
    },
    fechaMuerte: {
        type: Date,
        default: null
    },
    causaMuerte: {
        type: String,
        default: null
    },
    
    // Vulnerabilidades y fortalezas
    vulnerabilidades: [{
        type: String,
        enum: ['fuego', 'agua', 'tierra', 'aire', 'luz', 'oscuridad', 'electricidad', 'hielo', 'veneno', 'psiquico']
    }],
    fortalezas: [{
        type: String,
        enum: ['fuego', 'agua', 'tierra', 'aire', 'luz', 'oscuridad', 'electricidad', 'hielo', 'veneno', 'psiquico']
    }],
    
    // Historial de actividades
    ultimaComida: {
        type: Date,
        default: null
    },
    ultimaBebida: {
        type: Date,
        default: null
    },
    ultimoDescanso: {
        type: Date,
        default: null
    },
    ultimoEjercicio: {
        type: Date,
        default: null
    },
    
    // Metadatos
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaUltimaActualizacion: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento
mascotaSchema.index({ nombre: 1 });
mascotaSchema.index({ tipo: 1 });
mascotaSchema.index({ elemento: 1 });
mascotaSchema.index({ muerto: 1 });
mascotaSchema.index({ 'enfermedades.tipo': 1 });
mascotaSchema.index({ fechaCreacion: -1 });
mascotaSchema.index({ adoptada: 1 });
mascotaSchema.index({ propietarioId: 1 });

// Métodos de instancia
mascotaSchema.methods.aplicarEfectosEnfermedades = function() {
    let energiaMod = 0;
    let felicidadMod = 0;
    let estresMod = 0;
    
    this.enfermedades.forEach(enfermedad => {
        if (!enfermedad.curada) {
            // Aquí aplicarías los efectos de cada enfermedad
            // Por ahora usamos valores básicos
            energiaMod -= 5;
            felicidadMod -= 3;
            estresMod += 5;
        }
    });
    
    this.energia = Math.max(0, Math.min(100, this.energia + energiaMod));
    this.felicidad = Math.max(0, Math.min(100, this.felicidad + felicidadMod));
    this.estres = Math.max(0, Math.min(100, this.estres + estresMod));
    
    return this;
};

mascotaSchema.methods.actualizarEstados = function() {
    // Actualizar estados booleanos
    this.tieneHambre = this.hambre > 50;
    this.tieneSed = this.sed > 50;
    this.estaCansado = this.cansancio > 50;
    this.estaEstresado = this.estres > 50;
    
    // Actualizar estados descriptivos
    this.estadoHambre = this.obtenerEstadoHambre(this.hambre);
    this.estadoSed = this.obtenerEstadoSed(this.sed);
    this.estadoCansancio = this.obtenerEstadoCansancio(this.cansancio);
    this.estadoEstres = this.obtenerEstadoEstres(this.estres);
    this.estadoEnergia = this.obtenerEstadoEnergia(this.energia);
    this.estadoFelicidad = this.obtenerEstadoFelicidad(this.felicidad);
    
    this.fechaUltimaActualizacion = new Date();
    return this;
};

mascotaSchema.methods.obtenerEstadoHambre = function(hambre) {
    if (hambre <= 10) return 'Saciado';
    if (hambre <= 30) return 'Ligeramente hambriento';
    if (hambre <= 60) return 'Hambriento';
    if (hambre <= 80) return 'Muy hambriento';
    return 'Hambriento extremo';
};

mascotaSchema.methods.obtenerEstadoSed = function(sed) {
    if (sed <= 10) return 'Hidratado';
    if (sed <= 30) return 'Ligeramente sediento';
    if (sed <= 60) return 'Sediento';
    if (sed <= 80) return 'Muy sediento';
    return 'Sediento extremo';
};

mascotaSchema.methods.obtenerEstadoCansancio = function(cansancio) {
    if (cansancio <= 10) return 'Descansado';
    if (cansancio <= 30) return 'Ligeramente cansado';
    if (cansancio <= 60) return 'Cansado';
    if (cansancio <= 80) return 'Muy cansado';
    return 'Agotado';
};

mascotaSchema.methods.obtenerEstadoEstres = function(estres) {
    if (estres <= 10) return 'Tranquilo';
    if (estres <= 30) return 'Ligeramente estresado';
    if (estres <= 60) return 'Estresado';
    if (estres <= 80) return 'Muy estresado';
    return 'Estresado extremo';
};

mascotaSchema.methods.obtenerEstadoEnergia = function(energia) {
    if (energia >= 90) return 'Lleno de energía';
    if (energia >= 70) return 'Energético';
    if (energia >= 40) return 'Normal';
    if (energia >= 20) return 'Bajo en energía';
    return 'Sin energía';
};

mascotaSchema.methods.obtenerEstadoFelicidad = function(felicidad) {
    if (felicidad >= 90) return 'Muy feliz';
    if (felicidad >= 70) return 'Feliz';
    if (felicidad >= 40) return 'Contento';
    if (felicidad >= 20) return 'Triste';
    return 'Muy triste';
};

// Métodos estáticos
mascotaSchema.statics.findByTipo = function(tipo) {
    return this.find({ tipo: tipo });
};

mascotaSchema.statics.findVivas = function() {
    return this.find({ muerto: false });
};

mascotaSchema.statics.findEnfermas = function() {
    return this.find({
        'enfermedades': { $elemMatch: { curada: false } }
    });
};

// Métodos para adopción
mascotaSchema.statics.findDisponibles = function() {
    return this.find({ adoptada: false });
};

mascotaSchema.statics.findAdoptadas = function() {
    return this.find({ adoptada: true });
};

mascotaSchema.methods.adoptar = function(propietarioId) {
    if (this.adoptada) {
        throw new Error('Esta mascota ya ha sido adoptada');
    }
    
    this.propietarioId = propietarioId;
    this.adoptada = true;
    this.fechaAdopcion = new Date();
    
    return this.save();
};

mascotaSchema.methods.abandonar = function() {
    if (!this.adoptada) {
        throw new Error('Esta mascota no está adoptada');
    }
    
    this.propietarioId = null;
    this.adoptada = false;
    this.fechaAdopcion = null;
    
    return this.save();
};

// Middleware pre-save
mascotaSchema.pre('save', function(next) {
    this.actualizarEstados();
    this.fechaUltimaActualizacion = new Date();
    next();
});

// Virtuals
mascotaSchema.virtual('edad').get(function() {
    const ahora = new Date();
    const diferencia = ahora - this.fechaCreacion;
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    return dias;
});

mascotaSchema.virtual('saludGeneral').get(function() {
    const promedio = (this.energia + this.felicidad + (100 - this.hambre) + (100 - this.sed) + (100 - this.cansancio) + (100 - this.estres)) / 6;
    return Math.round(promedio);
});

mascotaSchema.virtual('enfermedadesActivas').get(function() {
    return this.enfermedades.filter(e => !e.curada);
});

export default mongoose.model('Mascota', mascotaSchema); 