'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function FiltersBar({ setFilter = () => { }, filter }) {

    return (
        <main className="w-full flex justify-end items-center">
            <Select defaultValue="company_name" onValueChange={setFilter} >
                <SelectTrigger className="w-[180px] bg-origin">
                    <SelectValue placeholder={filter} />
                </SelectTrigger>
                <SelectContent className="bg-card text-dark border border-gray-800">
                    <SelectGroup>
                        <SelectItem value="company_name">Company name</SelectItem>
                        <SelectItem value="recources">Recources</SelectItem>
                        <SelectItem value="librarys">Librarys</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </main>
    )
}