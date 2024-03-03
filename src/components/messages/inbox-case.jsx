'use client';

import SearchBarInbox from "./search-bar";
import React, { useEffect } from "react";
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
    const [handleSearch, setHandleSearch] = React.useState([]); // para obtener los inboxes de busqueda

    // obtener los inboxes
    useEffect(() => {
        setDataInboxes()
        setNotificationsMessages(idHost)
    }, [idHost, handleSearch, inboxOpen, isLoading, setHandleSearch, setDataInboxes]);

    return (
        <div className={cn(
                "grid w-full h-full grid-rows-1 overflow-hidden",
                Object.keys(inboxOpen).length ? 'md:grid-cols-2' : 'grid-cols-1'
            )}
        >
            {/* lista de inboxs */}
            <div 
                className={cn(
                    "w-full h-full scroll-custom relative",
                    Object.keys(inboxOpen).length ? 'hidden md:flex md:flex-col' : 'flex flex-col'
                )}
            >
                {
                    isLoading ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <FiLoader className="text-gray-500 animate-spin" size={30} />
                        </div>
                    ) : (
                        <>
                            {/* search bar */}
                            <SearchBarInbox onSearch={setHandleSearch} />

                            {/* inboxs list */}
                            <ShowInboxes idHost={idHost} />
                        </>
                    )
                }
            </div>

            {/* messages */}
            <div className={cn(
                    "w-full h-full overflow-hidden",
                    Object.keys(inboxOpen).length ? 'md:border-l-2 md:border-gray-500 z-0' : 'hidden'
                )}
            >
                <ChatBox idHost={idHost} supabase={supabase} />
            </div>
        </div>
    )
}