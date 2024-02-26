'use client';

import React, { useEffect } from "react";
import Image from "next/image";
import { RiCloudOffLine } from "react-icons/ri";
import { TbPointFilled } from "react-icons/tb";
import moment from "moment";
import { cn } from "@/lib/utils";
import { update_column } from "@/lib/action";

export default function ShowInboxes(
    { 
        idHost, 
        data,
        supabase,
        isOpen,
        onOpen = () => {},
        setDataInbox = () => {},
        setNewMessage = () => {},
    }
) {

    // escuchando nuevos mensajes Realtime
    useEffect(() => {

        // actulizamos el Inboxes y la BD cuando Realtime capta un nuevo mensaje
        const updateUnreadMessages = async ({ inbox_id, message_id }) => {
            try {
                // Mapear y actualizar de forma asíncrona
                const updatePromises = data.map(async (inbox) => {
                    if (inbox.inbox_id === inbox_id) {
                        // Actualizar la BD
                        const { error } = await update_column({ filter: {inbox_id, user_id: idHost}, table: 'inbox_members', column: 'unread_messages', value: [...inbox.unread_messages, message_id] });
                        if (error) throw new Error(error);
                    }
                });
        
                // Esperar a que todas las operaciones asincrónicas se completen
                await Promise.all(updatePromises);
        
                // Ahora actualiza el estado local después de todas las actualizaciones
                setDataInbox(currentDataInbox => currentDataInbox.map(inbox => {
                    if (inbox.inbox_id === inbox_id) {
                        return { ...inbox, unread_messages: [...inbox.unread_messages, message_id] };
                    }
                    return inbox;
                }));

            } catch (error) {
                console.error('[ ERROR updateUnreadMessages ]', error);
            }
        }

        // Realtime
        const channel = supabase.channel('realtime-inbox').on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages' }, 
            (payload) => {
                setNewMessage({inbox_id: payload.new.inbox_id, lastMessage_content: payload.new.content, lastMessage_time: payload.new.created_at});

                // cuando capta un nuevo mensaje, se actualiza los mensajes no leidos
                if (payload.new.user_id !== idHost && !isOpen) {
                    updateUnreadMessages({ inbox_id: payload.new.inbox_id, user_id: payload.new.user_id, message_id: payload.new.id });
                }
            }
        ).subscribe();

        return () => supabase.removeChannel(channel);
    }, [data, idHost, supabase, isOpen]);

    // Actualizar el estado local para marcar los mensajes como leídos
    const handleOpenInbox = async ({ inbox_id }) => {
        try {
            // Mapear y actualizar de forma asíncrona
            const updatePromises = data.map(async (inbox) => {
                if (inbox.inbox_id === inbox_id) {
                    // Actualizar la BD
                    const { error } = await update_column({ filter: {inbox_id, user_id: idHost}, table: 'inbox_members', column: 'unread_messages', value: [] });
                    if (error) throw new Error(error);
                }
            });
    
            // Esperar a que todas las operaciones asincrónicas se completen
            await Promise.all(updatePromises);
    
            // Ahora actualiza el estado local después de todas las actualizaciones
            setDataInbox(currentDataInbox => currentDataInbox.map(inbox => {
                if (inbox.inbox_id === inbox_id) {
                    return { ...inbox, unread_messages: [] };
                }
                return inbox;
            }));

        } catch (error) {
            console.error('[ ERROR updateUnreadMessages ]', error);
        }
    };

    return data.length === 0 ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <RiCloudOffLine className="text-gray-600 animate-pulse" size={40} />
            <span className="text-gray-500">No results found</span>
        </div>
    ) : (
        data.map((item) => {
            const date = moment(item.lastMessage_time).format('hh:mm:ss A');
            console.log(item.unread_messages, item.unread_messages.length);

            return (
                <div 
                    key={item.inbox_id}
                    className="w-full border-b border-gray-700 hover:bg-zinc-800 px-2 py-4 flex flex-col gap-2"
                    onClick={() => {
                        handleOpenInbox({inbox_id: item.inbox_id});
                        onOpen([
                            { 
                                inbox_id: item.inbox_id,
                                avatar: item.avatar_group || item.contacts[0].avatar_url,
                                chat_name: item.title_inbox || item.contacts[0].user_name,
                                is_group: item.is_group,
                                contacts: item.contacts,
                                lastMessage_time: date
                            }]);
                    }}
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
                                <span className="text-sm text-gray-400">{date}</span>
                            </div>
                            <div className="w-full flex justify-between text-sm text-gray-400 truncate">
                                <span className={cn("w-full truncate", item.unread_messages.length && "font-bold")}>{item.lastMessage_content}</span>
                                { item.unread_messages.length ? <span className="bg-blue-800 rounded-full px-2 text-[12px] font-bold">{item.unread_messages.length}</span> : null }
                            </div>
                        </div>
                    </div>
                </div>
            );
        })
    );
}