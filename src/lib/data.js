'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// validar que el nombre de usuario no exista
export async function checkUsernameExists(username) {
    try {
        const supabase = createServerActionClient({ cookies });

        if (!username) throw new Error('Username is required');
        
        const { data, error } = await supabase
            .from('users')
            .select('user_name')
            .eq('user_name', username)
        if (error) throw new Error('ERROR 500: Something went wrong');

        return { data: data?.length ? true : false, error: null };

    } catch (error) {
        console.error('[ ERROR checkUsernameExists ]', error.message);
        return { data: false, error: error.message };
    }
}

// obtener la/s columna/s de cualquier tabla;
export async function fetchProfileData({ filter, table, caseBox = [] }) {
    const supabase = createServerActionClient({ cookies });
    
    try {
        if (!filter) throw new Error('ID is required');

        let resultRequest;
        if (caseBox.length) {
            // Crear un array de promesas, cada una resolviendo a un objeto {column: data}
            resultRequest = await Promise.all(caseBox.map(async column => {
                const { data, error } = await supabase.from(table).select(column).match(filter);
                if (error) throw new Error('ERROR 500: Something went wrong in fetchProfileData');
                return { [column]: data[0][column] };
            }));
        } else {
            // Si no se especifican columnas, obtener todas las columnas para el ID dado
            const { data, error } = await supabase.from(table).select().match(filter);
            if (error) throw new Error('ERROR 500: Something went wrong in fetchProfileData');
            resultRequest = [{ allData: data[0] }];
        }

        // Combina todos los objetos en uno solo, resultando en un objeto de objetos
        const combinedData = resultRequest.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        return { data: combinedData, error: null };
        
    } catch (error) {
        console.error('[ ERROR fetchProfileData ]', error.message);
        return { data: null, error: error.message };
    }
}

// obtener todas las conversaciones
export async function fetchInbox() {

    const supabase = createServerActionClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    try {
        // Obtener todos los inbox_ids, si es grupal o individual y los mensajes no leídos
        const { data: inboxes, error: inboxError } = await supabase
            .from('inbox_members')
            .select('inbox_id, inbox:inbox_id (is_group, title_inbox, avatar_group)')
            .eq('user_id', user?.id);

        if (inboxError) throw new Error(`Error fetching inboxes: ${inboxError.message || 'Unknown error'}`);

        // Obtener el resumen de cada inbox
        const inboxResumen = await Promise.all(inboxes.map(async ({ inbox_id, inbox }) => {
            // Obtener el último mensaje de cada inbox
            const { data: messages, error: messagesError } = await supabase
                .from('messages')
                .select('content, created_at, user_id, isRead')
                .eq('inbox_id', inbox_id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (messagesError) throw new Error(`Error fetching inboxes: ${messagesError.message || 'Unknown error'}`);
            let lastMessage = messages[0];

            let contactsInfo = [];
            if (inbox.is_group) {
                // Para grupos, obtener todos los nombres y avatares de los contactos
                const { data: contacts, error: contactsError } = await supabase
                    .from('inbox_members')
                    .select('user_id, users:user_id (id, user_name, avatar_url)')
                    .eq('inbox_id', inbox_id);

                if (contactsError) throw new Error(`Error fetching inboxes: ${contactsError.message || 'Unknown error'}`);

                contactsInfo = contacts.map(({ user }) => ({
                    user_id: user.id,
                    user_name: user.user_name,
                    avatar_url: user.avatar_url,
                }));

            } else {
                // Para conversaciones individuales, obtener el nombre y avatar del otro contactos
                const { data: contacts, error: contactsError } = await supabase
                    .from('inbox_members')
                    .select('user_id, users:user_id (id, user_name, avatar_url)')
                    .eq('inbox_id', inbox_id)
                    .not('user_id', 'eq', user?.id)
                    .single();

                if (contactsError) throw new Error(`Error fetching inboxes: ${contactsError.message || 'Unknown error'}`);

                contactsInfo.push({
                    user_id: contacts.users.id,
                    user_name: contacts.users.user_name,
                    avatar_url: contacts.users.avatar_url,
                });
            }

            return {
                inbox_id,
                is_group: inbox.is_group,
                title_inbox: inbox.title_inbox,
                avatar_group: inbox.avatar_group,
                contacts: [...contactsInfo],
                lastMessage: lastMessage || null,
            };
        }));

        return { data:  inboxResumen };
        
    } catch (error) {
        console.error('[ ERROR fetchInbox ]', error || 'Something went wrong in fetchInbox');
        return { data: null };
    }
}

// obtener todos los mensajes
export async function fetchMessages(inbox_id) {

    const supabase = createServerActionClient({ cookies });
    
    try {
        if (!inbox_id) throw new Error('Inbox id not found');

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('inbox_id', inbox_id)
            .order('created_at', { ascending: true })
    
        if (error) throw new Error(`Error fetching messages: ${error.message || 'Something went wrong in fetchMessages'}`);

        return { data }
        
    } catch (error) {
        console.error('[ ERROR fetchMessages ]', error);
        return { data: null };
    }
}

// obtener la cantidad de inbox sin leer
export async function fetchInboxesUnread({ user_id }) {
    
    const supabase = createServerActionClient({ cookies });

    try {
        if (!user_id) throw new Error('User id not found.');

        const { data: members, error } = await supabase
            .from('inbox_members')
            .select('isSeen')
            .eq('user_id', user_id);

        if (error) throw new Error(error.message);

        const data = members.filter((member) => !member.isSeen).length;

        return { data };

    } catch (error) {
        console.error('[ ERROR fetchInboxesUnread ]', error);
        return { data: null };
    }
}

export async function fetchMessagesUnread(host_id, inboxes_list) {

    const supabase = createServerActionClient({ cookies });

    try {
        if (!inboxes_list.length || !host_id) throw new Error('Inboxes_id list not found.');

        const preparedMessagesUnread = inboxes_list.map(async (inbox_id) => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .match({ inbox_id, isRead: false })
                .not('user_id', 'eq', host_id);

            if (!error) {
                return {
                    inbox_id,
                    unread_total: data.length
                }
            }
        })

        const results = await Promise.allSettled(preparedMessagesUnread);
        const data = results.map((d) => d.status === 'fulfilled' && d.value);

        return { data: data || [] };

    } catch (error) {
        console.error('[ ERROR fetchUnreadMessages ]', error);
        return { data: null };
    }
}