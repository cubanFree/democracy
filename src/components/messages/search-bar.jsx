'use client';

import React, { useState } from "react";

import { FiSearch } from "react-icons/fi";
import { Input } from "../ui/input";
import { useMessages } from "@/hooks/useGlobal";

export default function SearchBarInbox({ inputRef }) {

    // SET
    const setDataSearch = useMessages((state) => state.setDataSearch);

    // OTROS ESTADOS
    const [searchValue, setSearchValue] = useState('');

    // OBTENER BUSQUEDA
    const handleSearch = (value) => {
        setSearchValue(value);
        setDataSearch(value);
    }

    // CANCELAR BUSQUEDA
    const cancelSearch = () => {
        setSearchValue('');
        setDataSearch('');
        inputRef.current.value = '';
    };

    return (
        <main className="w-full flex flex-col gap-2 sticky top-0 bg-sub-origin px-2 py-1">
            <div className="w-full flex justify-start items-center gap-2">
                <label className="w-full flex gap-4 justify-start items-center border border-gray-700 px-2 rounded-md bg-origin">
                    <FiSearch />
                    <Input 
                        type="text"
                        ref={inputRef}
                        placeholder="search inbox..."
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full border-0 p-0 py-2 h-auto bg-origin"
                    />
                </label>
                {searchValue && (
                    <span 
                        className="text-blue-400 flex items-center justify-center cursor-pointer"
                        onClick={cancelSearch}
                    >
                        cancel
                    </span>
                )}
            </div>
        </main>
    );
}