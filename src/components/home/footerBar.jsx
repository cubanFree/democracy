'use client';

import Link from 'next/link'
import { HiOutlineMap } from "react-icons/hi2";
import { LuWarehouse } from "react-icons/lu";
import { TbArrowsExchange2 } from "react-icons/tb";
import { FiSearch } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { usePathname } from 'next/navigation';

export default function FooterBar() {

    const pathDefault = usePathname();
    const [path, setPath] = React.useState(pathDefault);

    const allLinks = [
        {
            name: 'home',
            path: '/home',
            icon: HiOutlineMap,
            size: 30
        },
        {
            name: 'warehouse',
            path: '/warehouse',
            icon: LuWarehouse,
            size: 30
        },
        {
            name: 'search',
            path: '/search',
            icon: FiSearch,
            size: 30
        },
        {
            name: 'messages',
            path: '/messages',
            icon: BiMessageSquareDetail,
            size: 30
        },
        {
            name: 'stock',
            path: '/stock',
            icon: TbArrowsExchange2,
            size: 35
        }
    ]

    return (
        <nav className="w-full h-full border-t border-gray-700">
            <ul className="flex h-full justify-center items-center gap-8 sm:px-[10%]">
                {
                    allLinks.map((link) => (
                        <li key={link.name}>
                            <TooltipProvider>
                                <Tooltip>

                                    <TooltipTrigger>
                                        <Link 
                                            href={link.path}
                                            className={"hover:text-gray-500" + (path === link.path ? ' text-gray-500' : '')}
                                            onClick={() => setPath(link.path)}
                                            >
                                                <link.icon size={link.size}/>
                                        </Link>
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        <p>{link.name}</p>
                                    </TooltipContent>
                                    
                                </Tooltip>
                            </TooltipProvider>
                        </li>
                    ))
                }
            </ul>
        </nav>
    )
}