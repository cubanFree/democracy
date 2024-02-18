/*
    El estado dataMessage guarda el objeto del inbox seleccionado para mostrar su contenido.
    El estado dataInbox es el arreglo de inboxs.
*/

'use client';

import SearchBarInbox from "./search-bar";
import React, { Suspense } from "react";
import { cn } from "@/lib/utils";
import ContentMessage from "./content-message";
import ShowInboxes from "./show-inboxes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function InboxCase({ data, idHost }) {
    
    if (!data) throw new Error('ERROR 500: Something went wrong in Inbox');

    const supabase = createClientComponentClient();

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
                        <ShowInboxes idHost={idHost} data={dataInbox} supabase={supabase} onOpen={setDataMessage} />
                </div>

                {/* messages */}
                <div className={cn(
                        "w-full h-full overflow-hidden",
                        dataMessage.length ? 'md:border-l-2 md:border-gray-500 z-0' : 'hidden'
                    )}
                    >
                        <Suspense fallback={<span>Loading messages...</span>}>
                            <ContentMessage idHost={idHost} supabase={supabase} data={dataMessage} onClose={setDataMessage} />
                        </Suspense>
                </div>
        </div>
    )
}