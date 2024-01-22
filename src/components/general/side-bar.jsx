'use client';

import Link from 'next/link';

export default function SideBar({ pathList = [] }) {
    return (
        <div className='w-full h-full border border-gray-600'>
            {
                pathList.map((path, index) => (
                    <Link
                        key={index}
                        href={path.href}
                        className='flex justify-center items-center gap-2 cursor-pointer p-3 hover:bg-foreground hover:text-background md:justify-start'
                        >
                            <path.icon size={path.size} />
                            <span className='hidden md:flex'>{path.name}</span>
                    </Link>
                ))
            }
        </div>
    )
}