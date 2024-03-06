'use client';

import React, { useEffect } from "react";
import Image from "next/image";
import { RiCloudOffLine } from "react-icons/ri";
import moment from "moment";
import { cn } from "@/lib/utils";
import { updateMessagesToRead } from "@/lib/action";
import { useMessages } from "@/hooks/useGlobal";
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";

// Actualizar el estado local para marcar los mensajes como leídos
const handleOpenInbox = async ({ item, date, idHost, setInboxOpen }) => {
    
    try {
        // Actualizar los mensajes no leidos en la BD
        const { data } = await updateMessagesToRead(item.contacts[0].user_id, item.inbox_id, idHost, item.is_group);

    } catch (error) {
        console.error('[ ERROR updateUnreadMessages ]', error);
    }

    // Actualiza el estado para abrir el inbox
    setInboxOpen(
        { 
            inbox_id: item.inbox_id,
            avatar: item.avatar_group || item.contacts[0].avatar_url,
            chat_name: item.title_inbox || item.contacts[0].user_name,
            is_group: item.is_group,
            contacts: item.contacts,
            lastMessage_time: date
        }
    );
};

export default function ShowInboxes({ idHost, supabase }) {

    // GET
    const dataInboxes = useMessages((state) => state.dataInboxes)
    const notificacionesMessages = useMessages((state) => state.notificacionesMessages)

    // SET
    const setInboxOpen = useMessages((state) => state.setInboxOpen);
    const setDataInboxes = useMessages((state) => state.setDataInboxes);

    useEffect(() => {
        const channel = supabase.channel('realtime-Inboxes')
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'messages' },
                (payload) => {
                    // escuchando actualizaciones si se ha leido el mensaje
                    if (payload.new.user_id === idHost) {
                        // cambiar el estado del Inbox
                        console.log('payload.new')
                        const indexInbox = dataInboxes.findIndex((i) => i.inbox_id === payload.new.inbox_id);
                        if (indexInbox !== -1) {
                            dataInboxes[indexInbox] = {...dataInboxes[indexInbox], lastMessage: payload.new}
                            setDataInboxes([...dataInboxes]);
                        }
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [idHost, supabase, dataInboxes, setDataInboxes]);

    return !dataInboxes.length ? (
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <RiCloudOffLine className="text-gray-600 animate-pulse" size={40} />
                    <span className="text-gray-500">No results found</span>
                </div>
            ) : (
                dataInboxes.map((item) => {
                    const date = moment(item.lastMessage?.created_at).format('hh:mm A');
                    const get_unread = notificacionesMessages?.filter(inbox => inbox.inbox_id === item.inbox_id) || [];
                    const { unread_total } = get_unread.length ? get_unread[0] : 0;
                    return (
                        <div 
                            key={item.inbox_id}
                            className="w-full border-b border-gray-700 hover:bg-zinc-800 px-2 py-4 flex flex-col gap-2"
                            onClick={() => handleOpenInbox({ item, date, idHost, setInboxOpen })}
                        >
                            <div className="w-full flex gap-4 items-center justify-start">
                                <Image 
                                    src={item.is_group ? item.avatar_group : item.contacts[0].avatar_url || '/avatar_default.jpg'}
                                    alt="avatar message"
                                    width={44}
                                    height={44}
                                    priority
                                    className='object-cover rounded-xl'
                                />
                                <div className="w-full flex flex-col justify-between gap-1 truncate">
                                    <div className="w-full flex justify-between">
                                        <span className="text-lg">{!item.is_group ? item.contacts[0].user_name : item.title_inbox}</span>
                                        <span className={cn("text-sm text-gray-400", unread_total && "text-blue-400")}>{date}</span>
                                    </div>
                                    <div className="w-full flex justify-between text-sm text-gray-400 truncate">
                                        <span 
                                            className={cn(
                                                "w-full truncate flex gap-1 items-center", unread_total && "italic"
                                            )}
                                        >
                                            {
                                                item.lastMessage?.user_id === idHost && (
                                                    item.lastMessage?.isRead ? (
                                                        <IoCheckmarkDoneOutline size={15} className="text-emerald-500" />
                                                    ) : (
                                                        <IoCheckmarkOutline size={15} />
                                                    )
                                                )
                                            }
                                            {item.lastMessage?.content}
                                        </span>
                                        { unread_total ? <span className="bg-blue-600 text-gray-300 rounded-full px-2 text-[12px] font-bold">{unread_total}</span> : null }
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
            })
        );
}