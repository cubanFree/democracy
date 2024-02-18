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

export async function create_message({inbox_id, content_text}) {

    const supabase = createServerActionClient({ cookies });

    try {
        if (!inbox_id) throw new Error('Inbox id not found');
        const { error: errorCreateMessage } = await supabase
            .from('messages')
            .insert({
                content: content_text.message,
                user_id: content_text.user_id,
                inbox_id,
            })
        
        console.log('createMessage ->>> ', errorCreateMessage)
        if (errorCreateMessage) throw new Error(errorCreateMessage);

        return { error: null };

    } catch (error) {
        console.error('[ ERROR create_Message ]', error.message);
        return { error };
    }
}

export async function create_inbox({user_id1, user_id2, content_text, avatar_group = null, is_group = false}) {

    const supabase = createServerActionClient({ cookies });

    try {
        let inbox_id;

        // Verificar si alguno de los usuarios ha bloqueado al otro
        const { data: user_blocked, error: errorBlocked } = await supabase
            .from('users_blocked')
            .select('*')
            .or(`user_emit.eq.${user_id1},user_target.eq.${user_id2}`)
            .or(`user_emit.eq.${user_id2},user_target.eq.${user_id1}`);

        console.log('user_blocked ->>> ', user_blocked, errorBlocked)

        if (errorBlocked) throw new Error(errorBlocked);
        if (user_blocked.length > 0) throw new Error('Message could not be sent.')

        // Chequear si hay una conversacion existente entre los dos usuarios
        const { data: inboxExists, error: errorInboxExists } = await supabase
            .rpc('check_existing_conversation', { user_id1, user_id2});

        console.log('inboxExists ->>> ', inboxExists, errorInboxExists)

        if (errorInboxExists) throw new Error(errorInboxExists);
        if (inboxExists.length > 0 && inboxExists[0]?.result[0]?.is_group === false) inbox_id = inboxExists[0]?.result[0]?.inbox_id

        // Crear una nueva conversacion en caso de que inboxExists no devuelve un id, que is_group sea false, y despues agregar el mensaje a la conversacion
        if (is_group === true) {
            const { data: inboxCreate, error: errorCreateInbox } = await supabase
                .rpc('create_inbox', { user_id1, user_id2, is_group: true });
            
            console.log('inboxCreateGroup ->>> ', inboxCreate, errorCreateInbox)
            if (errorCreateInbox) throw new Error(errorCreateInbox);

            // Validate avatar
            const { error: avatarError } = (avatar_group?.size > 0) && await supabase.storage.from('avatar_profile').upload(inboxCreate, avatar_group, {
                cacheControl: '3600',
                upsert: true,
                contentType: avatar_group.type
            });
            if (avatarError) throw new Error(avatarError);

            // Obtener la URL-token de la imagen de perfil
            const signedUrl = (avatar_group?.size > 0) ? await supabase.storage.from('avatar_profile').createSignedUrl(inboxCreate, 1000000).then(res => res.data?.signedUrl) : null;

            // subir/guardar el avatar en el inbox correspondiente
            const { error: errorUpdateInbox } = await supabase.from('inbox').update({ avatar_group: signedUrl || null }).eq('id', inboxCreate);
            if (errorUpdateInbox) throw new Error(errorUpdateInbox);

        } else {
            if (inboxExists.length === 0 || (inboxExists.length > 0 && inboxExists[0]?.is_group === true)) {
                const { data: inboxCreate, error: errorCreateInbox } = await supabase
                    .rpc('create_inbox', { user_id1, user_id2 });
                
                console.log('inboxCreateSingle ->>> ', inboxCreate, errorCreateInbox)
                if (errorCreateInbox) throw new Error(errorCreateInbox);

                inbox_id = inboxCreate
            }

            // Agregar el mensaje a la conversacion existente
            const { error: errorCreate_Message } = await create_message({ inbox_id, content_text });
            if (errorCreate_Message) throw new Error(errorCreate_Message);
        }

        return { error: null };

    } catch (error) {
        console.error('[ ERROR create_inbox ]', error.message);
        return { error: error.message };
    }
}