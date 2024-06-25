'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { IoFilterOutline } from "react-icons/io5";

export default function FiltersBar({ onFilter = () => { } }) {

    return (
        <Select defaultValue="company_name" onValueChange={onFilter} >
            <SelectTrigger className="h-full w-50 flex justify-normal p-0 bg-transparent border-0">
                <IoFilterOutline size={15} />
            </SelectTrigger>
            <SelectContent className="bg-card text-dark border border-gray-800">
                <SelectGroup>
                    <SelectItem value="company_name">Company name</SelectItem>
                    <SelectItem value="recources">Recources</SelectItem>
                    <SelectItem value="librarys">Librarys</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}