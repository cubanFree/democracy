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
                    dataMessages ? 'sm:grid-cols-[1fr_5fr] md:grid-cols-2' : 'grid-cols-1'
                )}
                >
                    {/* lista de inboxs */}
                    <div 
                        className={cn(
                            "w-full h-full pb-12 scroll-custom",
                            dataMessages ? 'hidden sm:flex flex-col gap-2' : 'flex flex-col gap-2'
                        )}
                        >
                            <ShowMessages search={search} data={data} dataMessages={dataMessages} openMessage={setDataMessages} />
                    </div>

                    {/* messages */}
                    <div className={cn(
                            "w-full flex flex-col p-2 pb-12",
                            dataMessages ? 'visible sm:border-l sm:border-gray-600 z-0' : 'hidden'
                        )}
                        >
                            <ContentMessage dataMessages={dataMessages} setDataMessages={setDataMessages} />
                    </div>
            </div>
        </>
    )
}