import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Image from "next/image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import BtnSignOut from "./btnSignOut";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";

export default async function ProfileDesign() {

    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    const allLists = [
        {
            name: 'Profile',
            href: '/profile',
            icon: AiOutlineUser,
            size: 20
        },
        {
            name: 'Settings',
            href: '/settings',
            icon: IoSettingsOutline,
            size: 20
        }
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Image 
                    src={session.user?.user_metadata?.avatar_url || '/avatar_default.jpg'} 
                    alt="avatar_profile" 
                    width={40} 
                    height={40} 
                    className="rounded-lg hover:cursor-pointer object-cover w-8 h-8"
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-50 bg-origin border border-gray-500 shadow-md-2xl text-gray-300">
                <DropdownMenuLabel className="text-sm font-bold">My Account</DropdownMenuLabel>

                <DropdownMenuGroup className="border-y border-gray-600">
                    {
                        allLists.map((list, index) => (
                            <Link 
                                href={list.href}
                                key={index}
                                >
                                    <DropdownMenuItem className="flex justify-start items-center gap-2 cursor-pointer">
                                        <list.icon size={list.size} className={list.name === 'Settings' ? 'animate-spin' : ''}/>
                                        {list.name}
                                    </DropdownMenuItem>
                            </Link>
                        ))
                    }
                </DropdownMenuGroup>

                <BtnSignOut />

            </DropdownMenuContent>
        </DropdownMenu>
    )
}