/*
    El estado dataMessage guarda el objeto del inbox seleccionado para mostrar su contenido.
    El estado dataInbox es el arreglo de inboxs.
*/

'use client';

import SearchBarInbox from "./search-bar";
import React from "react";
import ShowMessages from "./show-messages";
import { cn } from "@/lib/utils";
import ContentMessage from "./content-message";

export default function InboxCase({ data }) {

    const [dataMessage, setDataMessage] = React.useState([])
    const [dataInbox, setDataInbox] = React.useState(data)

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
                        {/* search bar */}
                        <SearchBarInbox data={data} onSearch={setDataInbox} />

                        {/* inboxs list */}
                        <ShowMessages data={dataInbox} onOpen={setDataMessage} />
                </div>

                {/* messages */}
                <div className={cn(
                        "w-full h-full",
                        dataMessage.length ? 'flex-wrap md:border-l-2 md:border-gray-500 z-0' : 'hidden'
                    )}
                    >
                        <ContentMessage data={dataMessage} onOpen={setDataMessage} />
                </div>
        </div>
    )
}