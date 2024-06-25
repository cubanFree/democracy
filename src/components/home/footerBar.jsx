'use client';

import Link from 'next/link'
import { HiOutlineMap } from "react-icons/hi2";
import { LuWarehouse } from "react-icons/lu";
import { BiMessageSquareDetail } from "react-icons/bi";
import React, { useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { handleMessageReceived } from '@/lib/action';
import { fetchInboxesUnread } from '@/lib/data';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMessages } from '@/hooks/useGlobal';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import SideBar from '../general/side-bar';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { GoGitCompare } from "react-icons/go";
import { MdOutlineSummarize, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { BsCoin } from "react-icons/bs";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { LuListStart, LuListEnd } from "react-icons/lu";
import { TbListSearch } from "react-icons/tb";
import { RiGitRepositoryLine } from "react-icons/ri";
import { CiInboxIn } from "react-icons/ci";
import { IoEarthOutline } from "react-icons/io5";
import { TbHomeLink } from "react-icons/tb";

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

    // Escuchando nuevos mensajes Realtime
    useEffect(() => {
        getCountInboxesUnread({ user_id: idHost, setNotificationsInboxes });
    }, [idHost, setNotificationsInboxes]);

    // Escuchando cambio de ruta para cerrar el inbox
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
                        updateDataInbox(payload.new, idHost, ((inboxOpen !== null && inboxOpen.inbox_id === payload.new.inbox_id) ? true : false));
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
            name: 'messages',
            path: '/messages/inbox',
            icon: BiMessageSquareDetail,
            size: 25
        },
        {
            name: 'stock',
            path: '/stock',
            icon: GoGitCompare,
            size: 25
        }
    ]

    const listMenu = {
        warehouse: [
            { name: 'Summaries', href: '/warehouse/summaries', icon: MdOutlineSummarize, size: 25 },
            { name: 'Accounting', href: '/warehouse/accounting', icon: MdOutlineAccountBalanceWallet, size: 25 },
            { name: 'Directors', href: '/warehouse/directors', icon: FaUserTie, size: 25 },
            { name: 'Finance', href: '/warehouse/finance', icon: AiOutlineStock, size: 25 },
            { name: 'SimCoin', href: '/warehouse/simcoin', icon: BsCoin, size: 25 },
            { name: 'Goods', href: '/warehouse/goods', icon: MdOutlineRealEstateAgent, size: 25 },
            { name: 'Starters', href: '/warehouse/starters', icon: LuListStart, size: 25 },
            { name: 'Outgoing', href: '/warehouse/outgoing', icon: LuListEnd, size: 25 },
            { name: 'Statistics', href: '/warehouse/statistics', icon: TbListSearch, size: 25 },
            { name: 'Investigation', href: '/warehouse/investigation', icon: RiGitRepositoryLine, size: 25 }
        ],
        messages: [
            { name: 'Inbox', href: '/messages/inbox', icon: CiInboxIn, size: 25, notifications: notificationsInboxes },
            { name: 'Social', href: '/messages/social', icon: IoEarthOutline, size: 25, notifications: 0 },
            { name: 'My country', href: '/messages/my-country', icon: TbHomeLink, size: 25, notifications: 0 }
        ]
    };

    return (
        <nav className="w-full h-full border-t border-gray-700">
            <ul className="flex h-full justify-center items-center gap-8 lg:mx-[10%]">
                {
                    allLinks.map((link) => (
                        <li key={link.name} className="flex justify-center items-center relative">
                            <TooltipProvider>
                                <Tooltip>

                                    <TooltipTrigger>
                                    <Link 
                                        href={link.path}
                                        className={cn(
                                            "hover:text-gray-500",
                                            (pathDefault.split('/')[1] === link.path.split('/')[1] ? ' text-gray-500' : '')
                                        )}
                                    >
                                        <link.icon size={link.size} />
                                        {
                                            (link.name === 'messages' && notificationsInboxes > 0) && 
                                                <span 
                                                    className='bg-blue-600 rounded-full px-2 text-[12px] text-white font-bold absolute -top-2 -right-2'
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

                {
                    listMenu[pathDefault.split('/')[1]] 
                        ? (
                            <>
                            <div className="h-1/2 border-x border-gray-700 md:hidden"/>

                            <div className="flex items-center md:hidden">
                                <Sheet>
                                    <SheetTrigger><HiOutlineMenuAlt2 size={25}/></SheetTrigger>
                                    <SheetContent className="bg-card w-[15rem] overflow-y-auto text-gray-300">
                                        <SideBar 
                                            className='flex justify-start flex-col gap-2'
                                            pathList={listMenu[pathDefault.split('/')[1]]}
                                        />
                                    </SheetContent>
                                </Sheet>
                            </div>
                            </>
                        ) : null
                }
            </ul>
        </nav>
    )
}