import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testPelosEstomago() {
    console.log('🧪 Probando sistema completo de pelos de estómago...\n');

    try {
        // 1. Obtener una mascota
        console.log('1. Obteniendo mascota para pruebas...');
        const response1 = await fetch(`${BASE_URL}/mascotas`);
        const data1 = await response1.json();
        
        if (!data1.mascotas || data1.mascotas.length === 0) {
            console.log('❌ No hay mascotas disponibles');
            return;
        }

        const mascota = data1.mascotas[0];
        console.log(`✅ Mascota seleccionada: ${mascota.nombre} (${mascota.tipo})`);
        console.log(`📊 Estado inicial:`);
        console.log(`   - Enfermedades: ${mascota.enfermedades?.length || 0}`);
        console.log(`   - Condiciones médicas: ${mascota.condicionesMedicas?.length || 0}`);
        console.log(`   - Enfermo: ${mascota.enfermo ? 'Sí' : 'No'}\n`);

        // 2. Probar desarrollo de problemas de pelo por gravedad
        console.log('2. Probando desarrollo de problemas de pelo por gravedad...');
        const gravedades = ['leve', 'moderado', 'grave', 'gastritis', 'conductual'];
        
        for (const gravedad of gravedades) {
            console.log(`   Probando gravedad: ${gravedad}`);
            const response2 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/enfermar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tipo: gravedad === 'leve' ? 'pelos_estomago' : 
                                               gravedad === 'moderado' ? 'bola_pelo_grave' :
                                               gravedad === 'grave' ? 'obstruccion_pelo' :
                                               gravedad === 'gastritis' ? 'gastritis_pelo' : 'sindrome_pelo' })
            });
            const data2 = await response2.json();
            
            if (data2.mensaje) {
                console.log(`   ✅ ${data2.mensaje}`);
                console.log(`   📊 Enfermedades actuales: ${data2.mascota.enfermedades?.length || 0}\n`);
            } else {
                console.log(`   ❌ Error: ${data2.error}\n`);
            }
        }

        // 3. Probar cepillado de pelo con diferentes intensidades
        console.log('3. Probando cepillado de pelo con diferentes intensidades...');
        const intensidades = ['suave', 'normal', 'intenso'];
        
        for (const intensidad of intensidades) {
            console.log(`   Probando cepillado: ${intensidad}`);
            const response3 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/cepillar-pelo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intensidad: intensidad })
            });
            const data3 = await response3.json();
            
            if (data3.exito) {
                console.log(`   ✅ ${data3.mensaje}`);
                console.log(`   📊 Efectos: ${data3.efectos}`);
                console.log(`   🛡️ Prevención: ${data3.prevencionPelo}\n`);
            } else {
                console.log(`   ❌ Error: ${data3.error}\n`);
            }
        }

        // 4. Probar tratamientos específicos para pelo
        console.log('4. Probando tratamientos específicos para pelo...');
        const tratamientos = ['pasta_malta', 'aceite_oliva', 'fibra_extra', 'laxante_veterinario'];
        
        for (const tratamiento of tratamientos) {
            console.log(`   Probando tratamiento: ${tratamiento}`);
            const response4 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/aplicar-tratamiento-pelo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tratamiento: tratamiento })
            });
            const data4 = await response4.json();
            
            if (data4.exito) {
                console.log(`   ✅ ${data4.mensaje}`);
                console.log(`   📊 Efectos: ${data4.efectos}`);
                console.log(`   💊 Enfermedades curadas: ${data4.enfermedadesCuradas?.length || 0}`);
                console.log(`   📈 Efectividad: ${Math.round(data4.efectividad * 100)}%\n`);
            } else {
                console.log(`   ❌ Error: ${data4.error}\n`);
            }
        }

        // 5. Obtener información detallada sobre problemas de pelo
        console.log('5. Obteniendo información detallada sobre problemas de pelo...');
        const response5 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/info-problemas-pelo`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data5 = await response5.json();
        
        if (data5.tieneProblemas) {
            console.log(`✅ ${data5.mensaje}`);
            console.log(`📊 Cantidad de problemas: ${data5.cantidad}`);
            console.log(`🚨 Gravedad: ${data5.gravedad}`);
            console.log(`📋 Enfermedades:`);
            data5.enfermedades.forEach((enfermedad, index) => {
                console.log(`   ${index + 1}. ${enfermedad.nombre}`);
                console.log(`      - Síntomas: ${enfermedad.sintomas}`);
                console.log(`      - Duración: ${enfermedad.duracion}`);
                console.log(`      - Descripción: ${enfermedad.descripcion}`);
                console.log(`      - Tratamientos: ${enfermedad.tratamientos.join(', ')}`);
                console.log(`      - Prevención: ${enfermedad.prevencion}`);
            });
            console.log(`💡 Recomendaciones:`);
            data5.recomendaciones.forEach((rec, index) => {
                console.log(`   ${index + 1}. ${rec}`);
            });
            console.log();
        } else {
            console.log(`✅ ${data5.mensaje}`);
            console.log(`💡 Recomendaciones preventivas:`);
            data5.recomendaciones.forEach((rec, index) => {
                console.log(`   ${index + 1}. ${rec}`);
            });
            console.log();
        }

        // 6. Probar condiciones específicas que causan problemas de pelo
        console.log('6. Probando condiciones específicas que causan problemas de pelo...');
        const condiciones = ['acicalamiento_excesivo', 'negligencia_aseo', 'estres_alto'];
        
        for (const condicion of condiciones) {
            console.log(`   Probando condición: ${condicion}`);
            const response6 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/enfermar-aleatorio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ condicion: condicion })
            });
            const data6 = await response6.json();
            
            if (data6.enfermedad) {
                console.log(`   ✅ ${data6.mensaje}`);
                console.log(`   🦠 Enfermedad: ${data6.enfermedad}`);
                console.log(`   📊 Efectos: ${JSON.stringify(data6.efectos)}`);
                console.log(`   ⏱️ Duración: ${data6.duracion}`);
                console.log(`   💊 Síntomas: ${data6.sintomas}\n`);
            } else {
                console.log(`   ❌ Error: ${data6.error}\n`);
            }
        }

        // 7. Verificar estado final
        console.log('7. Verificando estado final de la mascota...');
        const response7 = await fetch(`${BASE_URL}/mascotas/${mascota.id}`);
        const data7 = await response7.json();
        
        if (data7.mascota) {
            const mascotaFinal = data7.mascota;
            console.log(`✅ Estado final de ${mascotaFinal.nombre}:`);
            console.log(`📊 Estadísticas:`);
            console.log(`   - Energía: ${mascotaFinal.energia}`);
            console.log(`   - Felicidad: ${mascotaFinal.felicidad}`);
            console.log(`   - Estrés: ${mascotaFinal.estres}`);
            console.log(`   - Enfermo: ${mascotaFinal.enfermo ? 'Sí' : 'No'}`);
            console.log(`📋 Enfermedades (${mascotaFinal.enfermedades?.length || 0}):`);
            if (mascotaFinal.enfermedades && mascotaFinal.enfermedades.length > 0) {
                mascotaFinal.enfermedades.forEach((enfermedad, index) => {
                    console.log(`   ${index + 1}. ${enfermedad}`);
                });
            }
            console.log(`🏥 Condiciones médicas (${mascotaFinal.condicionesMedicas?.length || 0}):`);
            if (mascotaFinal.condicionesMedicas && mascotaFinal.condicionesMedicas.length > 0) {
                mascotaFinal.condicionesMedicas.forEach((condicion, index) => {
                    console.log(`   ${index + 1}. ${condicion}`);
                });
            }
            console.log();
        }

        // 8. Probar curación completa
        console.log('8. Probando curación completa...');
        const response8 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/curar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data8 = await response8.json();
        
        if (data8.curacion) {
            console.log(`✅ ${data8.mensaje}`);
            console.log(`📊 Estado después de curación:`);
            console.log(`   - Enfermedades: ${data8.mascota.enfermedades?.length || 0}`);
            console.log(`   - Condiciones médicas: ${data8.mascota.condicionesMedicas?.length || 0}`);
            console.log(`   - Enfermo: ${data8.mascota.enfermo ? 'Sí' : 'No'}`);
            console.log(`   - Energía: ${data8.mascota.energia}`);
            console.log(`   - Felicidad: ${data8.mascota.felicidad}`);
            console.log(`   - Estrés: ${data8.mascota.estres}\n`);
        } else {
            console.log(`❌ Error: ${data8.error}\n`);
        }

        console.log('🎉 Pruebas de pelos de estómago completadas exitosamente!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
    }
}

// Ejecutar las pruebas
testPelosEstomago(); 