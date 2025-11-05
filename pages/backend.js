// backend.js - Funciones adicionales para operaciones con Supabase
const SUPABASE_URL = 'https://dndssckmyntcjmnniahb.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuZHNzY2tteW50Y2ptbm5pYWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjg4MzUsImV4cCI6MjA3Nzk0NDgzNX0.XhuwHr9PvdnGKBjTz6zLAw1v_fsvmlIbQTSUvkNR64E';

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

// Función para registrar log de autenticación
async function logAuthAction(actionType, ipAddress = null, userAgent = null) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

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
    }
}

// Verificar si el usuario está autenticado
async function checkAuth() {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
        return null;
    }
    
    return data.session.user;
}

// Cerrar sesión
async function logout() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Error cerrando sesión:', error);
        throw error;
    }
    
    window.location.href = 'index.html';
}

// Exportar funciones para uso global
window.bancosecureAPI = {
    getUserProfile,
    updateUserProfile,
    getUserBankAccounts,
    logAuthAction,
    checkAuth,
    logout,
    supabase
};