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

export async function create_message(inbox_id, content_text, contacts_id) { // contacts [user_id1, user_id2, ...]

    const supabase = createServerActionClient({ cookies });

    try {
        if (!inbox_id || !content_text?.message || !content_text?.user_id) throw new Error('Missing parameters.');

        // crtear un nuevo message
        const { error: errorCreateMessage } = await supabase
            .from('messages')
            .insert({
                content: content_text.message,
                user_id: content_text.user_id,
                inbox_id,
            })

        if (errorCreateMessage) throw new Error(errorCreateMessage);

        const preparedContacts = contacts_id.map(async (id) => {
            await supabase
                .from('inbox_members')
                .update({ is_seen: false })
                .match({ inbox_id, user_id: id, is_seen: true })
        });

        const results = await Promise.allSettled(preparedContacts);
        const rejected = results.some((r) => r.status === 'rejected')

        return { rejected, error: null }

    } catch (error) {
        console.error('[ ERROR create_Message ]', error.message);
        return { rejected: null, error: error.message };
    }
}

export async function create_inbox({user_id1, user_id2, user_id3, user_id4, content_text, avatar_group: { file, type }, is_group = false, title_inbox = null}) {

    const supabase = createServerActionClient({ cookies });

    try {
        let inbox_id;

        // Verificar si alguno de los usuarios ha bloqueado al otro
        const { data: user_blocked, error: errorBlocked } = await supabase
            .from('users_blocked')
            .select('*')
            .or(`user_emit.eq.${user_id1},user_target.eq.${user_id2}`)
            .or(`user_emit.eq.${user_id2},user_target.eq.${user_id1}`);

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

            // Crear el grupo en la base de datos
            const { data: inboxCreate, error: errorCreateInbox } = await supabase
                .rpc('create_inbox', { user_id1, user_id2, user_id3, user_id4, is_group: true, title_inbox });
            
            if (errorCreateInbox) throw new Error(errorCreateInbox);

            let signedUrl = null;
            if (file) {
                // Decodificar el archivo base64
                const base64Data = file.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                const fileName = `${inboxCreate}`;

                // Subir el archivo decodificado al almacenamiento de Supabase
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('avatar_group')
                    .upload(fileName, buffer, {
                        cacheControl: '3600',
                        upsert: true,
                        contentType: `${type}`,
                    });

                if (uploadError) throw new Error(uploadError.message);
                console.log(uploadData)

                // Obtener la URL-token de la imagen de perfil
                const { data: signedUrlData, error: signedUrlError } = await supabase
                    .storage
                    .from('avatar_group')
                    .createSignedUrl(fileName, 1000000);

                if (signedUrlError) throw new Error(signedUrlError);

                signedUrl = signedUrlData.signedUrl;
            }

            // Subir/guardar el avatar en el inbox correspondiente
            const { error: errorUpdateInbox } = await supabase
                .from('inbox')
                .update({ avatar_group: signedUrl || null })
                .eq('id', inboxCreate);

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
            const { error: errorCreate_Message } = await create_message(inbox_id, { user_id: content_text.user_id, message: content_text.message }, [user_id2] );
            if (errorCreate_Message) throw new Error(errorCreate_Message);
        }

        return { error: null };

    } catch (error) {
        console.error('[ ERROR create_inbox ]', error);
        return { error };
    }
}

export async function update_column({ filter, table, column, value }) {
    const supabase = createServerActionClient({ cookies });
    
    try {
        if (!filter || !table || !column || !value) throw new Error('Missing data');

        const { error } = await supabase
            .from(table)
            .update({ [column]: value })
            .match(filter);

        if (error) throw new Error(error.message);
        return { error: null };

    } catch (error) {
        console.error('[ ERROR update_column ]', error.message);
        return { error: error.message };
    }
}

export async function updateMessagesToRead(sender_id, inboxId, host_id, is_group) {
    
    const supabase = createServerActionClient({ cookies });

    try {
        if (!sender_id || !inboxId || !host_id) throw new Error('Missing data.');

        const { error } = await supabase
            .from('inbox_members')
            .update({ is_seen: true })
            .match({ inbox_id: inboxId, user_id: host_id, is_seen: false });

        if (error) throw new Error(error.message);

        if (!is_group) {
            // EN LOS INDIVIDUALES, actualizamos el los mensajes del recividor con isRead a TRUE
            const { error } = await supabase
                .from('messages')
                .update({ isRead: true })
                .match({ inbox_id: inboxId, user_id: sender_id, isRead: false });

            if (error) throw new Error(error.message);

            return { data: true };

        } else {
            // EN LOS GRUPOS, chequeamos a cada usuario con el inbox_id si tiene isSeen en TRUE
            
            // Obtiene todos los miembros del Inbox (grupo)
            const { data: members, error } = await supabase
                .from('inbox_members')
                .select('user_id, is_seen')
                .eq('inbox_id', inboxId);

            if (error) throw new Error('Error fetching inbox members:', error.message);

            // Verifica si todos los miembros han visto el Inbox antes de marcar los mensajes como leídos
            const allSeen = members.every(member => member.is_seen || member.user_id === host_id);
        
            if (allSeen) {
                // Si todos los miembros han visto el Inbox, marca todos los mensajes como leídos
                await supabase
                    .from('messages')
                    .update({ isRead: true })
                    .match({ inbox_id: inboxId, isRead: false });
            }

            return { data: allSeen };
        }
    } catch (error) {
        console.error('[ ERROR updateMessagesRead ]', error);
        return { data: null };
    }
}

export async function handleMessageReceived(message, is_group, host_id, isInboxOpen) {

    const supabase = createServerActionClient({ cookies });

    const inboxId = message.inbox_id;
    const sender_id = message.user_id;
  
    if (!isInboxOpen) {
        try {
            // ACTUALIZA EL INBOX del host_id con isSeen a FALSE porque el Inbox no está abierto
            const { error } = await supabase
                .from('inbox_members')
                .update({ is_seen: false })
                .match({ inbox_id: inboxId, user_id: host_id, is_seen: true });
            
            if (error) throw new Error(error.message);
            return { data: null };

        } catch (error) {
            console.error('[ ERROR handleMessageReceived ]', error);
            return { data: null };
        }
    } else {
        // ACTUALIZA EL INBOX del host_id con isSeen a TRUE porque el Inbox está abierto
        const { data } = await updateMessagesToRead(sender_id, inboxId, host_id, is_group);

        console.log(data)
        return { data }
    }
}