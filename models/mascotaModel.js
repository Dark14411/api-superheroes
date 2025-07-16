// Sistema de enfermedades expandido con efectos específicos
const ENFERMEDADES = {
    'sarna': { 
        nombre: 'Sarna', 
        efectos: { energia: -15, felicidad: -20, estres: +25 },
        duracion: '3-7 días',
        sintomas: 'Picazón intensa, pérdida de pelo'
    },
    'gripe': { 
        nombre: 'Gripe', 
        efectos: { energia: -25, felicidad: -15, estres: +20 },
        duracion: '5-10 días',
        sintomas: 'Fiebre, estornudos, letargia'
    },
    'pelos_estomago': { 
        nombre: 'Pelos de estómago', 
        efectos: { energia: -10, felicidad: -10, estres: +15 },
        duracion: '2-5 días',
        sintomas: 'Vómitos ocasionales, pérdida de apetito',
        descripcion: 'Acumulación de pelo ingerido durante el acicalamiento que forma una masa en el estómago',
        tratamientos: ['Pasta de malta', 'Aceite de oliva', 'Fibra extra'],
        prevencion: 'Cepillado regular, dieta rica en fibra'
    },
    'bola_pelo_grave': { 
        nombre: 'Bola de pelo grave', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: '5-10 días',
        sintomas: 'Vómitos frecuentes, estreñimiento, letargia',
        descripcion: 'Bola de pelo grande que obstruye parcialmente el tracto digestivo',
        tratamientos: ['Intervención veterinaria', 'Laxantes específicos', 'Hidratación forzada'],
        prevencion: 'Cepillado diario, suplementos preventivos'
    },
    'obstruccion_pelo': { 
        nombre: 'Obstrucción por pelo', 
        efectos: { energia: -40, felicidad: -30, estres: +50 },
        duracion: '7-15 días',
        sintomas: 'Vómitos severos, dolor abdominal, deshidratación',
        descripcion: 'Obstrucción completa del tracto digestivo por acumulación masiva de pelo',
        tratamientos: ['Cirugía de emergencia', 'Hospitalización', 'Fluidoterapia'],
        prevencion: 'Cepillado profesional regular, dieta especializada'
    },
    'gastritis_pelo': { 
        nombre: 'Gastritis por pelo', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: '4-8 días',
        sintomas: 'Náuseas, dolor estomacal, pérdida de peso',
        descripcion: 'Inflamación del estómago causada por la irritación de pelos acumulados',
        tratamientos: ['Antiácidos', 'Dieta blanda', 'Protección gástrica'],
        prevencion: 'Control de acicalamiento, suplementos digestivos'
    },
    'sindrome_pelo': { 
        nombre: 'Síndrome de pelo excesivo', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: '3-6 días',
        sintomas: 'Acicalamiento excesivo, irritación de la piel',
        descripcion: 'Trastorno conductual que lleva a ingesta excesiva de pelo',
        tratamientos: ['Terapia conductual', 'Enriquecimiento ambiental', 'Suplementos'],
        prevencion: 'Identificación de causas de estrés, actividades alternativas'
    },
    'pata_rota': { 
        nombre: 'Pata rota', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: '10-15 días',
        sintomas: 'Cojea, dolor al moverse'
    },
    'parasitos': { 
        nombre: 'Parásitos intestinales', 
        efectos: { energia: -20, felicidad: -15, estres: +20 },
        duracion: '7-12 días',
        sintomas: 'Pérdida de peso, diarrea'
    },
    'alergia': { 
        nombre: 'Alergia estacional', 
        efectos: { energia: -10, felicidad: -10, estres: +15 },
        duracion: '3-8 días',
        sintomas: 'Estornudos, ojos llorosos'
    },
    'infeccion_oido': { 
        nombre: 'Infección de oído', 
        efectos: { energia: -15, felicidad: -20, estres: +25 },
        duracion: '5-10 días',
        sintomas: 'Rascado excesivo de orejas, mal olor'
    },
    'problemas_dentales': { 
        nombre: 'Problemas dentales', 
        efectos: { energia: -20, felicidad: -15, estres: +20 },
        duracion: '8-14 días',
        sintomas: 'Dificultad para comer, mal aliento'
    },
    'ansiedad': { 
        nombre: 'Ansiedad severa', 
        efectos: { energia: -15, felicidad: -30, estres: +40 },
        duracion: '5-15 días',
        sintomas: 'Comportamiento nervioso, insomnio'
    },
    'depresion': { 
        nombre: 'Depresión', 
        efectos: { energia: -25, felicidad: -40, estres: +30 },
        duracion: '10-20 días',
        sintomas: 'Apatía, pérdida de interés'
    },
    'diabetes': { 
        nombre: 'Diabetes', 
        efectos: { energia: -30, felicidad: -20, estres: +35 },
        duracion: 'Crónica',
        sintomas: 'Sed excesiva, micción frecuente, pérdida de peso'
    },
    'obesidad': { 
        nombre: 'Obesidad', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Crónica',
        sintomas: 'Dificultad para moverse, fatiga, problemas respiratorios'
    },
    'artritis': { 
        nombre: 'Artritis', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Crónica',
        sintomas: 'Rigidez articular, dolor al moverse, cojera'
    },
    'cataratas': { 
        nombre: 'Cataratas', 
        efectos: { energia: -15, felicidad: -25, estres: +20 },
        duracion: 'Progresiva',
        sintomas: 'Visión borrosa, dificultad para ver en la oscuridad'
    },
    'hipotiroidismo': { 
        nombre: 'Hipotiroidismo', 
        efectos: { energia: -30, felicidad: -15, estres: +25 },
        duracion: 'Crónica',
        sintomas: 'Letargia, aumento de peso, pérdida de pelo'
    },
    'hipertiroidismo': { 
        nombre: 'Hipertiroidismo', 
        efectos: { energia: -20, felicidad: -10, estres: +40 },
        duracion: 'Crónica',
        sintomas: 'Hiperactividad, pérdida de peso, nerviosismo'
    },
    'insuficiencia_renal': { 
        nombre: 'Insuficiencia renal', 
        efectos: { energia: -35, felicidad: -25, estres: +40 },
        duracion: 'Crónica',
        sintomas: 'Sed excesiva, micción frecuente, vómitos'
    },
    'enfermedad_cardiaca': { 
        nombre: 'Enfermedad cardíaca', 
        efectos: { energia: -40, felicidad: -20, estres: +45 },
        duracion: 'Crónica',
        sintomas: 'Tos, dificultad respiratoria, fatiga'
    },
    'cancer': { 
        nombre: 'Cáncer', 
        efectos: { energia: -50, felicidad: -30, estres: +60 },
        duracion: 'Variable',
        sintomas: 'Pérdida de peso, letargia, masas visibles'
    },
    'epilepsia': { 
        nombre: 'Epilepsia', 
        efectos: { energia: -20, felicidad: -25, estres: +35 },
        duracion: 'Crónica',
        sintomas: 'Convulsiones, comportamiento extraño, pérdida de consciencia'
    },
    'dermatitis': { 
        nombre: 'Dermatitis', 
        efectos: { energia: -15, felicidad: -20, estres: +25 },
        duracion: '5-15 días',
        sintomas: 'Picazón intensa, enrojecimiento de la piel, pérdida de pelo'
    },
    'conjuntivitis': { 
        nombre: 'Conjuntivitis', 
        efectos: { energia: -10, felicidad: -15, estres: +20 },
        duracion: '3-7 días',
        sintomas: 'Ojos rojos, secreción ocular, parpadeo excesivo'
    },
    'bronquitis': { 
        nombre: 'Bronquitis', 
        efectos: { energia: -25, felicidad: -15, estres: +30 },
        duracion: '7-14 días',
        sintomas: 'Tos persistente, dificultad respiratoria, fatiga'
    },
    'neumonia': { 
        nombre: 'Neumonía', 
        efectos: { energia: -40, felicidad: -25, estres: +45 },
        duracion: '10-21 días',
        sintomas: 'Fiebre alta, tos severa, dificultad respiratoria'
    },
    'pancreatitis': { 
        nombre: 'Pancreatitis', 
        efectos: { energia: -35, felicidad: -20, estres: +40 },
        duracion: '5-10 días',
        sintomas: 'Dolor abdominal severo, vómitos, pérdida de apetito'
    },
    'hepatitis': { 
        nombre: 'Hepatitis', 
        efectos: { energia: -30, felicidad: -20, estres: +35 },
        duracion: '7-21 días',
        sintomas: 'Ictericia, vómitos, letargia, pérdida de apetito'
    },
    'colitis': { 
        nombre: 'Colitis', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: '5-12 días',
        sintomas: 'Diarrea, dolor abdominal, pérdida de peso'
    },
    'cistitis': { 
        nombre: 'Cistitis', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: '3-7 días',
        sintomas: 'Micción frecuente, dolor al orinar, sangre en la orina'
    },
    'otitis_media': { 
        nombre: 'Otitis media', 
        efectos: { energia: -20, felicidad: -25, estres: +30 },
        duracion: '7-14 días',
        sintomas: 'Dolor de oído, pérdida de equilibrio, rascado excesivo'
    },
    'gingivitis': { 
        nombre: 'Gingivitis', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: '5-10 días',
        sintomas: 'Encías inflamadas, mal aliento, dificultad para comer'
    },
    'absceso_dental': { 
        nombre: 'Absceso dental', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: '7-14 días',
        sintomas: 'Dolor dental severo, hinchazón facial, fiebre'
    },
    'fractura_dental': { 
        nombre: 'Fractura dental', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: '10-21 días',
        sintomas: 'Dolor al comer, sangrado dental, sensibilidad'
    },
    'tumor_benigno': { 
        nombre: 'Tumor benigno', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Masa visible, cambios en el comportamiento'
    },
    'hernia_discal': { 
        nombre: 'Hernia discal', 
        efectos: { energia: -35, felicidad: -25, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Dolor de espalda, dificultad para moverse, parálisis parcial'
    },
    'luxacion_cadera': { 
        nombre: 'Luxación de cadera', 
        efectos: { energia: -30, felicidad: -20, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Cojera severa, dolor al moverse, dificultad para levantarse'
    },
    'tendinitis': { 
        nombre: 'Tendinitis', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: '7-21 días',
        sintomas: 'Dolor en las articulaciones, cojera, rigidez'
    },
    'esguince': { 
        nombre: 'Esguince', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: '7-14 días',
        sintomas: 'Hinchazón, dolor, dificultad para moverse'
    },
    'quemadura': { 
        nombre: 'Quemadura', 
        efectos: { energia: -30, felicidad: -25, estres: +40 },
        duracion: '10-30 días',
        sintomas: 'Dolor intenso, piel enrojecida, ampollas'
    },
    'mordedura': { 
        nombre: 'Mordedura', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: '5-10 días',
        sintomas: 'Herida visible, dolor, posible infección'
    },
    'intoxicacion': { 
        nombre: 'Intoxicación', 
        efectos: { energia: -40, felicidad: -30, estres: +50 },
        duracion: 'Variable',
        sintomas: 'Vómitos, diarrea, letargia, convulsiones'
    },
    'hipotermia': { 
        nombre: 'Hipotermia', 
        efectos: { energia: -35, felicidad: -20, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Temblores, letargia, temperatura corporal baja'
    },
    'golpe_calor': { 
        nombre: 'Golpe de calor', 
        efectos: { energia: -45, felicidad: -25, estres: +50 },
        duracion: 'Variable',
        sintomas: 'Jadeo excesivo, temperatura alta, colapso'
    },
    'deshidratacion': { 
        nombre: 'Deshidratación', 
        efectos: { energia: -30, felicidad: -15, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Piel seca, ojos hundidos, letargia'
    },
    'anemia': { 
        nombre: 'Anemia', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Fatiga, palidez, debilidad'
    },
    'leucemia': { 
        nombre: 'Leucemia', 
        efectos: { energia: -50, felicidad: -35, estres: +60 },
        duracion: 'Variable',
        sintomas: 'Fatiga extrema, pérdida de peso, infecciones frecuentes'
    },
    'sida_felino': { 
        nombre: 'SIDA felino', 
        efectos: { energia: -40, felicidad: -30, estres: +50 },
        duracion: 'Crónica',
        sintomas: 'Infecciones recurrentes, pérdida de peso, letargia'
    },
    'peritonitis': { 
        nombre: 'Peritonitis infecciosa felina', 
        efectos: { energia: -45, felicidad: -35, estres: +55 },
        duracion: 'Variable',
        sintomas: 'Fiebre, pérdida de apetito, distensión abdominal'
    },
    'calicivirus': { 
        nombre: 'Calicivirus felino', 
        efectos: { energia: -30, felicidad: -20, estres: +35 },
        duracion: '7-14 días',
        sintomas: 'Estornudos, úlceras bucales, fiebre'
    },
    'herpesvirus': { 
        nombre: 'Herpesvirus felino', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: '7-21 días',
        sintomas: 'Estornudos, secreción nasal, úlceras oculares'
    },
    'panleucopenia': { 
        nombre: 'Panleucopenia felina', 
        efectos: { energia: -50, felicidad: -40, estres: +60 },
        duracion: 'Variable',
        sintomas: 'Vómitos severos, diarrea, fiebre alta'
    },
    'rabia': { 
        nombre: 'Rabia', 
        efectos: { energia: -60, felicidad: -50, estres: +80 },
        duracion: 'Variable',
        sintomas: 'Cambios de comportamiento, agresividad, parálisis'
    },
    'toxoplasmosis': { 
        nombre: 'Toxoplasmosis', 
        efectos: { energia: -30, felicidad: -25, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Fiebre, letargia, problemas respiratorios'
    },
    'giardiasis': { 
        nombre: 'Giardiasis', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: '5-10 días',
        sintomas: 'Diarrea crónica, pérdida de peso, vómitos'
    },
    'coccidiosis': { 
        nombre: 'Coccidiosis', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: '7-14 días',
        sintomas: 'Diarrea sanguinolenta, pérdida de apetito, deshidratación'
    },
    'ascaridiasis': { 
        nombre: 'Ascaridiasis', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Vómitos, diarrea, barriga hinchada'
    },
    'teniasis': { 
        nombre: 'Teniasis', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Segmentos de gusano en heces, picazón anal'
    },
    'sarna_demodex': { 
        nombre: 'Sarna demodécica', 
        efectos: { energia: -20, felicidad: -25, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Pérdida de pelo, picazón, lesiones cutáneas'
    },
    'sarna_sarcoptes': { 
        nombre: 'Sarna sarcóptica', 
        efectos: { energia: -25, felicidad: -30, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Picazón intensa, lesiones cutáneas, pérdida de pelo'
    },
    'dermatofitosis': { 
        nombre: 'Dermatofitosis (tiña)', 
        efectos: { energia: -15, felicidad: -20, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Lesiones circulares, pérdida de pelo, picazón'
    },
    'candidiasis': { 
        nombre: 'Candidiasis', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Lesiones cutáneas, infecciones de oído, problemas digestivos'
    },
    'aspergilosis': { 
        nombre: 'Aspergilosis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios, secreción nasal, estornudos'
    },
    'cryptococcosis': { 
        nombre: 'Criptococosis', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Problemas neurológicos, lesiones cutáneas, problemas respiratorios'
    },
    'histoplasmosis': { 
        nombre: 'Histoplasmosis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios, fiebre, pérdida de peso'
    },
    'blastomicosis': { 
        nombre: 'Blastomicosis', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios, lesiones cutáneas, cojera'
    },
    'coccidioidomicosis': { 
        nombre: 'Coccidioidomicosis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios, fiebre, pérdida de peso'
    },
    'esporotricosis': { 
        nombre: 'Esporotricosis', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Lesiones cutáneas, nódulos subcutáneos, úlceras'
    },
    'feohifomicosis': { 
        nombre: 'Feohifomicosis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Lesiones cutáneas, nódulos, abscesos'
    },
    'zigomicosis': { 
        nombre: 'Zigomicosis', 
        efectos: { energia: -40, felicidad: -35, estres: +45 },
        duracion: 'Variable',
        sintomas: 'Lesiones necróticas, problemas respiratorios, fiebre'
    },
    'pneumocistosis': { 
        nombre: 'Pneumocistosis', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios severos, tos, dificultad para respirar'
    },
    'toxocariasis': { 
        nombre: 'Toxocariasis', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos, tos, problemas oculares'
    },
    'dirofilariasis': { 
        nombre: 'Dirofilariasis (gusano del corazón)', 
        efectos: { energia: -40, felicidad: -30, estres: +45 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios, tos, fatiga'
    },
    'ehrlichiosis': { 
        nombre: 'Ehrlichiosis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Fiebre, letargia, pérdida de apetito'
    },
    'anaplasmosis': { 
        nombre: 'Anaplasmosis', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Fiebre, letargia, problemas articulares'
    },
    'babesiosis': { 
        nombre: 'Babesiosis', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Anemia, fiebre, letargia'
    },
    'borreliosis': { 
        nombre: 'Borreliosis (enfermedad de Lyme)', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Cojera, fiebre, letargia'
    },
    'bartonelosis': { 
        nombre: 'Bartonelosis (enfermedad por arañazo de gato)', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Fiebre, letargia, problemas oculares'
    },
    'mycoplasmosis': { 
        nombre: 'Micoplasmosis', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios, anemia, problemas articulares'
    },
    'chlamydiosis': { 
        nombre: 'Clamidiosis', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Conjuntivitis, estornudos, secreción nasal'
    },
    'mycobacteriosis': { 
        nombre: 'Micobacteriosis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Lesiones cutáneas, problemas respiratorios, pérdida de peso'
    },
    'nocardiosis': { 
        nombre: 'Nocardiosis', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Abscesos, problemas respiratorios, fiebre'
    },
    'actinomicosis': { 
        nombre: 'Actinomicosis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Abscesos, fístulas, problemas respiratorios'
    },
    'clostridiosis': { 
        nombre: 'Clostridiosis', 
        efectos: { energia: -40, felicidad: -35, estres: +45 },
        duracion: 'Variable',
        sintomas: 'Diarrea severa, dolor abdominal, deshidratación'
    },
    'salmonelosis': { 
        nombre: 'Salmonelosis', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Diarrea, vómitos, fiebre'
    },
    'campylobacteriosis': { 
        nombre: 'Campilobacteriosis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Diarrea, vómitos, dolor abdominal'
    },
    'yersiniosis': { 
        nombre: 'Yersiniosis', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Diarrea, vómitos, fiebre'
    },
    'pasteurelosis': { 
        nombre: 'Pasteurelosis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios, abscesos, fiebre'
    },
    'klebsiellosis': { 
        nombre: 'Klebsiellosis', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios, infecciones urinarias, septicemia'
    },
    'pseudomoniasis': { 
        nombre: 'Pseudomoniasis', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Infecciones de oído, problemas respiratorios, infecciones de piel'
    },
    'proteus_infeccion': { 
        nombre: 'Infección por Proteus', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Infecciones urinarias, problemas digestivos, fiebre'
    },
    'enterococcus_infeccion': { 
        nombre: 'Infección por Enterococcus', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Infecciones urinarias, endocarditis, septicemia'
    },
    'staphylococcus_infeccion': { 
        nombre: 'Infección por Staphylococcus', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Infecciones de piel, abscesos, problemas respiratorios'
    },
    'streptococcus_infeccion': { 
        nombre: 'Infección por Streptococcus', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Faringitis, problemas respiratorios, fiebre'
    },
    'escherichia_coli_infeccion': { 
        nombre: 'Infección por E. coli', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Diarrea severa, vómitos, dolor abdominal'
    },
    'shigella_infeccion': { 
        nombre: 'Infección por Shigella', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Diarrea sanguinolenta, fiebre, dolor abdominal'
    },
    'vibrio_infeccion': { 
        nombre: 'Infección por Vibrio', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Diarrea acuosa, vómitos, deshidratación'
    },
    'helicobacter_infeccion': { 
        nombre: 'Infección por Helicobacter', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Gastritis, úlceras, vómitos'
    },
    'mycoplasma_infeccion': { 
        nombre: 'Infección por Mycoplasma', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Problemas respiratorios, artritis, anemia'
    },
    'ureaplasma_infeccion': { 
        nombre: 'Infección por Ureaplasma', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Infecciones urinarias, problemas reproductivos'
    },
    'chlamydia_infeccion': { 
        nombre: 'Infección por Chlamydia', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Conjuntivitis, problemas respiratorios, problemas reproductivos'
    },
    'rickettsia_infeccion': { 
        nombre: 'Infección por Rickettsia', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Fiebre, letargia, problemas vasculares'
    },
    'ehrlichia_infeccion': { 
        nombre: 'Infección por Ehrlichia', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Fiebre, anemia, problemas articulares'
    },
    'anaplasma_infeccion': { 
        nombre: 'Infección por Anaplasma', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Fiebre, letargia, problemas articulares'
    },
    'babesia_infeccion': { 
        nombre: 'Infección por Babesia', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Anemia, fiebre, letargia'
    },
    'theileria_infeccion': { 
        nombre: 'Infección por Theileria', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Fiebre, anemia, problemas linfáticos'
    },
    'trypanosoma_infeccion': { 
        nombre: 'Infección por Trypanosoma', 
        efectos: { energia: -40, felicidad: -35, estres: +45 },
        duracion: 'Variable',
        sintomas: 'Fiebre, letargia, problemas neurológicos'
    },
    'leishmania_infeccion': { 
        nombre: 'Infección por Leishmania', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Lesiones cutáneas, problemas renales, pérdida de peso'
    },
    'toxoplasma_infeccion': { 
        nombre: 'Infección por Toxoplasma', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Problemas neurológicos, problemas oculares, fiebre'
    },
    'neospora_infeccion': { 
        nombre: 'Infección por Neospora', 
        efectos: { energia: -35, felicidad: -30, estres: +40 },
        duracion: 'Variable',
        sintomas: 'Problemas neurológicos, problemas musculares, parálisis'
    },
    'sarcocystis_infeccion': { 
        nombre: 'Infección por Sarcocystis', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Problemas musculares, fiebre, letargia'
    },
    'isospora_infeccion': { 
        nombre: 'Infección por Isospora', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Diarrea, pérdida de peso, deshidratación'
    },
    'cryptosporidium_infeccion': { 
        nombre: 'Infección por Cryptosporidium', 
        efectos: { energia: -30, felicidad: -25, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Diarrea acuosa, dolor abdominal, deshidratación'
    },
    'entamoeba_infeccion': { 
        nombre: 'Infección por Entamoeba', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Diarrea, dolor abdominal, pérdida de peso'
    },
    'giardia_infeccion': { 
        nombre: 'Infección por Giardia', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Diarrea crónica, pérdida de peso, vómitos'
    },
    'trichomonas_infeccion': { 
        nombre: 'Infección por Trichomonas', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos, diarrea, pérdida de apetito'
    },
    'balantidium_infeccion': { 
        nombre: 'Infección por Balantidium', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Diarrea, dolor abdominal, pérdida de peso'
    },
    'blastocystis_infeccion': { 
        nombre: 'Infección por Blastocystis', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Diarrea, dolor abdominal, flatulencia'
    },
    'dientamoeba_infeccion': { 
        nombre: 'Infección por Dientamoeba', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Diarrea, dolor abdominal, pérdida de peso'
    },
    'endolimax_infeccion': { 
        nombre: 'Infección por Endolimax', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'iodamoeba_infeccion': { 
        nombre: 'Infección por Iodamoeba', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'chilomastix_infeccion': { 
        nombre: 'Infección por Chilomastix', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Diarrea, dolor abdominal, pérdida de peso'
    },
    'retortamonas_infeccion': { 
        nombre: 'Infección por Retortamonas', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'enteromonas_infeccion': { 
        nombre: 'Infección por Enteromonas', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'pentatrichomonas_infeccion': { 
        nombre: 'Infección por Pentatrichomonas', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos, diarrea, pérdida de apetito'
    },
    'histomonas_infeccion': { 
        nombre: 'Infección por Histomonas', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos, diarrea, pérdida de peso'
    },
    'tetratrichomonas_infeccion': { 
        nombre: 'Infección por Tetratrichomonas', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos, diarrea, pérdida de apetito'
    },
    'trichomonas_foetus_infeccion': { 
        nombre: 'Infección por Trichomonas foetus', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Problemas reproductivos, problemas digestivos'
    },
    'tritrichomonas_infeccion': { 
        nombre: 'Infección por Tritrichomonas', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Diarrea crónica, problemas digestivos'
    },
    'hexamita_infeccion': { 
        nombre: 'Infección por Hexamita', 
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos, diarrea, pérdida de peso'
    },
    'spironucleus_infeccion': { 
        nombre: 'Infección por Spironucleus', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos, diarrea, pérdida de apetito'
    },
    'octomitus_infeccion': { 
        nombre: 'Infección por Octomitus', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'cercomonas_infeccion': { 
        nombre: 'Infección por Cercomonas', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'heteromita_infeccion': { 
        nombre: 'Infección por Heteromita', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'monocercomonas_infeccion': { 
        nombre: 'Infección por Monocercomonas', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'dipolomonas_infeccion': { 
        nombre: 'Infección por Dipolomonas', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'trimitus_infeccion': { 
        nombre: 'Infección por Trimitus', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'tetramitus_infeccion': { 
        nombre: 'Infección por Tetramitus', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'pentamitus_infeccion': { 
        nombre: 'Infección por Pentamitus', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'hexamitus_infeccion_2': { 
        nombre: 'Infección por Hexamitus (tipo 2)', 
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos, diarrea, pérdida de apetito'
    },
    'heptamitus_infeccion': { 
        nombre: 'Infección por Heptamitus', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'octamitus_infeccion': { 
        nombre: 'Infección por Octamitus', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'nonamitus_infeccion': { 
        nombre: 'Infección por Nonamitus', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'decamitus_infeccion': { 
        nombre: 'Infección por Decamitus', 
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Variable',
        sintomas: 'Problemas digestivos leves, diarrea ocasional'
    },
    'encefalitis': {
        nombre: 'Encefalitis',
        efectos: { energia: -40, felicidad: -30, estres: +50 },
        duracion: 'Variable',
        sintomas: 'Convulsiones, fiebre, desorientación'
    },
    'meningitis': {
        nombre: 'Meningitis',
        efectos: { energia: -35, felicidad: -25, estres: +45 },
        duracion: 'Variable',
        sintomas: 'Rigidez de cuello, fiebre, letargia'
    },
    'otitis_externa': {
        nombre: 'Otitis externa',
        efectos: { energia: -10, felicidad: -10, estres: +20 },
        duracion: '5-10 días',
        sintomas: 'Rascado de orejas, mal olor, enrojecimiento'
    },
    'glaucoma': {
        nombre: 'Glaucoma',
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: 'Crónica',
        sintomas: 'Dolor ocular, ojos nublados, pérdida de visión'
    },
    'uveítis': {
        nombre: 'Uveítis',
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: '7-14 días',
        sintomas: 'Ojo rojo, dolor ocular, sensibilidad a la luz'
    },
    'hipertension': {
        nombre: 'Hipertensión',
        efectos: { energia: -20, felicidad: -10, estres: +30 },
        duracion: 'Crónica',
        sintomas: 'Letargia, debilidad, desorientación'
    },
    'hipotension': {
        nombre: 'Hipotensión',
        efectos: { energia: -15, felicidad: -10, estres: +15 },
        duracion: 'Crónica',
        sintomas: 'Desmayo, debilidad, letargia'
    },
    'hipoglucemia': {
        nombre: 'Hipoglucemia',
        efectos: { energia: -25, felicidad: -15, estres: +30 },
        duracion: 'Aguda',
        sintomas: 'Temblores, debilidad, convulsiones'
    },
    'hipercalcemia': {
        nombre: 'Hipercalcemia',
        efectos: { energia: -20, felicidad: -10, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Vómitos, letargia, debilidad muscular'
    },
    'hipocalcemia': {
        nombre: 'Hipocalcemia',
        efectos: { energia: -20, felicidad: -10, estres: +25 },
        duracion: 'Variable',
        sintomas: 'Temblores, espasmos musculares, debilidad'
    },
    'ulcera_gastrica': {
        nombre: 'Úlcera gástrica',
        efectos: { energia: -30, felicidad: -20, estres: +35 },
        duracion: '7-21 días',
        sintomas: 'Vómitos con sangre, dolor abdominal, pérdida de apetito'
    },
    'torsion_gastrica': {
        nombre: 'Torsión gástrica',
        efectos: { energia: -50, felicidad: -40, estres: +60 },
        duracion: 'Aguda',
        sintomas: 'Distensión abdominal, vómitos improductivos, colapso'
    },
    'prolapso_rectal': {
        nombre: 'Prolapso rectal',
        efectos: { energia: -25, felicidad: -20, estres: +30 },
        duracion: 'Variable',
        sintomas: 'Masa visible en el ano, dolor, dificultad para defecar'
    },
    'incontinencia_urinaria': {
        nombre: 'Incontinencia urinaria',
        efectos: { energia: -10, felicidad: -10, estres: +15 },
        duracion: 'Crónica',
        sintomas: 'Goteo de orina, irritación de la piel, mal olor'
    },
    'alopecia': {
        nombre: 'Alopecia',
        efectos: { energia: -5, felicidad: -10, estres: +10 },
        duracion: 'Variable',
        sintomas: 'Pérdida de pelo localizada o generalizada'
    },
    'piometra': {
        nombre: 'Piometra',
        efectos: { energia: -40, felicidad: -30, estres: +50 },
        duracion: 'Aguda',
        sintomas: 'Secreción vaginal, fiebre, letargia'
    },
    'mastitis': {
        nombre: 'Mastitis',
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: '7-14 días',
        sintomas: 'Inflamación de las mamas, dolor, fiebre'
    },
    'orquitis': {
        nombre: 'Orquitis',
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: '7-14 días',
        sintomas: 'Inflamación testicular, dolor, fiebre'
    },
    'prostatitis': {
        nombre: 'Prostatitis',
        efectos: { energia: -20, felicidad: -15, estres: +25 },
        duracion: '7-21 días',
        sintomas: 'Dificultad para orinar, dolor abdominal, fiebre'
    },
    'hiperplasia_suprarrenal': {
        nombre: 'Hiperplasia suprarrenal',
        efectos: { energia: -15, felicidad: -10, estres: +20 },
        duracion: 'Crónica',
        sintomas: 'Alopecia, aumento de sed, debilidad'
    },
    'hipoplasia_medular': {
        nombre: 'Hipoplasia medular',
        efectos: { energia: -30, felicidad: -20, estres: +35 },
        duracion: 'Variable',
        sintomas: 'Anemia, infecciones recurrentes, debilidad'
    },
    'hiperestrogenismo': {
        nombre: 'Hiperestrogenismo',
        efectos: { energia: -10, felicidad: -10, estres: +15 },
        duracion: 'Variable',
        sintomas: 'Alopecia, feminización, letargia'
    }
};

export default class Mascota {
    constructor(id, nombre, tipo, elemento, poder, energia = 100, felicidad = 100, hambre = 0, sed = 0, cansancio = 0, estres = 0, enfermedades = [], muerto = false, fechaCreacion = null, fechaUltimaActualizacion = null) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.elemento = elemento;
        this.poder = poder;
        this.energia = energia;
        this.felicidad = felicidad;
        this.hambre = hambre;
        this.sed = sed;
        this.cansancio = cansancio;
        this.estres = estres;
        this.enfermedades = enfermedades;
        this.muerto = muerto;
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
        this.fechaUltimaActualizacion = fechaUltimaActualizacion || new Date().toISOString();
        
        // Propiedades adicionales para compatibilidad
        this.estado = this.muerto ? "Dead" : "Alive";
        this.enfermo = this.enfermedades.length > 0;
        this.ultimoCuidado = this.fechaUltimaActualizacion;
        this.viva = !this.muerto;
        this.fechaMuerte = this.muerto ? this.fechaUltimaActualizacion : null;
        this.causaMuerte = this.muerto ? "Desconocida" : null;
        
        // Propiedades básicas para compatibilidad
        this.rareza = "Común";
        this.habilidadesEspeciales = [this.poder];
        this.estadisticasEspeciales = { poder: 50 };
        this.personalidad = "Amigable";
        this.habitat = "Tierra";
        this.nivelPoder = 50;
        this.resistencias = ["Básica"];
        this.debilidades = ["Descuido"];
        this.vulnerabilidades = ["Estrés"];
        this.fortalezas = ["Resistencia básica"];
        
        // Sistema de enfermedades
        this.condicionesMedicas = this.enfermedades;
        
        // Aplicar efectos de enfermedades al inicializar
        this.aplicarEfectosEnfermedades();
    }

    // Método para aplicar efectos de enfermedades
    aplicarEfectosEnfermedades() {
        if (!this.condicionesMedicas || this.condicionesMedicas.length === 0) return;
        
        this.condicionesMedicas.forEach(enfermedad => {
            const enfermedadInfo = ENFERMEDADES[enfermedad];
            if (enfermedadInfo && enfermedadInfo.efectos) {
                const efectos = enfermedadInfo.efectos;
                
                if (efectos.energia) this.energia = Math.max(0, this.energia + efectos.energia);
                if (efectos.felicidad) this.felicidad = Math.max(0, this.felicidad + efectos.felicidad);
                if (efectos.estres) this.estres = Math.min(100, this.estres + efectos.estres);
            }
        });
    }

    // Método para generar variaciones dinámicas en estadísticas
    generarVariacionesEstadisticas() {
        const variacion = {
            energia: this.energia + this.generarVariacionAleatoria(5),
            felicidad: this.felicidad + this.generarVariacionAleatoria(8),
            hambre: this.hambre + this.generarVariacionAleatoria(3),
            sed: this.sed + this.generarVariacionAleatoria(3),
            cansancio: this.cansancio + this.generarVariacionAleatoria(4),
            estres: this.estres + this.generarVariacionAleatoria(6)
        };

        // Aplicar límites
        variacion.energia = Math.max(0, Math.min(100, variacion.energia));
        variacion.felicidad = Math.max(0, Math.min(100, variacion.felicidad));
        variacion.hambre = Math.max(0, Math.min(100, variacion.hambre));
        variacion.sed = Math.max(0, Math.min(100, variacion.sed));
        variacion.cansancio = Math.max(0, Math.min(100, variacion.cansancio));
        variacion.estres = Math.max(0, Math.min(100, variacion.estres));

        return variacion;
    }

    // Método auxiliar para generar variaciones aleatorias
    generarVariacionAleatoria(maximo) {
        return Math.floor(Math.random() * (maximo * 2 + 1)) - maximo;
    }

    // Métodos auxiliares para obtener estados descriptivos
    obtenerEstadoHambre(hambre) {
        if (hambre >= 80) return "Hambriento extremo";
        if (hambre >= 60) return "Muy hambriento";
        if (hambre >= 40) return "Hambriento";
        if (hambre >= 20) return "Ligeramente hambriento";
        return "Satisfecho";
    }

    obtenerEstadoSed(sed) {
        if (sed >= 80) return "Sediento extremo";
        if (sed >= 60) return "Muy sediento";
        if (sed >= 40) return "Sediento";
        if (sed >= 20) return "Ligeramente sediento";
        return "Hidratado";
    }

    obtenerEstadoCansancio(cansancio) {
        if (cansancio >= 80) return "Agotado";
        if (cansancio >= 60) return "Muy cansado";
        if (cansancio >= 40) return "Cansado";
        if (cansancio >= 20) return "Ligeramente cansado";
        return "Descansado";
    }

    obtenerEstadoEstres(estres) {
        if (estres >= 80) return "Muy estresado";
        if (estres >= 60) return "Estresado";
        if (estres >= 40) return "Ligeramente estresado";
        if (estres >= 20) return "Tranquilo";
        return "Muy tranquilo";
    }

    obtenerEstadoEnergia(energia) {
        if (energia >= 80) return "Muy energético";
        if (energia >= 60) return "Energético";
        if (energia >= 40) return "Normal";
        if (energia >= 20) return "Bajo de energía";
        return "Sin energía";
    }

    obtenerEstadoFelicidad(felicidad) {
        if (felicidad >= 80) return "Muy feliz";
        if (felicidad >= 60) return "Feliz";
        if (felicidad >= 40) return "Normal";
        if (felicidad >= 20) return "Triste";
        return "Muy triste";
    }

    // Método para obtener estadísticas con variaciones dinámicas
    obtenerEstadisticasConVariaciones() {
        const variaciones = this.generarVariacionesEstadisticas();
        
        // Calcular estados basados en las estadísticas
        const tieneHambre = variaciones.hambre > 50;
        const tieneSed = variaciones.sed > 50;
        const estaCansado = variaciones.cansancio > 50;
        const estaEstresado = variaciones.estres > 50;
        const tieneEnergia = variaciones.energia > 30;
        const estaFeliz = variaciones.felicidad > 50;
        
        return {
            ...this,
            energia: variaciones.energia,
            felicidad: variaciones.felicidad,
            hambre: variaciones.hambre,
            sed: variaciones.sed,
            cansancio: variaciones.cansancio,
            estres: variaciones.estres,
            estadisticasVariadas: true,
            // Estados booleanos
            tieneHambre: tieneHambre,
            tieneSed: tieneSed,
            estaCansado: estaCansado,
            estaEstresado: estaEstresado,
            tieneEnergia: tieneEnergia,
            estaFeliz: estaFeliz,
            // Estados descriptivos
            estadoHambre: this.obtenerEstadoHambre(variaciones.hambre),
            estadoSed: this.obtenerEstadoSed(variaciones.sed),
            estadoCansancio: this.obtenerEstadoCansancio(variaciones.cansancio),
            estadoEstrés: this.obtenerEstadoEstres(variaciones.estres),
            estadoEnergia: this.obtenerEstadoEnergia(variaciones.energia),
            estadoFelicidad: this.obtenerEstadoFelicidad(variaciones.felicidad),
            variaciones: {
                energia: variaciones.energia - this.energia,
                felicidad: variaciones.felicidad - this.felicidad,
                hambre: variaciones.hambre - this.hambre,
                sed: variaciones.sed - this.sed,
                cansancio: variaciones.cansancio - this.cansancio,
                estres: variaciones.estres - this.estres
            }
        };
    }

    // Método para asignar enfermedades aleatorias basadas en condiciones
    asignarEnfermedadAleatoria() {
        if (!this.viva) return null;
        
        const enfermedadesDisponibles = Object.keys(ENFERMEDADES);
        const enfermedadAleatoria = enfermedadesDisponibles[Math.floor(Math.random() * enfermedadesDisponibles.length)];
        
        return this.enfermar(enfermedadAleatoria);
    }

    // Método para asignar enfermedades basadas en condiciones específicas
    asignarEnfermedadPorCondicion(condicion) {
        if (!this.viva) return null;
        
        const enfermedadesPorCondicion = {
            'hambre_extrema': ['parasitos', 'problemas_dentales'],
            'sed_extrema': ['infeccion_oido', 'alergia'],
            'estres_alto': ['ansiedad', 'depresion', 'sindrome_pelo'],
            'cansancio_extremo': ['gripe', 'sarna'],
            'sobrealimentacion': ['pelos_estomago', 'bola_pelo_grave', 'parasitos'],
            'sobrehidratacion': ['sarna', 'infeccion_oido'],
            'ejercicio_excesivo': ['pata_rota', 'ansiedad'],
            'descanso_excesivo': ['depresion', 'problemas_dentales', 'gastritis_pelo'],
            'acicalamiento_excesivo': ['pelos_estomago', 'sindrome_pelo', 'gastritis_pelo'],
            'negligencia_aseo': ['obstruccion_pelo', 'bola_pelo_grave', 'pelos_estomago']
        };
        
        const enfermedadesPosibles = enfermedadesPorCondicion[condicion] || ['gripe'];
        const enfermedadElegida = enfermedadesPosibles[Math.floor(Math.random() * enfermedadesPosibles.length)];
        
        return this.enfermar(enfermedadElegida);
    }



    // Generar vulnerabilidades específicas
    generarVulnerabilidades(tipo) {
        const vulnerabilidades = {
            "Dragón": ["Frío extremo", "Falta de espacio", "Soledad"],
            "Unicornio": ["Impureza ambiental", "Negatividad", "Lugares oscuros"],
            "Sirena": ["Sequía", "Contaminación del agua", "Alejamiento del mar"],
            "Cerbero": ["Música celestial", "Luz intensa", "Paz extrema"],
            "Wendigo": ["Calor extremo", "Abundancia de comida", "Compañía social"],
            "Banshee": ["Alegría extrema", "Ruido fuerte", "Luz del sol"],
            "Leviatán": ["Aguas poco profundas", "Contaminación marina", "Ruidos fuertes"]
        };
        return vulnerabilidades[this.tipo] || ["Descuido", "Estrés", "Enfermedad"];
    }

    // Generar fortalezas específicas
    generarFortalezas(tipo) {
        const fortalezas = {
            "Dragón": ["Resistencia al fuego", "Longevidad", "Poder regenerativo"],
            "Fénix": ["Regeneración completa", "Inmunidad al fuego", "Renacimiento"],
            "Unicornio": ["Purificación", "Curación natural", "Resistencia mágica"],
            "Kraken": ["Resistencia presión", "Curación en agua", "Longevidad marina"],
            "Lich": ["Inmunidad enfermedades", "No necesita comida", "Inmortalidad"],
            "Djinn": ["Forma etérea", "Autoregeneración", "Independencia física"]
        };
        return fortalezas[this.tipo] || ["Resistencia básica", "Adaptabilidad"];
    }

    // Eliminar métodos y referencias a lógica antigua de salud, peso, esperanza de vida, factores de salud, y degradación realista
    // Mantener solo lógica simple de energía, felicidad, hambre, sed, cansancio, estres, enfermedades, matar y revivir
    // Método principal que reemplaza disminuirVida()
    disminuirVida() {
        this.verificarMuerte();
    }

    // Método para matar mascota (por negligencia extrema)
    matarMascota(causa = "Negligencia extrema") {
        this.energia = 0;
        this.viva = false;
        this.muerto = true;
        this.estado = "Dead";
        this.enfermo = true;
        
        // Agregar enfermedad de muerte
        if (!this.condicionesMedicas) this.condicionesMedicas = [];
        if (!this.enfermedades) this.enfermedades = [];
        
        // Agregar condición de muerte
        if (!this.condicionesMedicas.includes('muerte')) {
            this.condicionesMedicas.push('muerte');
        }
        if (!this.enfermedades.includes('Muerte')) {
            this.enfermedades.push('Muerte');
        }
        
        this.fechaMuerte = new Date().toISOString();
        this.causaMuerte = causa;
        this.fechaUltimaActualizacion = new Date().toISOString();
        return {
            exito: true,
            mensaje: `💀 ${this.tipo} ha muerto por ${causa}`,
            fechaMuerte: this.fechaMuerte,
            causa: causa,
            mascota: this
        };
    }

    // Verificar si la mascota ha muerto
    verificarMuerte() {
        if (this.energia <= 0 && this.viva) {
            this.viva = false;
            this.estado = "Dead";
            this.enfermo = true;
            this.fechaMuerte = new Date().toISOString();
            this.causaMuerte = "Energía agotada";
            return true;
        }
        return false;
    }

    // Verificar si la mascota puede ser revivida
    puedeSerRevivida() {
        const especiesInmortales = ["Fénix", "Lich", "Djinn", "Banshee"];
        const especiesRevivibles = ["Fénix", "Unicornio", "Dragón", "Kraken"];
        
        if (especiesInmortales.includes(this.tipo)) {
            return true;
        }
        
        if (especiesRevivibles.includes(this.tipo) && this.fechaMuerte) {
            const tiempoMuerta = (new Date() - new Date(this.fechaMuerte)) / (1000 * 60 * 60 * 24);
            return tiempoMuerta <= 7; // Solo se puede revivir dentro de 7 días
        }
        
        return false;
    }

    // Revivir mascota (solo ciertas especies)
    revivirMascota() {
        if (!this.puedeSerRevivida()) {
            throw new Error(`${this.tipo} no puede ser revivido`);
        }
        
        this.viva = true;
        this.muerto = false;
        this.energia = 30;
        this.estado = "Sick";
        this.enfermo = true;
        this.fechaMuerte = null;
        this.causaMuerte = null;
        this.fechaUltimaActualizacion = new Date().toISOString();
        
        return {
            exito: true,
            mensaje: `✨ ${this.tipo} ha sido revivido mágicamente`,
            mascota: this
        };
    }

    // Método mejorado para alimentar con consecuencias lógicas
    alimentar(cantidad = 30) {
        if (!this.viva) return { exito: false, mensaje: "No puedes alimentar una mascota muerta" };
        
        // Verificar si ya está muy llena
        if (this.hambre < 10 && cantidad > 20) {
            this.estres = Math.min(100, this.estres + 15);
            return { 
                exito: false, 
                mensaje: `${this.tipo} rechaza la comida - ya está muy lleno. Esto le causó estrés.`,
                efectos: "Estrés +15"
            };
        }

        // ALIMENTACIÓN EXTREMADAMENTE EXCESIVA - ENFERMEDAD GARANTIZADA
        if (cantidad > 100) {
            this.hambre = Math.max(0, this.hambre - cantidad);
            this.energia = Math.max(0, this.energia - 30);
            this.estres = Math.min(100, this.estres + 40);
            
            // Enfermedad garantizada por sobrealimentación extrema
            this.enfermar(ENFERMEDADES['pelos_estomago'].nombre);
            
            this.ultimoCuidado = new Date().toISOString();
            
            return { 
                exito: true, 
                mensaje: `${this.tipo} comió una cantidad excesiva y se enfermó de ${ENFERMEDADES['pelos_estomago'].nombre}!`,
                efectos: "¡SOBREALIMENTACIÓN EXTREMA! Energía -30, Estrés +40, ENFERMEDAD GARANTIZADA",
                enfermedad: ENFERMEDADES['pelos_estomago'].nombre
            };
        }

        // ALIMENTACIÓN EXCESIVA - RIESGO DE MUERTE
        if (cantidad > 80) {
            this.hambre = Math.max(0, this.hambre - cantidad);
            this.energia = Math.max(0, this.energia - 20);
            this.estres = Math.min(100, this.estres + 30);
            
            // Probabilidad de muerte por sobrealimentación
            if (Math.random() < 0.3) {
                this.matarMascota("Sobrealimentación extrema");
                return { 
                    exito: true, 
                    mensaje: `${this.tipo} comió en exceso y murió por sobrealimentación!`,
                    efectos: "¡MUERTE POR SOBREALIMENTACIÓN!",
                    muerte: true
                };
            }
            
            // Probabilidad de enfermedad
            if (Math.random() < 0.5) {
                this.enfermar(ENFERMEDADES['pelos_estomago'].nombre); // Usar el nombre de la enfermedad
                
                this.ultimoCuidado = new Date().toISOString();
                
                return { 
                    exito: true, 
                    mensaje: `${this.tipo} comió en exceso y se enfermó de ${ENFERMEDADES['pelos_estomago'].nombre}!`,
                    efectos: "¡SOBREALIMENTACIÓN! Energía -20, Estrés +30, ENFERMEDAD",
                    enfermedad: ENFERMEDADES['pelos_estomago'].nombre
                };
            }
            
            this.ultimoCuidado = new Date().toISOString();
            
            return { 
                exito: true, 
                mensaje: `${this.tipo} comió demasiado y se siente mal.`,
                efectos: "¡SOBREALIMENTACIÓN! Energía -20, Estrés +30"
            };
        }

        // ALIMENTACIÓN NORMAL
        this.hambre = Math.max(0, this.hambre - cantidad);
        this.energia = Math.min(100, this.energia + (cantidad * 0.5));
        this.felicidad = Math.min(100, this.felicidad + 5);
        this.estres = Math.max(0, this.estres - 5);
        
        this.ultimoCuidado = new Date().toISOString();
        
        return { 
            exito: true, 
            mensaje: `${this.tipo} ha sido alimentado correctamente. Hambre: ${this.hambre}%, Energía: ${this.energia}%, Felicidad: ${this.felicidad}%` 
        };
    }

    // Método para dar agua con lógica realista
    darAgua(cantidad = 40) {
        if (this.estado === "Dead") return { exito: false, mensaje: "No puedes dar agua a una mascota muerta" };
        
        // Exceso de agua
        if (this.sed < 5 && cantidad > 30) {
            this.estres = Math.min(100, this.estres + 10);
            this.energia = Math.max(0, this.energia - 3);
            return { 
                exito: false, 
                mensaje: `${this.tipo} no quiere más agua. Forzarlo le causa estrés.`,
                efectos: "Estrés +10, Energía -3"
            };
        }

        // Hidratación excesiva (intoxicación por agua)
        if (cantidad > 80) {
            this.sed = Math.max(0, this.sed - cantidad);
            this.energia = Math.max(0, this.energia - 15);
            this.estres = Math.min(100, this.estres + 25);
            
            if (Math.random() < 0.4) {
                this.enfermar(ENFERMEDADES['sarna'].nombre); // Usar el nombre de la enfermedad
            }
            
            this.ultimoCuidado = new Date().toISOString();
            
            return { 
                exito: true, 
                mensaje: `${this.tipo} bebió demasiada agua y se siente mal. Sed: ${this.sed}%`,
                efectos: "¡SOBREHIDRATACIÓN! Energía -15, Estrés +25"
            };
        }

        // Hidratación normal
        this.sed = Math.max(0, this.sed - cantidad);
        this.energia = Math.max(36, this.energia - 0.2); // Mantener temperatura corporal
        this.ultimoCuidado = new Date().toISOString();
        
        return { 
            exito: true, 
            mensaje: `${this.tipo} ha bebido agua. Sed: ${this.sed}%, Temperatura: ${this.energia}°C` 
        };
    }

    // Método para descansar con límites lógicos
    descansar(horas = 8) {
        if (this.estado === "Dead") return { exito: false, mensaje: "Las mascotas muertas no necesitan descansar" };
        
        // Verificar si realmente necesita descanso
        if (this.cansancio < 20 && horas > 4) {
            this.estres = Math.min(100, this.estres + 10);
            this.felicidad = Math.max(0, this.felicidad - 10);
            return { 
                exito: false, 
                mensaje: `${this.tipo} no está cansado y se aburre. Necesita actividad.`,
                efectos: "Estrés +10, Felicidad -10"
            };
        }

        // Exceso de descanso (pereza)
        if (horas > 12) {
            this.cansancio = Math.max(0, this.cansancio - (horas * 8));
            this.energia = Math.min(100, this.energia + (horas * 3));
            this.estres = Math.min(100, this.estres + 15); // Se estresa por inactividad
            this.energia = Math.min(100, this.energia + (horas * 3)); // Engorda por inactividad
            
            // Puede enfermarse por sedentarismo
            if (Math.random() < 0.2) {
                this.enfermar(ENFERMEDADES['pelos_estomago'].nombre); // Usar el nombre de la enfermedad
                this.energia = Math.max(0, this.energia - 0.5);
            }
            
            this.ultimoCuidado = new Date().toISOString();
            
            return { 
                exito: true, 
                mensaje: `${this.tipo} durmió demasiado y se siente perezoso. Cansancio: ${this.cansancio}%`,
                efectos: "¡EXCESO DE DESCANSO! Estrés +15, Energía +30"
            };
        }

        // Descanso normal
        this.cansancio = Math.max(0, this.cansancio - (horas * 10));
        this.energia = Math.min(100, this.energia + (horas * 5));
        this.estres = Math.max(0, this.estres - (horas * 2));
        this.ultimoCuidado = new Date().toISOString();
        
        return { 
            exito: true, 
            mensaje: `${this.tipo} ha descansado ${horas} horas. Cansancio: ${this.cansancio}%, Energía: ${this.energia}%` 
        };
    }

    // Método para ejercitar con consecuencias realistas
    ejercitar(intensidad = 30) {
        if (this.estado === "Dead") return { exito: false, mensaje: "Las mascotas muertas no pueden ejercitarse" };
        
        // Verificar condiciones para ejercitarse
        if (this.energia < 15) {
            return { 
                exito: false, 
                mensaje: `${this.tipo} está demasiado cansado para ejercitarse. Necesita descansar.`,
                efectos: "Energía insuficiente"
            };
        }

        if (this.hambre > 85) {
            this.energia = Math.max(0, this.energia - 10);
            return { 
                exito: false, 
                mensaje: `${this.tipo} está muy hambriento. Ejercitarse sin comer le hizo daño.`,
                efectos: "Energía -10 por ejercitarse con hambre"
            };
        }

        if (this.sed > 80) {
            this.energia = Math.max(0, this.energia - 8);
            this.energia = Math.max(36, this.energia + 0.8); // Mantener temperatura corporal
            return { 
                exito: false, 
                mensaje: `${this.tipo} está deshidratado. El ejercicio le causó sobrecalentamiento.`,
                efectos: "Energía -8, Temperatura +0.8°C"
            };
        }

        // Ejercicio excesivo
        if (intensidad > 70) {
            this.estres = Math.max(0, this.estres - intensidad);
            this.felicidad = Math.min(100, this.felicidad + (intensidad * 0.3));
            this.hambre = Math.min(100, this.hambre + (intensidad * 1.2)); // Mucha hambre
            this.sed = Math.min(100, this.sed + (intensidad * 1.0)); // Mucha sed
            this.cansancio = Math.min(100, this.cansancio + (intensidad * 1.0)); // Muy cansado
            this.energia = Math.max(0, this.energia - (intensidad * 0.8));
            this.energia = Math.max(this.calcularPesoIdeal() * 0.6, this.energia - (intensidad * 0.01)); // Peso
            this.energia = Math.min(40, this.energia + 1.5); // Sobrecalentamiento
            
            // Riesgo de lesión o agotamiento
            if (Math.random() < 0.3) {
                this.enfermar(ENFERMEDADES['pata_rota'].nombre); // Usar el nombre de la enfermedad
                this.energia = Math.max(0, this.energia - 20);
            }
            
            this.ultimoCuidado = new Date().toISOString();
            
            return { 
                exito: true, 
                mensaje: `${this.tipo} se ejercitó intensamente pero está agotado. Estrés: ${this.estres}%`,
                efectos: "¡SOBREEJERCICIO! Agotamiento, sobrecalentamiento, riesgo de lesión"
            };
        }

        // Ejercicio normal
        this.estres = Math.max(0, this.estres - intensidad);
        this.felicidad = Math.min(100, this.felicidad + (intensidad * 0.5));
        this.hambre = Math.min(100, this.hambre + (intensidad * 0.8));
        this.cansancio = Math.min(100, this.cansancio + (intensidad * 0.6));
        this.energia = Math.max(0, this.energia - (intensidad * 0.4));
        this.energia = Math.max(this.calcularPesoIdeal() * 0.8, this.energia - (intensidad * 0.005)); // Peso
        this.energia = Math.min(100, this.energia + 2); // Mejora inmunidad
        
        this.ultimoCuidado = new Date().toISOString();
        
        return { 
            exito: true, 
            mensaje: `${this.tipo} ha hecho ejercicio saludable. Estrés: ${this.estres}%, Felicidad: ${this.felicidad}%`,
            efectos: "Ejercicio beneficioso, inmunidad +2"
        };
    }

    // Sistema de condiciones médicas
    agregarCondicionMedica(condicion) {
        if (!this.condicionesMedicas) {
            this.condicionesMedicas = [];
        }
        
        if (!this.condicionesMedicas.includes(condicion)) {
            this.condicionesMedicas.push(condicion);
        }
    }

    enfermar(tipo) {
        if (!this.viva) return { exito: false, mensaje: "No puedes enfermar una mascota muerta" };
        
        // Buscar la enfermedad por nombre o clave
        let enfermedadKey = null;
        let enfermedadInfo = null;
        
        // Primero buscar por clave exacta
        if (ENFERMEDADES[tipo]) {
            enfermedadKey = tipo;
            enfermedadInfo = ENFERMEDADES[tipo];
        } else {
            // Buscar por nombre
            for (const [key, info] of Object.entries(ENFERMEDADES)) {
                if (info.nombre === tipo) {
                    enfermedadKey = key;
                    enfermedadInfo = info;
                    break;
                }
            }
        }
        
        if (!enfermedadInfo) {
            return { exito: false, mensaje: `Enfermedad ${tipo} no reconocida` };
        }
        
        if (!this.condicionesMedicas) this.condicionesMedicas = [];
        if (!this.enfermedades) this.enfermedades = [];
        
        // Agregar a ambas arrays para sincronización
        if (!this.condicionesMedicas.includes(enfermedadKey)) {
            this.condicionesMedicas.push(enfermedadKey);
        }
        if (!this.enfermedades.includes(enfermedadInfo.nombre)) {
            this.enfermedades.push(enfermedadInfo.nombre);
        }
        
        this.enfermo = true;
        
        // Aplicar efectos específicos de la enfermedad
        if (enfermedadInfo.efectos) {
            const efectos = enfermedadInfo.efectos;
            
            if (efectos.energia) this.energia = Math.max(0, this.energia + efectos.energia);
            if (efectos.felicidad) this.felicidad = Math.max(0, this.felicidad + efectos.felicidad);
            if (efectos.estres) this.estres = Math.min(100, this.estres + efectos.estres);
        }
        
        this.ultimoCuidado = new Date().toISOString();
        
        return { 
            exito: true, 
            mensaje: `${this.tipo} se ha enfermado de ${enfermedadInfo.nombre}`,
            enfermedad: enfermedadInfo.nombre,
            efectos: enfermedadInfo.efectos,
            duracion: enfermedadInfo.duracion,
            sintomas: enfermedadInfo.sintomas
        };
    }

    curar(tipo) {
        if (!this.viva) return { exito: false, mensaje: "No puedes curar una mascota muerta" };
        
        if (!this.condicionesMedicas) this.condicionesMedicas = [];
        if (!this.enfermedades) this.enfermedades = [];
        
        if (tipo) {
            // Buscar la enfermedad por nombre o clave
            let enfermedadKey = null;
            let enfermedadInfo = null;
            
            // Primero buscar por clave exacta
            if (ENFERMEDADES[tipo]) {
                enfermedadKey = tipo;
                enfermedadInfo = ENFERMEDADES[tipo];
            } else {
                // Buscar por nombre
                for (const [key, info] of Object.entries(ENFERMEDADES)) {
                    if (info.nombre === tipo) {
                        enfermedadKey = key;
                        enfermedadInfo = info;
                        break;
                    }
                }
            }
            
            if (!enfermedadInfo) {
                return { exito: false, mensaje: `Enfermedad ${tipo} no reconocida` };
            }
            
            // Curar enfermedad específica
            const idxCondiciones = this.condicionesMedicas.indexOf(enfermedadKey);
            const idxEnfermedades = this.enfermedades.indexOf(enfermedadInfo.nombre);
            
            if (idxCondiciones !== -1) {
                this.condicionesMedicas.splice(idxCondiciones, 1);
            }
            if (idxEnfermedades !== -1) {
                this.enfermedades.splice(idxEnfermedades, 1);
            }
            
            if (this.condicionesMedicas.length === 0) this.enfermo = false;
            this.energia = Math.min(100, this.energia + 15);
            this.felicidad = Math.min(100, this.felicidad + 10);
            this.estres = Math.max(0, this.estres - 20);
            this.ultimoCuidado = new Date().toISOString();
            
            return { 
                exito: true, 
                mensaje: `${this.tipo} ha sido curado de ${enfermedadInfo.nombre}`,
                enfermedadCurada: enfermedadInfo.nombre
            };
        } else {
            // Curar todas las enfermedades
            if (!this.enfermo) {
                return { exito: false, mensaje: `${this.tipo} no está enfermo` };
            }
            
            this.enfermo = false;
            this.condicionesMedicas = [];
            this.enfermedades = [];
            this.energia = Math.min(100, this.energia + 20);
            this.felicidad = Math.min(100, this.felicidad + 15);
            this.estres = Math.max(0, this.estres - 30);
            this.ultimoCuidado = new Date().toISOString();
            
            return { 
                exito: true, 
                mensaje: `${this.tipo} ha sido curado completamente de todas las enfermedades`,
                curacionCompleta: true
            };
        }
    }

    // Métodos específicos para problemas de pelo de estómago
    desarrollarProblemaPelo(gravedad = 'leve') {
        if (!this.viva) return { exito: false, mensaje: "No puedes afectar una mascota muerta" };
        
        const problemasPelo = {
            'leve': 'pelos_estomago',
            'moderado': 'bola_pelo_grave',
            'grave': 'obstruccion_pelo',
            'gastritis': 'gastritis_pelo',
            'conductual': 'sindrome_pelo'
        };
        
        const enfermedadKey = problemasPelo[gravedad];
        if (!enfermedadKey) {
            return { exito: false, mensaje: `Gravedad ${gravedad} no reconocida` };
        }
        
        return this.enfermar(enfermedadKey);
    }

    // Método para cepillar y prevenir problemas de pelo
    cepillarPelo(intensidad = 'normal') {
        if (!this.viva) return { exito: false, mensaje: "No puedes cepillar una mascota muerta" };
        
        const beneficiosCepillado = {
            'suave': { felicidad: +5, estres: -3, energia: +2 },
            'normal': { felicidad: +10, estres: -8, energia: +5 },
            'intenso': { felicidad: +15, estres: -12, energia: +8 }
        };
        
        const beneficios = beneficiosCepillado[intensidad] || beneficiosCepillado.normal;
        
        // Aplicar beneficios
        this.felicidad = Math.min(100, this.felicidad + beneficios.felicidad);
        this.estres = Math.max(0, this.estres - beneficios.estres);
        this.energia = Math.min(100, this.energia + beneficios.energia);
        
        // Reducir riesgo de problemas de pelo
        const enfermedadesPelo = ['pelos_estomago', 'bola_pelo_grave', 'obstruccion_pelo', 'gastritis_pelo', 'sindrome_pelo'];
        const enfermedadesActuales = this.condicionesMedicas.filter(enfermedad => enfermedadesPelo.includes(enfermedad));
        
        if (enfermedadesActuales.length > 0) {
            // Mejorar síntomas de enfermedades existentes
            this.energia = Math.min(100, this.energia + 5);
            this.felicidad = Math.min(100, this.felicidad + 3);
            this.estres = Math.max(0, this.estres - 5);
        }
        
        this.ultimoCuidado = new Date().toISOString();
        
        return {
            exito: true,
            mensaje: `${this.tipo} ha sido cepillado con intensidad ${intensidad}`,
            efectos: `Felicidad +${beneficios.felicidad}, Estrés -${beneficios.estres}, Energía +${beneficios.energia}`,
            prevencionPelo: enfermedadesActuales.length > 0 ? "Mejorando síntomas de problemas de pelo existentes" : "Prevención activa de problemas de pelo"
        };
    }

    // Método para aplicar tratamientos específicos para pelo
    aplicarTratamientoPelo(tratamiento) {
        if (!this.viva) return { exito: false, mensaje: "No puedes tratar una mascota muerta" };
        
        const tratamientosDisponibles = {
            'pasta_malta': {
                nombre: 'Pasta de malta',
                efectividad: 0.7,
                enfermedades: ['pelos_estomago', 'bola_pelo_grave'],
                efectos: { energia: +10, felicidad: +5, estres: -8 }
            },
            'aceite_oliva': {
                nombre: 'Aceite de oliva',
                efectividad: 0.6,
                enfermedades: ['pelos_estomago', 'gastritis_pelo'],
                efectos: { energia: +8, felicidad: +3, estres: -5 }
            },
            'fibra_extra': {
                nombre: 'Suplemento de fibra',
                efectividad: 0.8,
                enfermedades: ['pelos_estomago', 'bola_pelo_grave', 'obstruccion_pelo'],
                efectos: { energia: +12, felicidad: +8, estres: -10 }
            },
            'laxante_veterinario': {
                nombre: 'Laxante veterinario',
                efectividad: 0.9,
                enfermedades: ['bola_pelo_grave', 'obstruccion_pelo'],
                efectos: { energia: +15, felicidad: +10, estres: -15 }
            }
        };
        
        const tratamientoInfo = tratamientosDisponibles[tratamiento];
        if (!tratamientoInfo) {
            return { exito: false, mensaje: `Tratamiento ${tratamiento} no reconocido` };
        }
        
        // Aplicar efectos del tratamiento
        const efectos = tratamientoInfo.efectos;
        this.energia = Math.min(100, this.energia + efectos.energia);
        this.felicidad = Math.min(100, this.felicidad + efectos.felicidad);
        this.estres = Math.max(0, this.estres - efectos.estres);
        
        // Intentar curar enfermedades específicas
        let enfermedadesCuradas = [];
        const enfermedadesPelo = this.condicionesMedicas.filter(enfermedad => 
            tratamientoInfo.enfermedades.includes(enfermedad)
        );
        
        enfermedadesPelo.forEach(enfermedad => {
            if (Math.random() < tratamientoInfo.efectividad) {
                const resultado = this.curar(enfermedad);
                if (resultado.exito) {
                    enfermedadesCuradas.push(ENFERMEDADES[enfermedad]?.nombre || enfermedad);
                }
            }
        });
        
        this.ultimoCuidado = new Date().toISOString();
        
        return {
            exito: true,
            mensaje: `${this.tipo} ha recibido tratamiento con ${tratamientoInfo.nombre}`,
            efectos: `Energía +${efectos.energia}, Felicidad +${efectos.felicidad}, Estrés -${efectos.estres}`,
            enfermedadesCuradas: enfermedadesCuradas,
            efectividad: tratamientoInfo.efectividad
        };
    }

    // Método para obtener información detallada sobre problemas de pelo
    obtenerInfoProblemasPelo() {
        const enfermedadesPelo = this.condicionesMedicas.filter(enfermedad => 
            ['pelos_estomago', 'bola_pelo_grave', 'obstruccion_pelo', 'gastritis_pelo', 'sindrome_pelo'].includes(enfermedad)
        );
        
        if (enfermedadesPelo.length === 0) {
            return {
                tieneProblemas: false,
                mensaje: `${this.tipo} no tiene problemas de pelo actualmente`,
                recomendaciones: ['Cepillado regular', 'Dieta rica en fibra', 'Monitoreo del acicalamiento']
            };
        }
        
        const infoEnfermedades = enfermedadesPelo.map(enfermedad => {
            const info = ENFERMEDADES[enfermedad];
            return {
                nombre: info.nombre,
                sintomas: info.sintomas,
                duracion: info.duracion,
                descripcion: info.descripcion,
                tratamientos: info.tratamientos,
                prevencion: info.prevencion
            };
        });
        
        return {
            tieneProblemas: true,
            cantidad: enfermedadesPelo.length,
            enfermedades: infoEnfermedades,
            gravedad: this.calcularGravedadProblemasPelo(),
            recomendaciones: this.generarRecomendacionesPelo(infoEnfermedades)
        };
    }

    // Método auxiliar para calcular gravedad de problemas de pelo
    calcularGravedadProblemasPelo() {
        const enfermedadesPelo = this.condicionesMedicas.filter(enfermedad => 
            ['pelos_estomago', 'bola_pelo_grave', 'obstruccion_pelo', 'gastritis_pelo', 'sindrome_pelo'].includes(enfermedad)
        );
        
        if (enfermedadesPelo.includes('obstruccion_pelo')) return 'CRÍTICA';
        if (enfermedadesPelo.includes('bola_pelo_grave')) return 'GRAVE';
        if (enfermedadesPelo.includes('gastritis_pelo')) return 'MODERADA';
        if (enfermedadesPelo.includes('pelos_estomago')) return 'LEVE';
        return 'SIN PROBLEMAS';
    }

    // Método auxiliar para generar recomendaciones específicas
    generarRecomendacionesPelo(enfermedades) {
        const recomendaciones = [];
        
        enfermedades.forEach(enfermedad => {
            if (enfermedad.nombre.includes('Obstrucción')) {
                recomendaciones.push('URGENTE: Consulta veterinaria inmediata');
                recomendaciones.push('No alimentar hasta evaluación médica');
            } else if (enfermedad.nombre.includes('Bola de pelo grave')) {
                recomendaciones.push('Aplicar laxante veterinario');
                recomendaciones.push('Monitoreo de síntomas');
            } else if (enfermedad.nombre.includes('Gastritis')) {
                recomendaciones.push('Dieta blanda por 24-48 horas');
                recomendaciones.push('Antiácidos si es necesario');
            } else if (enfermedad.nombre.includes('Síndrome')) {
                recomendaciones.push('Identificar causas de estrés');
                recomendaciones.push('Enriquecimiento ambiental');
            } else {
                recomendaciones.push('Cepillado diario');
                recomendaciones.push('Pasta de malta preventiva');
            }
        });
        
        return [...new Set(recomendaciones)]; // Eliminar duplicados
    }

} 