'use client';

import { FiSearch } from "react-icons/fi"
import React from "react";
import { Input } from "../ui/input";

export default function SearchBarInbox({ setSearch = () => {}, search }) {

    // ref del input
    const inputRef = React.useRef(null)

    // estado de Cancelar busqueda
    const cancelSearch = () => {
        inputRef.current.value = ''
        setSearch('')
    }

    return (
        <main className="w-full flex flex-col gap-2">

            <div className="w-full flex justify-start items-center gap-2">
                <label
                    className="w-full flex gap-4 justify-start items-center border border-gray-700 px-2 rounded-md bg-origin"
                    >
                        <FiSearch />
                        <Input 
                            type="text"
                            ref={inputRef}
                            placeholder="search message..."
                            onChange={(e) => setSearch(e.target.value)}
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