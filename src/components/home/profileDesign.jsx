import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Image from "next/image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import BtnSignOut from "./btnSignOut";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { fetchProfileData } from "@/lib/data";

export default async function ProfileDesign() {

    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await fetchProfileData({ filter: {id: user?.id}, table: 'users', caseBox: ['avatar_url'] });

    const allLists = [
        {
            name: 'Profile',
            href: '/profile',
            icon: AiOutlineUser,
            size: 20
        },
        {
            name: 'Settings',
            href: '/setting',
            icon: IoSettingsOutline,
            size: 20
        }
    ]
    console.log(data)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Image 
                    src={data[0]?.avatar_url || '/avatar_default.jpg'} 
                    alt="avatar_profile" 
                    width={40} 
                    height={40} 
                    className="rounded-lg hover:cursor-pointer object-cover w-8 h-8"
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="flex flex-col gap-2 w-50 bg-origin border border-gray-500 shadow-md-2xl text-gray-300">

                <DropdownMenuGroup className="border-b border-gray-600">
                    {
                        allLists.map((list, index) => (
                            <Link 
                                href={list.href}
                                key={index}
                                >
                                    <DropdownMenuItem className="flex justify-start items-center gap-2 cursor-pointer p-3">
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