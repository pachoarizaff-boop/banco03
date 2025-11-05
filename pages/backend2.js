// backend.js - Funciones adicionales para operaciones con Supabase
const SUPABASE_URL = 'https://gsyssmhmvdtqtfpquxkk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeXNzbWhtdmR0cXRmcHF1eGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODE4NTYsImV4cCI6MjA3Nzg1Nzg1Nn0.guX2tHG1XNWTnfRoEGdJOQfybr36Ar-L4Hl4RQsUdAU';

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para obtener el perfil del usuario
async function getUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error obteniendo perfil:', error);
        return null;
    }

    return data;
}

// Función para actualizar el perfil del usuario
async function updateUserProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Usuario no autenticado');

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Función para obtener las cuentas bancarias del usuario
async function getUserBankAccounts() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error obteniendo cuentas:', error);
        return [];
    }

    return data;
}

// Función para obtener la IP del usuario
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error obteniendo IP:', error);
        return null;
    }
}

// Función para registrar log de autenticación
async function logAuthAction(actionType) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const ipAddress = await getUserIP();
        const userAgent = navigator.userAgent;

        const { error } = await supabase
            .from('auth_logs')
            .insert({
                user_id: user.id,
                action_type: actionType,
                ip_address: ipAddress,
                user_agent: userAgent
            });

        if (error) {
            console.error('Error registrando log:', error);
        } else {
            console.log(`✅ Log de ${actionType} registrado correctamente`);
        }
    } catch (error) {
        console.error('Error en logAuthAction:', error);
    }
}

// Verificar si el usuario está autenticado
async function checkAuth() {
    try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
            return null;
        }
        
        return data.session.user;
    } catch (error) {
        console.error('Error en checkAuth:', error);
        return null;
    }
}

// Cerrar sesión
async function logout() {
    try {
        // Registrar log de logout
        await logAuthAction('logout');
        
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Error cerrando sesión:', error);
            throw error;
        }
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error en logout:', error);
        throw error;
    }
}

// Función para crear cuenta bancaria demo (para usuarios nuevos)
async function createDemoBankAccount(userId) {
    try {
        const accountNumber = 'ES' + Math.random().toString().slice(2, 20);
        
        const { data, error } = await supabase
            .from('bank_accounts')
            .insert({
                user_id: userId,
                account_number: accountNumber,
                account_type: 'checking',
                balance: 1000.00,
                currency: 'EUR',
                is_active: true
            })
            .select()
            .single();

        if (error) throw error;
        
        console.log('✅ Cuenta bancaria demo creada:', data);
        return data;
    } catch (error) {
        console.error('Error creando cuenta demo:', error);
        return null;
    }
}

// Función para verificar si el usuario tiene cuentas bancarias
async function checkUserBankAccounts() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return false;

        const { data, error } = await supabase
            .from('bank_accounts')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

        if (error) throw error;
        
        return data.length > 0;
    } catch (error) {
        console.error('Error verificando cuentas:', error);
        return false;
    }
}

// Función para obtener estadísticas del usuario
async function getUserStats() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return null;

        const { data, error } = await supabase
            .from('bank_accounts')
            .select('balance, currency')
            .eq('user_id', user.id)
            .eq('is_active', true);

        if (error) throw error;

        const totalBalance = data.reduce((sum, account) => sum + parseFloat(account.balance), 0);
        const accountCount = data.length;

        return {
            totalBalance,
            accountCount,
            currency: data[0]?.currency || 'EUR'
        };
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return null;
    }
}

// Función para cambiar contraseña
async function updatePassword(newPassword) {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;
        
        console.log('✅ Contraseña actualizada correctamente');
        return data;
    } catch (error) {
        console.error('Error actualizando contraseña:', error);
        throw error;
    }
}

// Función para recuperar contraseña
async function resetPassword(email) {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`,
        });

        if (error) throw error;
        
        console.log('✅ Email de recuperación enviado');
        return data;
    } catch (error) {
        console.error('Error enviando email de recuperación:', error);
        throw error;
    }
}

// Función para verificar sesión activa
async function getActiveSession() {
    try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Error obteniendo sesión:', error);
            return null;
        }
        
        return data.session;
    } catch (error) {
        console.error('Error en getActiveSession:', error);
        return null;
    }
}

// Función para obtener logs de autenticación del usuario
async function getUserAuthLogs() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return [];

        const { data, error } = await supabase
            .from('auth_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;
        
        return data;
    } catch (error) {
        console.error('Error obteniendo logs:', error);
        return [];
    }
}

// Exportar funciones para uso global
window.bancosecureAPI = {
    getUserProfile,
    updateUserProfile,
    getUserBankAccounts,
    logAuthAction,
    checkAuth,
    logout,
    createDemoBankAccount,
    checkUserBankAccounts,
    getUserStats,
    updatePassword,
    resetPassword,
    getActiveSession,
    getUserAuthLogs,
    supabase
};

// Inicialización automática cuando se carga el script
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ BancoSecure API cargado correctamente');
    
    // Verificar si hay una sesión activa
    checkAuth().then(user => {
        if (user) {
            console.log('👤 Usuario autenticado:', user.email);
            
            // Registrar log de sesión activa
            logAuthAction('session_active');
            
            // Si estamos en la página de login, redirigir al dashboard
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname === '/') {
                console.log('🔄 Redirigiendo a dashboard...');
                setTimeout(() => {
                    window.location.href = 'account_management.html';
                }, 1000);
            }
        } else {
            console.log('🔒 No hay usuario autenticado');
        }
    });
});