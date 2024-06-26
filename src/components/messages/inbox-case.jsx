'use client';

import React, { useEffect, useRef } from "react";

import SearchBarInbox from "./search-bar";
import { cn } from "@/lib/utils";
import ChatBox from "./chat-box";
import ShowInboxes from "./show-inboxes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FiLoader } from "react-icons/fi";
import { useMessages } from "@/hooks/useGlobal";
import CreateGroup from "./createGroup";

export default function InboxCase({ idHost }) {

    // GET
    const isLoadingInboxes = useMessages((state) => state.isLoadingInboxes)
    const inboxOpen = useMessages((state) => state.inboxOpen)

    // SET
    const setDataInboxes = useMessages((state) => state.setDataInboxes)
    const setNotificationsMessages = useMessages((state) => state.setNotificationsMessages)

    const supabase = createClientComponentClient();
    const inputRef = useRef();

    // OBTENER LOS INBOXES
    useEffect(() => {
        setDataInboxes()
        setNotificationsMessages(idHost)
    }, [idHost, inboxOpen, setDataInboxes, setNotificationsMessages]);

    return (
        <div className={cn(
                "grid w-full h-full grid-rows-1 overflow-hidden",
                inboxOpen ? 'md:grid-cols-2' : 'grid-cols-1'
            )}
        >
            {/* LISTA DE INBOXES */}
            <div 
                className={cn(
                    "w-full h-full scroll-custom relative",
                    inboxOpen ? 'hidden md:flex md:flex-col md:rounded-3xl' : 'flex flex-col'
                )}
            >
                {
                    isLoadingInboxes ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <FiLoader className="text-gray-500 animate-spin" size={30} />
                        </div>
                    ) : (
                        <>
                            {/* BARRA DE BUSQUEDA */}
                            <div className="w-full flex justify-between sticky top-0 bg-sub-origin">
                                <SearchBarInbox inputRef={inputRef} />
                                <CreateGroup idHost={idHost} />
                            </div>

                            {/* LISTA DE INBOXES MOSTRADA */}
                            <ShowInboxes idHost={idHost} supabase={supabase} inputRef={inputRef} />
                        </>
                    )
                }
            </div>

            {/* MENSAJES DEL INBOX SELECCIONADO */}
            <div className={cn(
                    "w-full h-full overflow-hidden",
                    inboxOpen ? 'z-0 bg-sub-origin rounded-xl md:bg-[#0d0f10] md:rounded-r-xl md:border md:border-gray-700' : 'hidden'
                )}
            >
                <ChatBox idHost={idHost} supabase={supabase} />
            </div>
        </div>
    )
}