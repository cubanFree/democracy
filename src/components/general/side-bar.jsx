'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TbPointFilled } from "react-icons/tb";

export default function SideBar({ pathList = [], className }) {

    const pathname = usePathname();

    return (
        <div className={cn(
            'w-full h-full',
            className
        )}
        
            >
                {
                    pathList.map((path, index) => (
                        <Link
                            key={index}
                            href={path.href}
                            className={cn(
                                'flex justify-start items-center gap-2 p-2 md:cursor-pointer md:hover:bg-foreground md:hover:text-background md:justify-center lg:justify-start',
                                pathname === path.href ? 'text-blue-300' : '',
                                )}
                            >
                                <div className='relative'>
                                    <path.icon size={path.size} />
                                    {
                                        (path.notifications > 0) && <TbPointFilled size={15} className='text-blue-600 absolute -top-1 -right-1' />
                                    }
                                </div>
                                
                                <span className='flex md:hidden lg:flex'>{path.name}</span>
                        </Link>
                    ))
                }
        </div>
    )
}