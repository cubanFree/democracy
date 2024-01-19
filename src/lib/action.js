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
        if (error) throw new Error(error.message);

        const { error: errorStatus } = await changeStatus('online');
        if (errorStatus) throw new Error(errorStatus.message);

        return { error: null };

    } catch (error) {
        console.error('[ ERROR login ]', error);
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
        if (avatarError) throw new Error(avatarError.message);

        // Obtener la URL-token de la imagen de perfil
        const signedUrl = (avatar?.size > 0) ? await supabase.storage.from('avatar_profile').createSignedUrl(email, 1000000).then(res => res.data?.signedUrl) : process.env.URL_AVATAR_DEFAULT;
        
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
        if (error) throw new Error(error.message);

        return { error: null };

    } catch (error) {
        await supabase.storage.from('avatar_profile').remove([email]);
        console.error('[ ERROR signup ]', error);
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

export async function changeStatus(status = 'offline') {
    const supabase = createServerActionClient({ cookies });
    try {
        // cambiar status de usuario en la base de datos
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = user && await supabase.from('users').update({ status }).eq('id', user.id);
        if (error) throw new Error(error.message);

        return { error: null };
    } catch (error) {
        console.error('[ ERROR changeStatus ]', error);
        return { error };
    }
}