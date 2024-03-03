'use client';

import { fetchInbox, fetchMessagesUnread } from '@/lib/data';
import { create } from 'zustand';

export const useMessages = create((set, get) => ({
    isLoading: true,
    notificationsInboxes: 0,
    notificacionesMessages: [],
    inboxOpen: {},
    dataInboxes: [],
    setDataInboxes: async () => {
        const { data } = await fetchInbox();
        set({ dataInboxes: data });
        set((state) => ({ ...state, isLoading: false }));
    },
    setNewMessagesInboxes: (value) => {
        const { dataInboxes } = get();
        if (!dataInboxes.length) return;

        const updateDataInboxes = dataInboxes.map(inbox => {
            if (inbox.inbox_id === value.inbox_id) {
                return { ...inbox, lastMessage_content: value.lastMessage_content, lastMessage_time: value.lastMessage_time };
            }
            return inbox;
        })

        set({dataInboxes: updateDataInboxes});
    },
    setInboxOpen: (value) => set({ inboxOpen: value }),
    setNotificationsInboxes: (value) => set({ notificationsInboxes: value }),
    setNotificationsMessages: async (host_id) => {
        const loadingData = get().isLoading;

        if (!loadingData) {
            const inboxes_list = get().dataInboxes.map(inbox => inbox.inbox_id);
            const { data } = await fetchMessagesUnread(host_id, inboxes_list);
            set({ notificacionesMessages: data });
        };
    },
}))