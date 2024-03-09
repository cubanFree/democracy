'use client';

import React, { useEffect, useRef } from "react";

import SearchBarInbox from "./search-bar";
import { cn } from "@/lib/utils";
import ChatBox from "./chat-box";
import ShowInboxes from "./show-inboxes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FiLoader } from "react-icons/fi";
import { useMessages } from "@/hooks/useGlobal";

export default function InboxCase({ idHost }) {

    // GET
    const isLoading = useMessages((state) => state.isLoading)
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
    }, [idHost, inboxOpen, isLoading]);

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
                    inboxOpen ? 'hidden md:flex md:flex-col' : 'flex flex-col'
                )}
            >
                {
                    isLoading ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <FiLoader className="text-gray-500 animate-spin" size={30} />
                        </div>
                    ) : (
                        <>
                            {/* BARRA DE BUSQUEDA */}
                            <SearchBarInbox inputRef={inputRef} />

                            {/* LISTA DE INBOXES MOSTRADA */}
                            <ShowInboxes idHost={idHost} supabase={supabase} inputRef={inputRef} />
                        </>
                    )
                }
            </div>

            {/* MENSAJES DEL INBOX SELECCIONADO */}
            <div className={cn(
                    "w-full h-full overflow-hidden",
                    inboxOpen ? 'md:border-l-2 md:border-gray-500 z-0' : 'hidden'
                )}
            >
                <ChatBox idHost={idHost} supabase={supabase} />
            </div>
        </div>
    )
}