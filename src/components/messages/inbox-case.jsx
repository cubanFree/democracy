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
                        dataMessage.length ? 'hidden sm:flex sm:flex-col sm:gap-2' : 'flex flex-col gap-2'
                    )}
                    >
                        {/* search bar */}
                        <SearchBarInbox data={data} onSearch={setDataInbox} />

                        {/* inboxs list */}
                        <ShowMessages data={dataInbox} onOpen={setDataMessage} />
                </div>

                {/* messages */}
                <div className={cn(
                        "w-full h-full md:pl-2",
                        dataMessage.length ? 'flex-wrap md:border-l md:border-gray-600 z-0' : 'hidden'
                    )}
                    >
                        <ContentMessage data={dataMessage} onOpen={setDataMessage} />
                </div>
        </div>
    )
}