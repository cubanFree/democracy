'use client';

import React from "react";
import { Input } from "../ui/input";
import { FiSearch } from "react-icons/fi";
import FiltersBar from "./filters-bar";
import { useDebouncedCallback } from 'use-debounce';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

export default function SearchBar() {

    // ref del input
    const inputRef = React.useRef(null)

    // estados filter y search
    const [filter, setFilter] = React.useState('company_name')
    const [search, setSearch] = React.useState('')
    const [data, setData] = React.useState([])
    const [openSearch, setOpenSearch] = React.useState(false)

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
        <>
        <label
            className="hidden items-center w-96 h-7 gap-2 justify-start border border-gray-700 px-2 rounded-md text-gray-400 sm:flex"
        >
            <FiSearch size={20}/>
            <Input 
                type="text"
                ref={inputRef}
                placeholder={filter}
                onChange={(e) => resault(e.target.value)}
                className="flex w-full h-full border-0 p-0"
            />
            {
                search && (
                    <span 
                        className="text-blue-400 flex items-center justify-center cursor-pointer text-sm"
                        onClick={cancelSearch}
                        >
                            cancel
                    </span>
                )
            }
            <FiltersBar onFilter={setFilter} />
        </label>

        <Popover>
            <PopoverTrigger asChild className="sm:hidden flex">
                <Button className="p-0 bg-origin"><FiSearch size={20}/></Button>
            </PopoverTrigger>
            <PopoverContent className="flex items-center w-screen h-7 gap-2 justify-start border-2 border-yellow-700 px-2 rounded-md text-gray-400 bg-origin">
                <FiSearch size={20}/>
                <Input 
                    type="text"
                    ref={inputRef}
                    placeholder={filter}
                    onChange={(e) => resault(e.target.value)}
                    className="flex w-full h-full border-0"
                />
                {
                    search && (
                        <span 
                            className="text-blue-400 flex items-center justify-center cursor-pointer text-sm"
                            onClick={cancelSearch}
                            >
                                cancel
                        </span>
                    )
                }
                <FiltersBar onFilter={setFilter} />
            </PopoverContent>
        </Popover>
        </>
    )
}