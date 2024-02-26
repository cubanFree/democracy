'use client';

import SearchBarInbox from "./search-bar";
import React from "react";
import { cn } from "@/lib/utils";
import ChatBox from "./chat-box";
import ShowInboxes from "./show-inboxes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { fetchInbox } from "@/lib/data";
import { FiLoader } from "react-icons/fi";

export default function InboxCase({ idHost }) {

    const supabase = createClientComponentClient();

    const [loadingInbox, setLoadingInbox] = React.useState(true); // para la carga de los inboxes
    const [handleSearch, setHandleSearch] = React.useState([]); // para obtener los inboxes de busqueda
    const [newMessage, setNewMessage] = React.useState({}); // para obtener el nuevo mensaje
    const [dataMessage, setDataMessage] = React.useState([]) // para obtener todo el contenido del inbox
    const [dataInbox, setDataInbox] = React.useState([]) // para obtener todos los inboxes

    console.log(dataInbox);

    // obtener todos los inboxes
    React.useEffect(() => {
        const getInboxes = async () => {
            const { data } = await fetchInbox();
            setDataInbox(data);
            setLoadingInbox(false);
        }

        getInboxes();
    }, [])

    // si hay un nuevo mensaje actualiza el estado dataInbox para mostrar la notificacion
    React.useEffect(() => {
        if (!newMessage || !dataInbox.length) return;

        setDataInbox(currentDataInbox => currentDataInbox.map(inbox => {
            if (inbox.inbox_id === newMessage.inbox_id) {
                return { ...inbox, lastMessage_content: newMessage.lastMessage_content, lastMessage_time: newMessage.lastMessage_time };
            }
            return inbox;
        }));
        

    }, [newMessage])

    return (
        <div className={cn(
                "grid w-full h-full grid-rows-1 overflow-hidden",
                dataMessage.length ? 'md:grid-cols-2' : 'grid-cols-1'
            )}
            >
                {/* lista de inboxs */}
                <div 
                    className={cn(
                        "w-full h-full scroll-custom relative",
                        dataMessage.length ? 'hidden md:flex md:flex-col' : 'flex flex-col'
                    )}
                    >
                        {
                            loadingInbox ? (
                                <div className="w-full h-full flex flex-col justify-center items-center">
                                    <FiLoader className="text-gray-500 animate-spin" size={30} />
                                </div>
                            ) : (
                                <>
                                {/* search bar */}
                                <SearchBarInbox data={dataInbox} onSearch={setHandleSearch} />

                                {/* inboxs list */}
                                <ShowInboxes
                                    idHost={idHost}
                                    data={handleSearch.length ? handleSearch : dataInbox}
                                    supabase={supabase}
                                    isOpen={dataMessage.length ? true : false}
                                    onOpen={setDataMessage}
                                    setDataInbox={setDataInbox}
                                    setNewMessage={setNewMessage}
                                />
                                </>
                            )
                        }
                </div>

                {/* messages */}
                <div className={cn(
                        "w-full h-full overflow-hidden",
                        dataMessage.length ? 'md:border-l-2 md:border-gray-500 z-0' : 'hidden'
                    )}
                    >
                        <ChatBox 
                            idHost={idHost} 
                            supabase={supabase} 
                            data={dataMessage} 
                            onClose={setDataMessage} 
                        />
                </div>
        </div>
    )
}