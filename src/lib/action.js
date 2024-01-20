'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function loginWithPassword(formData) {
    try {
        const supabase = createServerActionClient({ cookies });

        // Validate form data
        const { email, password } = Object.fromEntries(formData);
        if (!email || !password) throw new Error('Email and password are required');

        // Login
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw new Error(error);

        const { error: errorStatus } = await changeStatus('online');
        if (errorStatus) throw new Error(errorStatus);

        return { error: null };

    } catch (error) {
        console.error('[ ERROR login ]', error.message);
        return { error: error.message };
    }
}

export async function signupWithPassword(path, formData) {
    const supabase = createServerActionClient({ cookies });
    const { email, password, avatar, username } = Object.fromEntries(formData);

    try {
        // Validate form data
        if (!email || !password) throw new Error('Email and password are required');
        if (path === '') throw new Error('Path is required');

        // Validate avatar
        const { error: avatarError } = (avatar?.size > 0) && await supabase.storage.from('avatar_profile').upload(email, avatar, {
            cacheControl: '3600',
            upsert: true,
            contentType: avatar.type
        });
        if (avatarError) throw new Error(avatarError);

        // Obtener la URL-token de la imagen de perfil
        const signedUrl = (avatar?.size > 0) ? await supabase.storage.from('avatar_profile').createSignedUrl(email, 1000000).then(res => res.data?.signedUrl) : null;
        
        // Sign up
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${path}/auth/callback`,
                data: {
                    avatar_url: signedUrl,
                    user_name: username
                }
            }
        })
        if (error) throw new Error(error);

        return { error: null };

    } catch (error) {
        // eliminar el avatar del storage si ocurre algun error en la registracion
        const { error: removeError } = await supabase.storage.from('avatar_profile').remove([email]);
        if (removeError) console.error('[ ERROR removeAvatar_url ]', removeError.message);

        console.error('[ ERROR signup ]', error.message);
        return { error: error.message };
    }
}

export async function removeUserProfile() {
    try {
        const supabase = createServerActionClient({ cookies });
        
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.auth.api.deleteUser(user.id);
        if (error) throw new Error(error.message);

        return { error: null };
    } catch (error) {
        console.error('[ ERROR removeUserProfile ]', error);
        return { error: error.message };
    }
}

export async function changeStatus(status) {
    const supabase = createServerActionClient({ cookies });
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        // checkear si esta en null
        const { data } = await supabase.from('users').select('status').eq('id', user.id);

        // cambiar status de usuario en la base de datos en caso de que el usuario haga privado su estatus
        if (data[0].status !== null) {
            const { error } = await supabase.from('users').update({ status }).eq('id', user.id);
            if (error) throw new Error(error);
        }

        return { error: null };
    } catch (error) {
        console.error('[ ERROR changeStatus ]', error.message);
        return { error };
    }
}