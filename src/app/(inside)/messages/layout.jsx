'use client';

import SideBar from "@/components/general/side-bar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CiInboxIn } from "react-icons/ci";
import { IoEarthOutline } from "react-icons/io5";
import { TbHomeLink } from "react-icons/tb";
import { AiOutlineMenu } from "react-icons/ai";

export default function layout({ children }) {

    return (
        <main className="grid h-full w-full p-2 gap-1 grid-rows-[1fr_15fr_7fr] md:grid-cols-[1fr_2fr_2fr] md:grid-rows-1">

            <div className="flex justify-end md:hidden">
                <Sheet>
                    <SheetTrigger><AiOutlineMenu size={25} /></SheetTrigger>
                    <SheetContent className="bg-card border-gray-700 w-[10rem]">
                        <SideBar 
                            className='flex justify-start flex-col gap-4'
                            pathList={[
                                { name: 'Inbox', href: '/messages/inbox', icon: CiInboxIn, size: 25 },
                                { name: 'Social', href: '/messages/social', icon: IoEarthOutline, size: 25 },
                                { name: 'My country', href: '/messages/my-country', icon: TbHomeLink, size: 25 },
                            ]}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:flex">
                <SideBar 
                    pathList={[
                        { name: 'Inbox', href: '/messages/inbox', icon: CiInboxIn, size: 25 },
                        { name: 'Social', href: '/messages/social', icon: IoEarthOutline, size: 25 },
                        { name: 'My country', href: '/messages/my-country', icon: TbHomeLink, size: 25 },
                    ]}
                />
            </div>

            <div className="grid rounded-xl p-2 bg-card shadow-lg">
                {children}
            </div>
            
            <div className="grid rounded-xl p-2 bg-card shadow-lg">
                <span>Tercera box</span>
            </div>
        </main>
    )
}