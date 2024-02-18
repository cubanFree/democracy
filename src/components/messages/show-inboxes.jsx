'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RiCloudOffLine } from "react-icons/ri";
import { TbPointFilled } from "react-icons/tb";
import moment from "moment";

export default function ShowInboxes({ idHost, data, supabase, onOpen = () => {} }) {

    const [unreadInboxes, setUnreadInboxes] = useState([]);

    console.log('newMessages ->>> ', unreadInboxes);

    useEffect(() => {
        const channel = supabase.channel('realtime-inbox').on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'messages' }, 
            (payload) => {
                if (payload.new.user_id !== idHost) {
                    setUnreadInboxes((prev) => [...prev, payload.new.inbox_id]);
                }
            }
        ).subscribe();

        return () => supabase.removeChannel(channel);
    }, [supabase, idHost]);

    return data.length === 0 ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <RiCloudOffLine className="text-gray-600 animate-pulse" size={40} />
            <span className="text-gray-500">No results found</span>
        </div>
    ) : (
        data.map((item) => {
            const date = moment(item.lastMessage_time).format('hh:mm:ss A');
            return (
                <div 
                    key={item.inbox_id}
                    className="w-full border-b border-gray-700 hover:bg-zinc-800 px-2 py-4 flex flex-col gap-2"
                    onClick={() => {
                        onOpen([
                            { 
                                inbox_id: item.inbox_id,
                                avatar: item.avatar_group || item.contacts[0].avatar_url,
                                chat_name: item.title_inbox || item.contacts[0].user_name,
                                is_group: item.is_group,
                                contacts: item.contacts,
                                lastMessage_time: date
                            }]);
                        setUnreadInboxes(unreadInboxes.filter(id => id !== item.inbox_id));
                    }}
                >
                    <div className="w-full flex gap-4 items-center justify-start">
                        <Image 
                            src={item.is_group ? item.avatar_group : item.contacts[0].avatar_url || '/avatar_default.jpg'}
                            alt="avatar message"
                            width={44}
                            height={44}
                            priority
                            className='object-cover rounded-xl'
                        />
                        <div className="w-full flex flex-col justify-between gap-1 truncate">
                            <div className="w-full flex justify-between">
                                <span className="text-lg">{!item.is_group ? item.contacts[0].user_name : item.title_inbox}</span>
                                <span className="text-sm text-gray-400">{date}</span>
                            </div>
                            <div className="w-full flex justify-between text-sm text-gray-400 truncate">
                                <span>{item.lastMessage_content}</span>
                                { unreadInboxes.includes(item.inbox_id) && <TbPointFilled className="text-blue-800" />}
                            </div>
                        </div>
                    </div>
                </div>
            );
        })
    );
}