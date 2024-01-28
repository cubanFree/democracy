'use client';

import React from "react";
import { Input } from "../ui/input";
import { FiSearch } from "react-icons/fi";
import FiltersBar from "./filters-bar";
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar({ setData = () => {} }) {

    // ref del input
    const inputRef = React.useRef(null)

    // estados filter y search
    const [filter, setFilter] = React.useState('company_name')
    const [search, setSearch] = React.useState('')

    // estado de busqueda
    const resault = useDebouncedCallback(async (value) => {
        setSearch(value)
        if (value && filter) {
            console.log('search', value)
            console.log('filter', filter)
            return setData('true')
        }
        return setData('false')
    }, 500)

    // estado de Cancelar busqueda
    const cancelSearch = () => {
        inputRef.current.value = ''
        setSearch('')
    }

    return (
        <main className="w-full flex flex-col gap-2">

            <div className="w-full flex justify-start items-center gap-2">
                <form
                    action=''
                    className="w-full"
                    >
                        <label
                            className="w-full flex gap-4 justify-start items-center border border-gray-700 px-2 rounded-md"
                            >
                                <FiSearch />
                                <Input 
                                    type="text"
                                    ref={inputRef}
                                    placeholder="search quickly..."
                                    onChange={(e) => resault(e.target.value)}
                                    className="w-full border-0 p-0"
                                />
                        </label>
                </form>

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

            <FiltersBar setFilter={setFilter} filter={filter} />

        </main>
    )
}