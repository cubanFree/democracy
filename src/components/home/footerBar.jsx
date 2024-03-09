'use client';

import Link from 'next/link'
import { HiOutlineMap } from "react-icons/hi2";
import { LuWarehouse } from "react-icons/lu";
import { TbArrowsExchange2 } from "react-icons/tb";
import { FiSearch } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import React, { useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { handleMessageReceived } from '@/lib/action';
import { fetchInboxesUnread } from '@/lib/data';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMessages } from '@/hooks/useGlobal';

// ACTUALIZAMOS EL ESTADO DE LECTURA DE LOS INBOXES Y MENSAJES DEPENDIENDO SI EL INBOX ESTA ABIERTO O NO
const updateDataInbox = async (message, idHost, isInboxOpen) => {
    await handleMessageReceived(message, false, idHost, isInboxOpen);
}

// obtener la cantidad de inbox sin leer
const getCountInboxesUnread = async ({user_id, setNotificationsInboxes}) => {
    const { data: countInboxesUnread } = await fetchInboxesUnread({ user_id });
    setNotificationsInboxes(countInboxesUnread || 0);
}

export default function FooterBar({ idHost }) {

    // GET
    const notificationsInboxes = useMessages((state) => state.notificationsInboxes);
    const inboxOpen = useMessages((state) => state.inboxOpen);

    // SET
    const setNewMessagesInboxes = useMessages((state) => state.setNewMessagesInboxes);
    const setNotificationsInboxes = useMessages((state) => state.setNotificationsInboxes);
    const setNotificationsMessages = useMessages((state) => state.setNotificationsMessages);
    const setInboxOpen = useMessages((state) => state.setInboxOpen);
    const setDataInboxes = useMessages((state) => state.setDataInboxes);

    // OTHER STATES
    const supabase = createClientComponentClient();
    const pathDefault = usePathname();

    // escuchando nuevos mensajes Realtime
    useEffect(() => {
        getCountInboxesUnread({ user_id: idHost, setNotificationsInboxes });
    }, [idHost, setNotificationsInboxes]);

    useEffect(() => {
        if (pathDefault !== '/messages/inbox') {
            setInboxOpen(null);
        }
    }, [pathDefault, setInboxOpen]);
    

    // Realtime
    useEffect(() => {
        const channel = supabase.channel('realtime-inboxes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' }, 
                (payload) => {
                    setNewMessagesInboxes({inbox_id: payload.new.inbox_id, lastMessage: payload.new});

                    if (payload.new.user_id !== idHost) {
                        updateDataInbox(payload.new, idHost, inboxOpen !== null ? true : false);
                        setNotificationsMessages(idHost);
                        getCountInboxesUnread({user_id: idHost, setNotificationsInboxes});
                    }
                    
                }
            )
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'inbox_members' },
                (payload) => {
                    if (payload.new.user_id === idHost) {
                        getCountInboxesUnread({user_id: idHost, setNotificationsInboxes})
                    };
                }
            )
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'inbox_members' },
                (payload) => {
                    if (payload.new.user_id === idHost) {
                        setDataInboxes()
                        setNotificationsMessages(idHost)
                    };
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [idHost, supabase, inboxOpen, pathDefault, setInboxOpen, setNewMessagesInboxes, setNotificationsInboxes, setNotificationsMessages, setDataInboxes]); 

    const allLinks = [
        {
            name: 'home',
            path: '/home',
            icon: HiOutlineMap,
            size: 25
        },
        {
            name: 'warehouse',
            path: '/warehouse/summaries',
            icon: LuWarehouse,
            size: 25
        },
        {
            name: 'search',
            path: '/search',
            icon: FiSearch,
            size: 25
        },
        {
            name: 'messages',
            path: '/messages/inbox',
            icon: BiMessageSquareDetail,
            size: 25
        },
        {
            name: 'stock',
            path: '/stock',
            icon: TbArrowsExchange2,
            size: 30
        }
    ]

    return (
        <nav className="w-full h-full border-t border-gray-700">
            <ul className="flex h-full justify-center items-center gap-8 lg:mx-[10%]">
                {
                    allLinks.map((link) => (
                        <li key={link.name} className="flex justify-center items-center">
                            <TooltipProvider>
                                <Tooltip>

                                    <TooltipTrigger>
                                        <Link 
                                            href={link.path}
                                            className={cn(
                                                "hover:text-gray-500 relative",
                                                (pathDefault === link.path ? ' text-gray-500 animate-pulse' : '')
                                            )}
                                            >
                                                <link.icon size={link.size} />
                                                {
                                                    (link.name === 'messages' && notificationsInboxes > 0) && 
                                                        <span 
                                                            className='bg-blue-600 rounded-full px-2 text-[12px] font-bold absolute -top-1 -right-1'
                                                            >
                                                                {notificationsInboxes}
                                                        </span>
                                                }
                                        </Link>
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        <p>{link.name}</p>
                                    </TooltipContent>
                                    
                                </Tooltip>
                            </TooltipProvider>
                        </li>
                    ))
                }
            </ul>
        </nav>
    )
}