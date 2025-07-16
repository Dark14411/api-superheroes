import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testEstadosMascota() {
    console.log('🧪 Probando estados de mascota (hambre, sed, etc.)...\n');

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
        
        // 2. Mostrar estados actuales
        console.log('\n2. Estados actuales de la mascota:');
        console.log(`📊 Estadísticas numéricas:`);
        console.log(`   - Energía: ${mascota.energia}`);
        console.log(`   - Felicidad: ${mascota.felicidad}`);
        console.log(`   - Hambre: ${mascota.hambre}`);
        console.log(`   - Sed: ${mascota.sed}`);
        console.log(`   - Cansancio: ${mascota.cansancio}`);
        console.log(`   - Estrés: ${mascota.estres}`);
        
        console.log(`\n🔍 Estados booleanos:`);
        console.log(`   - ¿Tiene hambre?: ${mascota.tieneHambre ? 'Sí' : 'No'}`);
        console.log(`   - ¿Tiene sed?: ${mascota.tieneSed ? 'Sí' : 'No'}`);
        console.log(`   - ¿Está cansado?: ${mascota.estaCansado ? 'Sí' : 'No'}`);
        console.log(`   - ¿Está estresado?: ${mascota.estaEstresado ? 'Sí' : 'No'}`);
        console.log(`   - ¿Tiene energía?: ${mascota.tieneEnergia ? 'Sí' : 'No'}`);
        console.log(`   - ¿Está feliz?: ${mascota.estaFeliz ? 'Sí' : 'No'}`);
        
        console.log(`\n📝 Estados descriptivos:`);
        console.log(`   - Estado de hambre: ${mascota.estadoHambre}`);
        console.log(`   - Estado de sed: ${mascota.estadoSed}`);
        console.log(`   - Estado de cansancio: ${mascota.estadoCansancio}`);
        console.log(`   - Estado de estrés: ${mascota.estadoEstrés}`);
        console.log(`   - Estado de energía: ${mascota.estadoEnergia}`);
        console.log(`   - Estado de felicidad: ${mascota.estadoFelicidad}`);

        // 3. Probar variaciones múltiples
        console.log('\n3. Probando variaciones múltiples...');
        for (let i = 1; i <= 5; i++) {
            console.log(`\n   Consulta ${i}:`);
            const response = await fetch(`${BASE_URL}/mascotas/${mascota.id}`);
            const data = await response.json();
            
            if (data.mascota) {
                const m = data.mascota;
                console.log(`   📊 Hambre: ${m.hambre} - ¿Tiene hambre?: ${m.tieneHambre ? 'Sí' : 'No'} - Estado: ${m.estadoHambre}`);
                console.log(`   📊 Sed: ${m.sed} - ¿Tiene sed?: ${m.tieneSed ? 'Sí' : 'No'} - Estado: ${m.estadoSed}`);
                console.log(`   📊 Energía: ${m.energia} - ¿Tiene energía?: ${m.tieneEnergia ? 'Sí' : 'No'} - Estado: ${m.estadoEnergia}`);
            }
        }

        // 4. Probar alimentación y ver cambios
        console.log('\n4. Probando alimentación y cambios de estado...');
        const response2 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/alimentar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cantidad: 30 })
        });
        const data2 = await response2.json();
        
        if (data2.exito) {
            console.log(`✅ ${data2.mensaje}`);
            
            // Verificar estado después de alimentar
            const response3 = await fetch(`${BASE_URL}/mascotas/${mascota.id}`);
            const data3 = await response3.json();
            
            if (data3.mascota) {
                const m = data3.mascota;
                console.log(`\n📊 Estado después de alimentar:`);
                console.log(`   - Hambre: ${m.hambre}`);
                console.log(`   - ¿Tiene hambre?: ${m.tieneHambre ? 'Sí' : 'No'}`);
                console.log(`   - Estado de hambre: ${m.estadoHambre}`);
            }
        }

        // 5. Probar dar agua y ver cambios
        console.log('\n5. Probando hidratación y cambios de estado...');
        const response4 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/dar-agua`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cantidad: 40 })
        });
        const data4 = await response4.json();
        
        if (data4.exito) {
            console.log(`✅ ${data4.mensaje}`);
            
            // Verificar estado después de dar agua
            const response5 = await fetch(`${BASE_URL}/mascotas/${mascota.id}`);
            const data5 = await response5.json();
            
            if (data5.mascota) {
                const m = data5.mascota;
                console.log(`\n📊 Estado después de dar agua:`);
                console.log(`   - Sed: ${m.sed}`);
                console.log(`   - ¿Tiene sed?: ${m.tieneSed ? 'Sí' : 'No'}`);
                console.log(`   - Estado de sed: ${m.estadoSed}`);
            }
        }

        // 6. Probar ejercicio y ver cambios
        console.log('\n6. Probando ejercicio y cambios de estado...');
        const response6 = await fetch(`${BASE_URL}/mascotas/${mascota.id}/ejercitar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intensidad: 30 })
        });
        const data6 = await response6.json();
        
        if (data6.exito) {
            console.log(`✅ ${data6.mensaje}`);
            
            // Verificar estado después de ejercitar
            const response7 = await fetch(`${BASE_URL}/mascotas/${mascota.id}`);
            const data7 = await response7.json();
            
            if (data7.mascota) {
                const m = data7.mascota;
                console.log(`\n📊 Estado después de ejercitar:`);
                console.log(`   - Energía: ${m.energia} - Estado: ${m.estadoEnergia}`);
                console.log(`   - Cansancio: ${m.cansancio} - ¿Está cansado?: ${m.estaCansado ? 'Sí' : 'No'} - Estado: ${m.estadoCansancio}`);
                console.log(`   - Estrés: ${m.estres} - ¿Está estresado?: ${m.estaEstresado ? 'Sí' : 'No'} - Estado: ${m.estadoEstrés}`);
                console.log(`   - Felicidad: ${m.felicidad} - ¿Está feliz?: ${m.estaFeliz ? 'Sí' : 'No'} - Estado: ${m.estadoFelicidad}`);
            }
        }

        // 7. Mostrar resumen final
        console.log('\n7. Resumen final de estados:');
        const response8 = await fetch(`${BASE_URL}/mascotas/${mascota.id}`);
        const data8 = await response8.json();
        
        if (data8.mascota) {
            const m = data8.mascota;
            console.log(`\n🎯 Estado general de ${m.nombre}:`);
            console.log(`   🍽️  Hambre: ${m.estadoHambre} (${m.hambre}/100)`);
            console.log(`   💧 Sed: ${m.estadoSed} (${m.sed}/100)`);
            console.log(`   ⚡ Energía: ${m.estadoEnergia} (${m.energia}/100)`);
            console.log(`   😴 Cansancio: ${m.estadoCansancio} (${m.cansancio}/100)`);
            console.log(`   😰 Estrés: ${m.estadoEstrés} (${m.estres}/100)`);
            console.log(`   😊 Felicidad: ${m.estadoFelicidad} (${m.felicidad}/100)`);
            
            console.log(`\n📋 Necesidades urgentes:`);
            if (m.tieneHambre) console.log(`   ❗ Necesita comida`);
            if (m.tieneSed) console.log(`   ❗ Necesita agua`);
            if (m.estaCansado) console.log(`   ❗ Necesita descanso`);
            if (m.estaEstresado) console.log(`   ❗ Necesita relajación`);
            if (!m.tieneEnergia) console.log(`   ❗ Necesita energía`);
            if (!m.estaFeliz) console.log(`   ❗ Necesita atención`);
            
            if (!m.tieneHambre && !m.tieneSed && !m.estaCansado && !m.estaEstresado && m.tieneEnergia && m.estaFeliz) {
                console.log(`   ✅ La mascota está perfecta`);
            }
        }

        console.log('\n🎉 Pruebas de estados completadas exitosamente!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
    }
}

// Ejecutar las pruebas
testEstadosMascota(); 