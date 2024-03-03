'use client';

import { FiSearch } from "react-icons/fi"
import React from "react";
import { Input } from "../ui/input";
import { useMessages } from "@/hooks/useGlobal";

export default function SearchBarInbox({ onSearch = () => {} }) {

    // GET
    const dataInboxes = useMessages((state) => state.dataInboxes)

    // ref del input
    const inputRef = React.useRef(null)
    const [search, setSearch] = React.useState('')

    //estado de la busqueda
    const handleSearch = (value) => {
        setSearch(value)
        onSearch(dataInboxes.filter(item => item.contacts[0].user_name.toLowerCase().includes(value.toLowerCase())))
    }

    // estado de Cancelar busqueda
    const cancelSearch = () => {
        inputRef.current.value = ''
        setSearch('')
        onSearch(dataInboxes)
    }

    return (
        <main className="w-full flex flex-col gap-2 sticky top-0 bg-sub-origin px-2 py-1">

            <div className="w-full flex justify-start items-center gap-2">
                <label
                    className="w-full flex gap-4 justify-start items-center border border-gray-700 px-2 rounded-md bg-origin"
                    >
                        <FiSearch />
                        <Input 
                            type="text"
                            ref={inputRef}
                            placeholder="search message..."
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full border-0 p-0 py-2 h-auto bg-origin"
                        />
                </label>

                {
                    search && (
                        <span 
                            className="text-blue-400 flex items-center justify-center cursor-pointer"
                            onClick={cancelSearch}
                            >
                                cancel
                        </span>
                    )
                }
            </div>

        </main>
    )
}