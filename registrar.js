// registrar.js - Script corregido para crear usuarios y poblar la base de datos
const SUPABASE_URL = 'https://dndssckmyntcjmnniahb.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZHNzY2tteW50Y2ptbm5pYWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjg4MzUsImV4cCI6MjA3Nzk0NDgzNX0.XhuwHr9PvdnGKBjTz6zLAw1v_fsvmlIbQTSUvkNR64E';

// Función helper para hacer requests a Supabase REST API
async function supabaseFetch(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    };

    try {
        const response = await fetch(url, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Para DELETE requests que no retornan data
        if (response.status === 204 || options.method === 'DELETE') {
            return { success: true };
        }

        return await response.json();
    } catch (error) {
        console.error(`❌ Error en fetch a ${endpoint}:`, error.message);
        throw error;
    }
}

// Función para autenticación con Supabase - CORREGIDA
async function supabaseAuth(action, credentials) {
    const url = `${SUPABASE_URL}/auth/v1/${action}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || `Auth error: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`❌ Error en autenticación (${action}):`, error.message);
        throw error;
    }
}

// Función para crear usuario manualmente usando signup
async function crearUsuarioManual(email, password, fullName) {
    console.log(`📝 Creando usuario: ${email}`);
    
    try {
        // Usar el endpoint de signup normal
        const authData = await supabaseAuth('signup', {
            email: email,
            password: password,
            data: {
                full_name: fullName
            }
        });

        console.log(`✅ Usuario creado: ${email}`);
        return authData;
    } catch (error) {
        // Si el usuario ya existe, intentar hacer login para obtener la sesión
        if (error.message.includes('already registered') || error.message.includes('email_address_invalid')) {
            console.log(`🔄 Usuario ${email} ya existe, obteniendo sesión...`);
            try {
                const loginData = await supabaseAuth('token', {
                    grant_type: 'password',
                    email: email,
                    password: password
                });
                return loginData;
            } catch (loginError) {
                console.log(`⚠️  No se pudo obtener sesión para ${email}, continuando...`);
                return null;
            }
        }
        throw error;
    }
}

// Función para insertar perfil manualmente
async function insertarPerfilManual(userId, email, fullName, profileData = {}) {
    try {
        const perfilCompleto = {
            id: userId,
            email: email,
            full_name: fullName,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const data = await supabaseFetch('profiles', {
            method: 'POST',
            body: JSON.stringify([perfilCompleto])
        });

        console.log(`✅ Perfil creado para: ${email}`);
        return data[0];
    } catch (error) {
        // Si el perfil ya existe, intentar actualizarlo
        if (error.message.includes('duplicate key') || error.message.includes('23505')) {
            console.log(`🔄 Perfil ya existe para ${email}, actualizando...`);
            return await actualizarPerfil(userId, profileData);
        }
        throw error;
    }
}

// Función para actualizar perfil
async function actualizarPerfil(userId, profileData) {
    try {
        const data = await supabaseFetch(`profiles?id=eq.${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                ...profileData,
                updated_at: new Date().toISOString()
            })
        });

        console.log(`✅ Perfil actualizado para usuario: ${userId}`);
        return data;
    } catch (error) {
        console.error(`❌ Error actualizando perfil:`, error.message);
        throw error;
    }
}

// Función para crear cuenta bancaria
async function crearCuentaBancaria(userId, email) {
    try {
        const accountNumber = 'ES' + Date.now() + Math.random().toString().slice(2, 10);
        const saldoInicial = email === 'admin@bancosecure.es' ? 5000.00 : 
                           email === 'user@bancosecure.es' ? 2500.00 : 1000.00;

        const cuentaData = {
            user_id: userId,
            account_number: accountNumber,
            account_type: 'checking',
            account_name: 'Cuenta Principal',
            balance: saldoInicial,
            currency: 'EUR',
            is_active: true,
            opened_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const data = await supabaseFetch('bank_accounts', {
            method: 'POST',
            body: JSON.stringify([cuentaData])
        });

        console.log(`✅ Cuenta creada: ${accountNumber} - Saldo: ${saldoInicial}€`);
        return data[0];
    } catch (error) {
        console.error(`❌ Error creando cuenta para ${email}:`, error.message);
        throw error;
    }
}

// Función principal corregida
async function crearUsuariosYPerfiles() {
    console.log('🚀 Iniciando creación de usuarios y perfiles...\n');

    try {
        // Verificar que las tablas existen
        console.log('🔍 Verificando estructura de tablas...');
        try {
            await supabaseFetch('profiles?limit=1');
            console.log('✅ Tabla profiles existe');
        } catch (error) {
            console.log('❌ Tabla profiles no existe. Ejecuta el SQL primero en Supabase.');
            return;
        }

        try {
            await supabaseFetch('bank_accounts?limit=1');
            console.log('✅ Tabla bank_accounts existe');
        } catch (error) {
            console.log('❌ Tabla bank_accounts no existe. Ejecuta el SQL primero en Supabase.');
            return;
        }

        // Datos de usuarios demo
        const usuariosDemo = [
            {
                email: 'admin@bancosecure.es',
                password: 'Admin123!',
                full_name: 'Administrador del Sistema',
                profile_data: {
                    phone: '+34123456789',
                    document_type: 'DNI',
                    document_number: '12345678A',
                    is_verified: true,
                    account_status: 'active'
                }
            },
            {
                email: 'user@bancosecure.es', 
                password: 'User123!',
                full_name: 'Usuario Demo',
                profile_data: {
                    phone: '+34987654321',
                    document_type: 'DNI',
                    document_number: '87654321B',
                    is_verified: true,
                    account_status: 'active'
                }
            },
            {
                email: 'demo@bancosecure.es',
                password: 'Demo123!',
                full_name: 'Cliente Demo',
                profile_data: {
                    phone: '+34111222333',
                    document_type: 'DNI',
                    document_number: '11222333C',
                    is_verified: true,
                    account_status: 'active'
                }
            }
        ];

        console.log('\n📝 Creando usuarios y perfiles...');
        
        for (const usuario of usuariosDemo) {
            try {
                // 1. Crear usuario en auth
                const authData = await crearUsuarioManual(
                    usuario.email, 
                    usuario.password, 
                    usuario.full_name
                );

                if (authData && authData.user) {
                    // 2. Crear perfil manualmente
                    const perfil = await insertarPerfilManual(
                        authData.user.id,
                        usuario.email,
                        usuario.full_name,
                        usuario.profile_data
                    );

                    // 3. Crear cuenta bancaria
                    await crearCuentaBancaria(authData.user.id, usuario.email);
                    
                    console.log(`✅ Proceso completado para: ${usuario.email}\n`);
                } else {
                    console.log(`⚠️  No se pudo crear usuario ${usuario.email}, pero continuamos...\n`);
                }

            } catch (error) {
                console.error(`💥 Error con usuario ${usuario.email}:`, error.message);
                console.log('🔄 Continuando con el siguiente usuario...\n');
            }
        }

        // Verificación final
        await verificarDatosFinales();

        console.log('\n🎉 Proceso completado!');
        console.log('\n🔑 Credenciales para testing:');
        console.log('   👤 admin@bancosecure.es / Admin123!');
        console.log('   👤 user@bancosecure.es / User123!');
        console.log('   👤 demo@bancosecure.es / Demo123!');

    } catch (error) {
        console.error('💥 Error general:', error);
    }
}

// Función para verificar datos finales
async function verificarDatosFinales() {
    console.log('\n🔍 Verificando datos finales...');
    
    try {
        // Perfiles
        const perfiles = await supabaseFetch('profiles?select=*');
        console.log(`📊 Total de perfiles: ${perfiles.length}`);
        perfiles.forEach(perfil => {
            console.log(`   👤 ${perfil.email} - ${perfil.full_name}`);
        });

        // Cuentas bancarias
        const cuentas = await supabaseFetch('bank_accounts?select=*');
        console.log(`\n💰 Total de cuentas bancarias: ${cuentas.length}`);
        cuentas.forEach(cuenta => {
            const propietario = perfiles.find(p => p.id === cuenta.user_id);
            console.log(`   💳 ${cuenta.account_number} - ${propietario?.email} - ${cuenta.balance}€`);
        });

    } catch (error) {
        console.error('❌ Error en verificación final:', error.message);
    }
}

// Ejecutar el script
crearUsuariosYPerfiles().catch(console.error);