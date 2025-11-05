// registrar.js - Usando fetch nativo
const SUPABASE_URL = 'https://dndssckmyntcjmnniahb.supabase.co/rest/v1/profiles';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZHNzY2tteW50Y2ptbm5pYWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjg4MzUsImV4cCI6MjA3Nzk0NDgzNX0.XhuwHr9PvdnGKBjTz6zLAw1v_fsvmlIbQTSUvkNR64E';

console.log('🔍 Obteniendo todos los datos de la tabla profiles...');

// Hacer petición GET para leer datos
fetch(SUPABASE_URL, {
    headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    console.log('📊 Todos los datos de la tabla profiles:', data);
    console.log(`✅ Se encontraron ${data.length} registros`);
})
.catch(error => {
    console.error('❌ Error obteniendo datos:', error);
});

// Función para INSERTAR un nuevo registro
function insertarUsuario(userData) {
    console.log('\n📝 Insertando nuevo usuario...');
    
    fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation' // Para que retorne el dato insertado
        },
        body: JSON.stringify([userData])
    })
    .then(response => response.json())
    .then(data => {
        console.log('✅ Usuario insertado correctamente:', data);
    })
    .catch(error => {
        console.error('❌ Error insertando usuario:', error);
    });
}

// Datos de prueba inventados
const nuevoUsuario = {
    id: 'user_' + Date.now(), // ID único basado en timestamp
    email: "juan.perez@ejemplo.com",
    full_name: "Juan Pérez García",
    phone: "+34 611 223 344",
    created_at: new Date().toISOString()
};

// Ejecutar después de 2 segundos para ver primero la lectura
setTimeout(() => {
    insertarUsuario(nuevoUsuario);
}, 2000);

// Más datos de prueba
const otrosUsuarios = [
    {
        id: 'user_' + (Date.now() + 1),
        email: "laura.gomez@ejemplo.com",
        full_name: "Laura Gómez Martínez", 
        phone: "+34 622 334 455",
        created_at: new Date().toISOString()
    },
    {
        id: 'user_' + (Date.now() + 2),
        email: "miguel.torres@ejemplo.com",
        full_name: "Miguel Torres López",
        phone: "+34 633 445 566", 
        created_at: new Date().toISOString()
    }
];

// Insertar más usuarios después de 4 segundos
setTimeout(() => {
    console.log('\n📝 Insertando múltiples usuarios...');
    otrosUsuarios.forEach(usuario => {
        insertarUsuario(usuario);
    });
}, 4000);