'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function SideBar({ pathList = [], className }) {

    const pathname = usePathname();
    const [pathLoc, setPath] = React.useState(pathname);

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
                            onClick={() => setPath(path.href)}
                            className={cn(
                                'flex justify-center items-center gap-2 px-4 md:cursor-pointer md:hover:bg-foreground md:hover:text-background lg:justify-start sm:p-3',
                                pathLoc === path.href ? 'text-blue-400' : '',
                                )}
                            >
                                <path.icon size={path.size} />
                                <span className='hidden lg:flex'>{path.name}</span>
                        </Link>
                    ))
                }
        </div>
    )
}