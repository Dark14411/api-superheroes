import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testEnfermedadesCompleto() {
    console.log('🧪 Probando sistema completo de enfermedades...\n');

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

        // 2. Probar alimentación excesiva (>100) para garantizar enfermedad
        console.log('2. Probando alimentación excesiva (>100)...');
        const response2 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/alimentar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cantidad: 150 })
        });
        const data2 = await response2.json();
        
        if (data2.exito) {
            console.log(`✅ ${data2.mensaje}`);
            console.log(`📊 Efectos: ${data2.efectos}`);
            console.log(`🦠 Enfermedad: ${data2.enfermedad}`);
            console.log(`📋 Enfermedades en respuesta: ${data2.mascota.enfermedades?.length || 0}`);
            console.log(`🏥 Condiciones médicas: ${data2.mascota.condicionesMedicas?.length || 0}`);
            console.log(`🤒 Enfermo: ${data2.mascota.enfermo ? 'Sí' : 'No'}\n`);
        } else {
            console.log(`❌ Error: ${data2.mensaje}\n`);
        }

        // 3. Verificar que la enfermedad persiste al consultar la mascota
        console.log('3. Verificando persistencia de la enfermedad...');
        const response3 = await fetch(`${BASE_URL}/mascotas/${mascota.id}`);
        const data3 = await response3.json();
        
        if (data3.mascota) {
            const mascotaActualizada = data3.mascota;
            console.log(`✅ Mascota: ${mascotaActualizada.nombre}`);
            console.log(`📊 Estado después de alimentación:`);
            console.log(`   - Enfermedades: ${mascotaActualizada.enfermedades?.length || 0}`);
            console.log(`   - Condiciones médicas: ${mascotaActualizada.condicionesMedicas?.length || 0}`);
            console.log(`   - Enfermo: ${mascotaActualizada.enfermo ? 'Sí' : 'No'}`);
            if (mascotaActualizada.enfermedades && mascotaActualizada.enfermedades.length > 0) {
                console.log(`   - Lista de enfermedades: ${mascotaActualizada.enfermedades.join(', ')}`);
            }
            console.log(`   - Energía: ${mascotaActualizada.energia}`);
            console.log(`   - Felicidad: ${mascotaActualizada.felicidad}`);
            console.log(`   - Estrés: ${mascotaActualizada.estres}\n`);
        }

        // 4. Probar enfermedad aleatoria
        console.log('4. Probando enfermedad aleatoria...');
        const response4 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/enfermar-aleatorio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data4 = await response4.json();
        
        if (data4.enfermedad) {
            console.log(`✅ ${data4.mensaje}`);
            console.log(`🦠 Enfermedad: ${data4.enfermedad}`);
            console.log(`📊 Efectos: ${JSON.stringify(data4.efectos)}`);
            console.log(`⏱️ Duración: ${data4.duracion}`);
            console.log(`💊 Síntomas: ${data4.sintomas}`);
            console.log(`📋 Total enfermedades: ${data4.mascota.enfermedades?.length || 0}\n`);
        } else {
            console.log(`❌ Error: ${data4.error}\n`);
        }

        // 5. Probar enfermedad por condición específica
        console.log('5. Probando enfermedad por condición específica...');
        const response5 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/enfermar-aleatorio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ condicion: 'estres_alto' })
        });
        const data5 = await response5.json();
        
        if (data5.enfermedad) {
            console.log(`✅ ${data5.mensaje}`);
            console.log(`🦠 Enfermedad: ${data5.enfermedad}`);
            console.log(`📊 Efectos: ${JSON.stringify(data5.efectos)}`);
            console.log(`📋 Total enfermedades: ${data5.mascota.enfermedades?.length || 0}\n`);
        } else {
            console.log(`❌ Error: ${data5.error}\n`);
        }

        // 5.5. Probar nuevas condiciones específicas de pelo
        console.log('5.5. Probando condiciones específicas de pelo...');
        const condicionesPelo = ['acicalamiento_excesivo', 'negligencia_aseo'];
        
        for (const condicion of condicionesPelo) {
            console.log(`   Probando condición: ${condicion}`);
            const response5_5 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/enfermar-aleatorio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ condicion: condicion })
            });
            const data5_5 = await response5_5.json();
            
            if (data5_5.enfermedad) {
                console.log(`   ✅ ${data5_5.mensaje}`);
                console.log(`   🦠 Enfermedad: ${data5_5.enfermedad}`);
                console.log(`   📊 Efectos: ${JSON.stringify(data5_5.efectos)}`);
                console.log(`   ⏱️ Duración: ${data5_5.duracion}`);
                console.log(`   💊 Síntomas: ${data5_5.sintomas}\n`);
            } else {
                console.log(`   ❌ Error: ${data5_5.error}\n`);
            }
        }

        // 6. Verificar estado final con todas las enfermedades
        console.log('6. Verificando estado final con múltiples enfermedades...');
        const response6 = await fetch(`${BASE_URL}/mascotas/${mascota.id}`);
        const data6 = await response6.json();
        
        if (data6.mascota) {
            const mascotaFinal = data6.mascota;
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

        // 7. Probar curación completa
        console.log('7. Probando curación completa...');
        const response7 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/curar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data7 = await response7.json();
        
        if (data7.curacion) {
            console.log(`✅ ${data7.mensaje}`);
            console.log(`📊 Estado después de curación:`);
            console.log(`   - Enfermedades: ${data7.mascota.enfermedades?.length || 0}`);
            console.log(`   - Condiciones médicas: ${data7.mascota.condicionesMedicas?.length || 0}`);
            console.log(`   - Enfermo: ${data7.mascota.enfermo ? 'Sí' : 'No'}`);
            console.log(`   - Energía: ${data7.mascota.energia}`);
            console.log(`   - Felicidad: ${data7.mascota.felicidad}`);
            console.log(`   - Estrés: ${data7.mascota.estres}\n`);
        } else {
            console.log(`❌ Error: ${data7.error}\n`);
        }

        // 7.5. Probar nuevas funcionalidades de pelo de estómago
        console.log('7.5. Probando nuevas funcionalidades de pelo de estómago...');
        
        // Desarrollar problemas específicos de pelo
        console.log('   a) Desarrollando problemas específicos de pelo...');
        const gravedades = ['leve', 'moderado', 'grave', 'gastritis', 'conductual'];
        
        for (const gravedad of gravedades) {
            console.log(`      Probando gravedad: ${gravedad}`);
            const response7_5a = await fetch(`${BASE_URL}/mascotas/${mascota.id}/desarrollar-problema-pelo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gravedad: gravedad })
            });
            const data7_5a = await response7_5a.json();
            
            if (data7_5a.mensaje) {
                console.log(`      ✅ ${data7_5a.mensaje}`);
                console.log(`      🦠 Enfermedad: ${data7_5a.enfermedad}`);
                console.log(`      📊 Efectos: ${JSON.stringify(data7_5a.efectos)}`);
                console.log(`      ⏱️ Duración: ${data7_5a.duracion}`);
                console.log(`      💊 Síntomas: ${data7_5a.sintomas}\n`);
            } else {
                console.log(`      ❌ Error: ${data7_5a.error}\n`);
            }
        }

        // Cepillar pelo
        console.log('   b) Probando cepillado de pelo...');
        const intensidades = ['suave', 'normal', 'intenso'];
        
        for (const intensidad of intensidades) {
            console.log(`      Probando cepillado: ${intensidad}`);
            const response7_5b = await fetch(`${BASE_URL}/mascotas/${mascota.id}/cepillar-pelo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ intensidad: intensidad })
            });
            const data7_5b = await response7_5b.json();
            
            if (data7_5b.exito) {
                console.log(`      ✅ ${data7_5b.mensaje}`);
                console.log(`      📊 Efectos: ${data7_5b.efectos}`);
                console.log(`      🛡️ Prevención: ${data7_5b.prevencionPelo}\n`);
            } else {
                console.log(`      ❌ Error: ${data7_5b.error}\n`);
            }
        }

        // Aplicar tratamientos
        console.log('   c) Probando tratamientos específicos...');
        const tratamientos = ['pasta_malta', 'aceite_oliva', 'fibra_extra', 'laxante_veterinario'];
        
        for (const tratamiento of tratamientos) {
            console.log(`      Probando tratamiento: ${tratamiento}`);
            const response7_5c = await fetch(`${BASE_URL}/mascotas/${mascota.id}/aplicar-tratamiento-pelo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tratamiento: tratamiento })
            });
            const data7_5c = await response7_5c.json();
            
            if (data7_5c.exito) {
                console.log(`      ✅ ${data7_5c.mensaje}`);
                console.log(`      📊 Efectos: ${data7_5c.efectos}`);
                console.log(`      💊 Enfermedades curadas: ${data7_5c.enfermedadesCuradas?.length || 0}`);
                console.log(`      📈 Efectividad: ${Math.round(data7_5c.efectividad * 100)}%\n`);
            } else {
                console.log(`      ❌ Error: ${data7_5c.error}\n`);
            }
        }

        // Obtener información detallada
        console.log('   d) Obteniendo información detallada de problemas de pelo...');
        const response7_5d = await fetch(`${BASE_URL}/mascotas/${mascota.id}/info-problemas-pelo`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data7_5d = await response7_5d.json();
        
        if (data7_5d.tieneProblemas) {
            console.log(`      ✅ ${data7_5d.mensaje}`);
            console.log(`      📊 Cantidad de problemas: ${data7_5d.cantidad}`);
            console.log(`      🚨 Gravedad: ${data7_5d.gravedad}`);
            console.log(`      📋 Enfermedades:`);
            data7_5d.enfermedades.forEach((enfermedad, index) => {
                console.log(`         ${index + 1}. ${enfermedad.nombre}`);
                console.log(`            - Síntomas: ${enfermedad.sintomas}`);
                console.log(`            - Duración: ${enfermedad.duracion}`);
                console.log(`            - Descripción: ${enfermedad.descripcion}`);
                console.log(`            - Tratamientos: ${enfermedad.tratamientos.join(', ')}`);
                console.log(`            - Prevención: ${enfermedad.prevencion}`);
            });
            console.log(`      💡 Recomendaciones:`);
            data7_5d.recomendaciones.forEach((rec, index) => {
                console.log(`         ${index + 1}. ${rec}`);
            });
            console.log();
        } else {
            console.log(`      ✅ ${data7_5d.mensaje}`);
            console.log(`      💡 Recomendaciones preventivas:`);
            data7_5d.recomendaciones.forEach((rec, index) => {
                console.log(`         ${index + 1}. ${rec}`);
            });
            console.log();
        }

        // 9. Probar muerte y verificar enfermedad de muerte
        console.log('9. Probando muerte y enfermedad de muerte...');
        const response9 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/matar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ causa: "Prueba de muerte" })
        });
        const data9 = await response9.json();
        
        if (data9.muerte) {
            console.log(`✅ ${data9.mensaje}`);
            console.log(`💀 Causa: ${data9.causa}`);
            console.log(`📊 Estado después de muerte:`);
            console.log(`   - Viva: ${data9.mascota.viva ? 'Sí' : 'No'}`);
            console.log(`   - Muerto: ${data9.mascota.muerto ? 'Sí' : 'No'}`);
            console.log(`   - Estado: ${data9.mascota.estado}`);
            console.log(`   - Enfermedades: ${data9.mascota.enfermedades?.length || 0}`);
            console.log(`   - Condiciones médicas: ${data9.mascota.condicionesMedicas?.length || 0}`);
            console.log(`   - Enfermo: ${data9.mascota.enfermo ? 'Sí' : 'No'}`);
            if (data9.mascota.enfermedades && data9.mascota.enfermedades.length > 0) {
                console.log(`   - Lista de enfermedades: ${data9.mascota.enfermedades.join(', ')}`);
            }
            console.log();
        } else {
            console.log(`❌ Error: ${data9.error}\n`);
        }

        console.log('🎉 Pruebas completadas exitosamente!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
    }
}

// Ejecutar las pruebas
testEnfermedadesCompleto(); 