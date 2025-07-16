import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testEnfermedades() {
    console.log('🧪 Probando el sistema de enfermedades y estadísticas dinámicas...\n');

    try {
        // 1. Obtener todas las mascotas para ver las variaciones dinámicas
        console.log('1. Obteniendo mascotas con estadísticas dinámicas...');
        const response1 = await fetch(`${BASE_URL}/mascotas`);
        const data1 = await response1.json();
        
        if (data1.mascotas && data1.mascotas.length > 0) {
            const mascota = data1.mascotas[0];
            console.log(`✅ Mascota encontrada: ${mascota.nombre} (${mascota.tipo})`);
            console.log(`📊 Estadísticas con variaciones:`);
            console.log(`   - Energía: ${mascota.energia} (variación: ${mascota.variaciones?.energia || 0})`);
            console.log(`   - Felicidad: ${mascota.felicidad} (variación: ${mascota.variaciones?.felicidad || 0})`);
            console.log(`   - Hambre: ${mascota.hambre} (variación: ${mascota.variaciones?.hambre || 0})`);
            console.log(`   - Estrés: ${mascota.estres} (variación: ${mascota.variaciones?.estres || 0})`);
            console.log(`   - Enfermedades: ${mascota.enfermedades?.length || 0}`);
            console.log(`   - Estadísticas variadas: ${mascota.estadisticasVariadas ? 'Sí' : 'No'}\n`);

            // 2. Probar alimentación excesiva (>100) para garantizar enfermedad
            console.log('2. Probando alimentación excesiva (>100) para garantizar enfermedad...');
            const response2 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/alimentar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cantidad: 150 })
            });
            const data2 = await response2.json();
            
            if (data2.exito) {
                console.log(`✅ ${data2.mensaje}`);
                console.log(`📊 Efectos: ${data2.efectos}`);
                console.log(`🦠 Enfermedad: ${data2.enfermedad}\n`);
            } else {
                console.log(`❌ Error: ${data2.mensaje}\n`);
            }

            // 3. Probar enfermedad aleatoria
            console.log('3. Probando enfermedad aleatoria...');
            const response3 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/enfermar-aleatorio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data3 = await response3.json();
            
            if (data3.enfermedad) {
                console.log(`✅ ${data3.mensaje}`);
                console.log(`🦠 Enfermedad: ${data3.enfermedad}`);
                console.log(`📊 Efectos: ${JSON.stringify(data3.efectos)}`);
                console.log(`⏱️ Duración: ${data3.duracion}`);
                console.log(`💊 Síntomas: ${data3.sintomas}\n`);
            } else {
                console.log(`❌ Error: ${data3.error}\n`);
            }

            // 4. Probar enfermedad por condición específica
            console.log('4. Probando enfermedad por condición específica (estrés alto)...');
            const response4 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/enfermar-aleatorio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ condicion: 'estres_alto' })
            });
            const data4 = await response4.json();
            
            if (data4.enfermedad) {
                console.log(`✅ ${data4.mensaje}`);
                console.log(`🦠 Enfermedad: ${data4.enfermedad}`);
                console.log(`📊 Efectos: ${JSON.stringify(data4.efectos)}`);
                console.log(`⏱️ Duración: ${data4.duracion}`);
                console.log(`💊 Síntomas: ${data4.sintomas}\n`);
            } else {
                console.log(`❌ Error: ${data4.error}\n`);
            }

            // 5. Verificar estadísticas actualizadas
            console.log('5. Verificando estadísticas actualizadas después de las enfermedades...');
            const response5 = await fetch(`${BASE_URL}/mascotas/${mascota.id}`);
            const data5 = await response5.json();
            
            if (data5.mascota) {
                const mascotaActualizada = data5.mascota;
                console.log(`✅ Mascota: ${mascotaActualizada.nombre}`);
                console.log(`📊 Estadísticas actuales:`);
                console.log(`   - Energía: ${mascotaActualizada.energia}`);
                console.log(`   - Felicidad: ${mascotaActualizada.felicidad}`);
                console.log(`   - Estrés: ${mascotaActualizada.estres}`);
                console.log(`   - Enfermedades: ${mascotaActualizada.enfermedades?.length || 0}`);
                console.log(`   - Condiciones médicas: ${mascotaActualizada.condicionesMedicas?.length || 0}`);
                console.log(`   - Enfermo: ${mascotaActualizada.enfermo ? 'Sí' : 'No'}`);
                console.log(`   - Variaciones aplicadas: ${mascotaActualizada.estadisticasVariadas ? 'Sí' : 'No'}\n`);
            }

            // 6. Probar curación
            console.log('6. Probando curación de todas las enfermedades...');
            const response6 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/curar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data6 = await response6.json();
            
            if (data6.curacion) {
                console.log(`✅ ${data6.mensaje}`);
                console.log(`💊 Curación completa aplicada\n`);
            } else {
                console.log(`❌ Error: ${data6.error}\n`);
            }

        } else {
            console.log('❌ No se encontraron mascotas para probar');
        }

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
    }
}

// Ejecutar las pruebas
testEnfermedades(); 