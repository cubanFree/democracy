'use client';

import SearchBarInbox from "./search-bar";
import React from "react";
import ShowMessages from "./show-messages";
import { cn } from "@/lib/utils";
import ContentMessage from "./content-message";

export default function InboxCase({ data }) {

    const [search, setSearch] = React.useState('')
    const [dataMessages, setDataMessages] = React.useState(null)

    return (
        <>
            {/* search bar */}
            <SearchBarInbox setSearch={setSearch} search={search} />
            
            <div className={cn(
                    "grid w-full h-full grid-rows-1",
                    dataMessages ? 'grid-cols-[1fr_4fr] md:grid-cols-2' : 'grid-cols-1'
                )}
                >
                    {/* lista de inboxs */}
                    <div 
                        className={cn(
                            "w-full h-full pb-12 flex flex-col gap-2 scroll-custom",
                        )}
                        >
                            <ShowMessages search={search} data={data} dataMessages={dataMessages} openMessage={setDataMessages} />
                    </div>

                    {/* messages */}
                    <div className={cn(
                            "w-full flex flex-col p-2",
                            dataMessages ? 'visible border-l border-gray-600 z-0' : 'hidden border-0'
                        )}
                        >
                            <ContentMessage dataMessages={dataMessages} setDataMessages={setDataMessages} />
                    </div>
            </div>
        </>
    )
}