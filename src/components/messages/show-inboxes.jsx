'use client';

import React, { useEffect, memo } from "react";
import Image from "next/image";
import moment from "moment";

import { RiCloudOffLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { updateMessagesToRead } from "@/lib/action";
import { useMessages } from "@/hooks/useGlobal";
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from "react-icons/io5";
import { fetchProfileData } from "@/lib/data";

// ACTUALIZA TODOS LOS MENSAJES DEL LOS CONTACTOS DEL INBOX COMO LEIDOS Y EL ESTADO DE INBOX ABIERTO
const handleOpenInbox = async (item, date, idHost, setInboxOpen, setDataMessages) => {
    
    // Actualizar los mensajes no leidos en la BD como leidos para cada contacto que pertenece al inbox excepto al host
    try {
        await updateMessagesToRead(item.contacts[0].user_id, item.inbox_id, idHost, item.is_group);
    } catch (error) {
        console.error("Error updating messages to read:", error);
    }

    // Actualiza el estado para abrir el inbox con sus mensajes e INFO
    const { data: isActive } = await fetchProfileData({ filter: { id: item.contacts[0].user_id }, table: 'users', caseBox: ['status'] });
    setDataMessages({inbox_id: item.inbox_id});
    setInboxOpen(
        {
            inbox_id: item.inbox_id,
            avatar: item.avatar_group || item.contacts[0].avatar_url,
            chat_name: item.title_inbox || item.contacts[0].user_name,
            is_group: item.is_group,
            contacts: item.contacts,
            lastMessage_time: date,
            status: isActive.status
        }
    );
};

// MEMOIZAMOS LA LISTA DE INBOXES PARA OPTIMIZAR EL RENDER
const InboxItem = memo(({ item, idHost, date, notificacionesMessages, onClick }) => {

    // Extraemos el numero de notificaciones para cada Inbox
    const get_unread = notificacionesMessages?.filter(inbox => inbox.inbox_id === item.inbox_id) || [];
    const { unread_total } = get_unread.length ? get_unread[0] : 0;

    return (
        <div 
            key={item.inbox_id}
            className="w-full border-b border-gray-700 hover:bg-zinc-800 px-2 py-4 flex flex-col gap-2 cursor-default"
            onClick={onClick}
        >
            <div className="w-full flex gap-4 items-center justify-start">
                <Image 
                    src={item.is_group ? item.avatar_group : item.contacts[0].avatar_url || '/avatar_default.jpg'}
                    alt="avatar inbox"
                    width={44}
                    height={44}
                    priority
                    className='object-cover rounded-xl'
                />
                <div className="w-full flex flex-col justify-between gap-1 truncate">
                    <div className="w-full flex justify-between">
                        <span className="text-lg">{!item.is_group ? item.contacts[0].user_name : item.title_inbox}</span>
                        <span className={ cn("text-sm text-gray-400", unread_total && "text-blue-400") }>{date}</span>
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
});
InboxItem.displayName = 'InboxItem';

export default function ShowInboxes({ idHost, supabase, inputRef }) {

    // GET
    const dataInboxes = useMessages((state) => state.dataInboxes)
    const dataSearch = useMessages((state) => state.dataSearch)
    const notificacionesMessages = useMessages((state) => state.notificacionesMessages)
    const inboxOpen = useMessages((state) => state.inboxOpen)

    // SET
    const setInboxOpen = useMessages((state) => state.setInboxOpen);
    const setDataInboxes = useMessages((state) => state.setDataInboxes);
    const setDataMessages = useMessages((state) => state.setDataMessages);

    // ESCUCHANDO REALTIME SI EL MENSAJE ENVIADO POR EL HOST HA SIDO LEIDO O NO, PARA CAMBIAR EL ESTADO DEL INBOX
    useEffect(() => {
        const channel = supabase.channel('realtime-Inboxes')
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'messages' },
                (payload) => {
                    // En caso de que el inbox actualizado sea del host y cambiar el estado
                    if (payload.new.user_id === idHost) {

                        setDataInboxes(currentDataInboxes => {
                            const indexInbox = currentDataInboxes.findIndex((i) => i.inbox_id === payload.new.inbox_id);

                            // Comprueba si el estado del nuevo mensaje representa un cambio antes de actualizar el estado, para no render... innecesario
                            if (indexInbox !== -1 && currentDataInboxes[indexInbox].lastMessage?.id !== payload.new.id && currentDataInboxes[indexInbox].lastMessage?.isRead !== payload.new.isRead) {
                                const newDataInboxes = [...currentDataInboxes];
                                newDataInboxes[indexInbox] = {
                                    ...newDataInboxes[indexInbox],
                                    lastMessage: payload.new
                                };
                                return newDataInboxes;
                            }
                            return currentDataInboxes;
                        });
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [idHost, supabase]);

    if (!dataInboxes?.length || (inputRef.current?.value && !dataSearch?.length)) { // En caso de que no existan inboxes
        return (
            <div className="w-full h-full flex flex-col justify-center items-center">
                <RiCloudOffLine className="text-gray-600 animate-pulse" size={40} />
                <span className="text-gray-500">No results found</span>
            </div>
        )

    } else { // En caso de que existan inboxes
        return (
            <React.Fragment>
                {(dataSearch?.length ? dataSearch : dataInboxes).map((item) => {
                    const date = moment(item.lastMessage?.created_at).format('hh:mm A');
                    const completeDate = moment(item.lastMessage?.created_at).format('MM/DD/YY, hh:mm A');
                    return (
                        <InboxItem
                            key={item.inbox_id}
                            disabled={inboxOpen && inboxOpen.inbox_id === item.inbox_id}
                            idHost={idHost}
                            date={date}
                            item={item}
                            notificacionesMessages={notificacionesMessages}
                            onClick={() => inboxOpen && inboxOpen.inbox_id === item.inbox_id ? {} : handleOpenInbox(item, completeDate, idHost, setInboxOpen, setDataMessages)}
                        />
                    )
                })}
            </React.Fragment>
        )
    }
}