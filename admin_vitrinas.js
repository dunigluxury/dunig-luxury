// admin_vitrinas.js

// Función principal de carga (Se conecta al API de Supabase)
async function registrarNuevoNegocio(nombre, url, file) {
    try {
        // 1. Subir imagen
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('vitrinas')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. Obtener URL pública
        const { data: { publicUrl } } = supabaseClient.storage
            .from('vitrinas')
            .getPublicUrl(fileName);

        // 3. Insertar en tabla
        const { error: dbError } = await supabaseClient
            .from('links_vitrinas')
            .insert([{ nombre, url, imagen_url: publicUrl }]);

        if (dbError) throw dbError;

        return { success: true };
    } catch (error) {
        console.error("Error en API Vitrinas:", error);
        return { success: false, error };
    }
}
