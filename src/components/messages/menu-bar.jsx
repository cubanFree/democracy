'use client';

import SideBar from "../general/side-bar";
import { CiInboxIn } from "react-icons/ci";
import { IoEarthOutline } from "react-icons/io5";
import { TbHomeLink } from "react-icons/tb";
import { useMessages } from "@/hooks/useGlobal";

export default function MenuBarMessages() {

    // GET
    const notificationsInboxes = useMessages((state) => state.notificationsInboxes);

    return (
        <div className="hidden sm:sticky sm:top-2 overflow-y-auto md:flex">
            <SideBar 
                className='flex justify-start flex-col'
                pathList={[
                    { name: 'Inbox', href: '/messages/inbox', icon: CiInboxIn, size: 25, notifications: notificationsInboxes },
                    { name: 'Social', href: '/messages/social', icon: IoEarthOutline, size: 25, notifications: 0 },
                    { name: 'My country', href: '/messages/my-country', icon: TbHomeLink, size: 25, notifications: 0 },
                ]}
            />
        </div>
    )
}