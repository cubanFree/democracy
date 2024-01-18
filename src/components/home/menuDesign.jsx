'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineExpandMore } from "react-icons/md";
import { RiExpandLeftRightLine } from "react-icons/ri";
import React from "react";
import Link from "next/link";
import { LuLibrary } from "react-icons/lu";
import { MdLibraryBooks } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { BiSolidObjectsVerticalBottom } from "react-icons/bi";
import { FaRegNoteSticky } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";

export default function MenuDesign() {

    const [open, setOpen] = React.useState(false)
    const allLinks = [
        {
            name: 'library',
            path: '/library',
            icon: LuLibrary,
            size: 20
        },
        {
            name: 'Encyclopedia',
            path: '/encyclopedia',
            icon: MdLibraryBooks,
            size: 20
        },
        {
            name: 'Referrals',
            path: '/referrals',
            icon: AiOutlineUsergroupAdd,
            size: 20
        },
        {
            name: 'Goals',
            path: '/goals',
            icon: BiSolidObjectsVerticalBottom,
            size: 20
        },
        {
            name: 'Notes',
            path: '/notes',
            icon: FaRegNoteSticky,
            size: 20
        },
        {
            name: 'Support',
            path: '/support',
            icon: BiSupport,
            size: 20
        }
    ]

    return (
        <DropdownMenu onOpenChange={(open) => setOpen(open)}>
            <DropdownMenuTrigger className="flex justify-center items-center">
                {
                    open
                        ? <MdOutlineExpandMore size={30} className="animate-pulse"/>
                        : <RiExpandLeftRightLine size={30}/>
                }
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-origin text-gray-300 border border-gray-500 shadow-md-2xl">
                {
                    allLinks.map((link, index) => (
                        <Link
                            href={link.path}
                            key={index}
                            >
                                <DropdownMenuItem
                                    className="flex justify-start items-center gap-2 cursor-pointer"
                                    >
                                        <link.icon size={link.size}/>
                                        {link.name}
                                </DropdownMenuItem>
                        </Link>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}