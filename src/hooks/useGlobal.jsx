'use client';

import { fetchInbox, fetchMessages, fetchMessagesUnread } from '@/lib/data';
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
    setDataInboxes: async () => {
        const { data } = await fetchInbox();
        set({ dataInboxes: data?.sort((a, b) => new Date(b.lastMessage?.created_at).getTime() - new Date(a.lastMessage?.created_at).getTime()) });
        set((state) => ({ ...state, isLoadingInboxes: false }));
    },
    setDataSearch: (value) => {
        const { dataInboxes } = get();
        const search = dataInboxes?.filter(item => item.contacts[0].user_name.toLowerCase().includes(value.toLowerCase())) || [];
        set({ dataSearch: search });
    },
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
                    set({ dataMessages: [...dataMessages, value.item] });
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
    setInboxOpen: (value) => set({ inboxOpen: value }),
    setNotificationsInboxes: (value) => set({ notificationsInboxes: value }),
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
    setAddMember: (value) => {
        const { members } = get();

        const check = members.some(member => member.id === value.id);
        if (members.length < 3 && !check) {
            set({ members: [...members, value] });
        }
    },
    setRemoveMember: (value) => {
        const { members } = get();

        const check = members.some(member => member.id === value);
        if (members.length >= 1 && check) {
            set({ members: members.filter(member => member.id !== value) });
        }
    },
    setEmptyMembers: () => set({ members: [] }),
}))