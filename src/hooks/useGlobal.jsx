'use client';

import { fetchInbox, fetchMessages, fetchMessagesUnread, fetchProfileData } from '@/lib/data';
import { create } from 'zustand';

export const useMessages = create((set, get) => ({
    isLoadingInboxes: true,
    isLoadingMessages: true,
    notificationsInboxes: 0,
    notificacionesMessages: [],
    inboxOpen: null,
    dataInboxes: [],
    dataSearch: [],
    dataMessages: [],

    // Funcion para actualizar la lista de Inboxes
    setDataInboxes: async () => {
        const { data } = await fetchInbox();
        set({ dataInboxes: data?.sort((a, b) => new Date(b.lastMessage?.created_at).getTime() - new Date(a.lastMessage?.created_at).getTime()) });
        set((state) => ({ ...state, isLoadingInboxes: false }));
    },

    // Funcion para la barra de busqueda de Inboxes
    setDataSearch: (value) => {
        const { dataInboxes } = get();
        const lowerCaseValue = value.toLowerCase();

        // Filtrar por user_name
        let search = dataInboxes?.filter(item => 
            item.contacts[0].user_name.toLowerCase().includes(lowerCaseValue)
        );

        // Si no hay resultados, filtrar por title_inbox
        if (search.length === 0) {
            search = dataInboxes?.filter(item => 
                item.title_inbox?.toLowerCase().includes(lowerCaseValue)
            );
        }

        set({ dataSearch: search || [] });
    },

    // Funcion para actualizar la lista de Mensajes
    setDataMessages: async ({ value = {}, inbox_id = null }) => {
        const { dataMessages } = get();

        // Obtener todos los mensajes si hay un inbox_id
        if (inbox_id && !Object.keys(value).length) {
            const { data: content_messages } = await fetchMessages(inbox_id);
            set({ dataMessages: content_messages });
            set((state) => ({ ...state, isLoadingMessages: false }));

        // En caso de que se reciban nuevos mensajes actualizar el estado
        } else if (Object.keys(value).length && !inbox_id) {
            // En caso de que se reciba un nuevo mensaje
            if (value.action === 'POST') {
                // Verifica si el mensaje ya existe para evitar duplicados
                const messageExists = dataMessages.some((m) => m.id === value.item.id);
                if (!messageExists) {
                    // Extraer los datos del propietario del nuevo mensaje correspondiente
                    try {
                        const { user_id } = value.item;
                        const { data, error } = await fetchProfileData({ filter: {id: user_id}, table: 'users', caseBox: ['avatar_url', 'user_name'] });
                        if (error) throw new Error(error.message);
                        set({ dataMessages: [...dataMessages, {...value.item, user_name: data[0].user_name, avatar_url: data[0].avatar_url}] });

                    } catch (error) {
                        console.log(error);
                        set({ dataMessages: [...dataMessages, {...value.item, user_name: null, avatar_url: null}] });
                    }
                }

            // En caso de que ocurra una actualizacion de un mensaje
            } else if (value.action === 'UPDATE') {
                const messageIndex = dataMessages.findIndex((m) => m.id === value.item.id);
                if (messageIndex !== -1) {
                    const updatedMessages = [...dataMessages];
                    updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], ...value.item };
                    set({ dataMessages: updatedMessages });
                }
            }
            
        }
        
    },

    // Funcione para actualizar el ultimo mensaje de un Inbox
    setNewMessagesInboxes: ({ inbox_id, lastMessage }) => {
        const { dataInboxes } = get();
        if (!dataInboxes.length) return;

        const updateDataInboxes = dataInboxes.map(inbox => {
            if (inbox.inbox_id === inbox_id) {
                return { ...inbox, lastMessage };
            }
            return inbox;
        })

        set({dataInboxes: updateDataInboxes});
    },

    // Funcione para actualizar el estado del Inbox seleccionado (abierto o cerrado)
    setInboxOpen: (value) => set({ inboxOpen: value }),

    // Funcione para actualizar el estado de las notificaciones de los Inboxes (cantidad de Inboxes sin leer)
    setNotificationsInboxes: (value) => set({ notificationsInboxes: value }),

    // Funcione para actualizar el estado de las notificaciones de los Mensajes (cantidad de Mensajes sin leer para cada Inbox)
    setNotificationsMessages: async (host_id) => {
        const loadingData = get().isLoadingInboxes;

        if (!loadingData) {
            const inboxes_list = get().dataInboxes?.map(inbox => inbox.inbox_id) || [];
            const { data } = await fetchMessagesUnread(host_id, inboxes_list);
            set({ notificacionesMessages: data });
        };
    },
}))

export const useCreateGroup = create((set, get) => ({
    members: [],

    // Funcion para agregar un nuevo contacto
    setAddMember: (value) => {
        const { members } = get();

        const check = members.some(member => member.id === value.id);
        if (members.length < 3 && !check) {
            set({ members: [...members, value] });
        }
    },

    // Funcion para remover un contacto
    setRemoveMember: (value) => {
        const { members } = get();

        const check = members.some(member => member.id === value);
        if (members.length >= 1 && check) {
            set({ members: members.filter(member => member.id !== value) });
        }
    },

    // Funcion para limpiar los contactos
    setEmptyMembers: () => set({ members: [] }),
}))