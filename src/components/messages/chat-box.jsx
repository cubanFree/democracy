'use client';

import { useEffect, useRef } from "react";
import { MdOutlineClear, MdOutlineDelete } from "react-icons/md";
import { BiMessageSquareX } from "react-icons/bi";
import Image from 'next/image'
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { scrollDown } from "../general/scroll-down";
import React from "react";
import { fetchMessages } from "@/lib/data";
import moment from "moment";
import { toast } from "sonner";
import { create_message } from "@/lib/action";
import { FiLoader } from "react-icons/fi";
import { useMessages } from "@/hooks/useGlobal";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
// import BtnScrollDown from "./btn-scrollDown";

export default function ChatBox({ idHost, supabase }) {

    // GET
    const inboxOpen = useMessages((state) => state.inboxOpen);
    const dataInboxes = useMessages((state) => state.dataInboxes);

    // SET
    const setInboxOpen = useMessages((state) => state.setInboxOpen);
    const setDataInboxes = useMessages((state) => state.setDataInboxes);

    // OTHER STATES
    const bodyScrollRef = useRef(null);
    const inputRef = useRef(null);

    const [messages, setMessages] = React.useState([]);
    const [loadingMessages, setLoadingMessages] = React.useState(true);
    const [loadingSendMessage, setLoadingSendMessage] = React.useState(false);

    // estado para obtener los mensajes
    useEffect(() => {
        if (!inboxOpen?.inbox_id) return;

        const getMessages = async () => {
            const { data: content_messages } = await fetchMessages(inboxOpen?.inbox_id);
            setMessages(content_messages);
            setLoadingMessages(false);
        }
        getMessages();

    }, [inboxOpen]);

    // escuchando nuevos mensajes Realtime
    useEffect(() => {
        const channel = supabase.channel('realtime-messages')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' }, 
                (payload) => {
                    // cuando enviamos un nuevo mensaje, cambiamos el estado del inbox con el nuevo mensaje
                    inboxOpen?.inbox_id === payload.new.inbox_id && setMessages((prev) => [...prev, payload.new]);
                }
            )
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'messages' },
                (payload) => {
                    // escuchando actualizaciones si se ha leido el mensaje
                    if (payload.new.user_id === idHost) {
                        // cambiar el estado de isRead
                        const index = messages.findIndex((m) => m.id === payload.new.id);
                        if (index !== -1) {
                            messages[index] = payload.new;
                            setMessages([...messages]);
                        }
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [messages]);

    // estado para hacer scroll automatico
    useEffect(() => {
        if (messages?.length) {
            scrollDown({ ref: bodyScrollRef });
        }
    }, [messages]);

    // estado para enviar un nuevo mensaje
    const sendMessage = async (formData) => {
        setLoadingSendMessage(true);
        try {
            if (!inboxOpen?.inbox_id || formData.get('content_text') === '') throw new Error('Inbox_id or Content not found');
            const { rejected, error } = await create_message(inboxOpen?.inbox_id, {user_id: idHost, message: formData.get('content_text')}, inboxOpen.contacts.map((c) => c.user_id) || []);

            if (error || rejected) throw new Error(error);

        } catch (error) {
            setLoadingSendMessage(false);
            toast.error(error.message);
        }

        inputRef.current.value = '';
        setLoadingSendMessage(false);
    }

    return (
        <div className="w-full h-full grid grid-rows-[1fr_1fr_15fr_2fr] grid-cols-1 relative">
            {/* Opciones de la caja de mensaje */}
            <div className="w-full h-full flex items-center justify-between border-b-2 border-gray-500 p-2">
                { messages?.length > 0 && <MdOutlineDelete size={20} /> }
                <MdOutlineClear className="cursor-pointer" size={20} onClick={() => setInboxOpen(null)}/>
            </div>

            {/* Avatar y datos */}
            <div className="w-full flex items-start gap-4 p-2">
                <Image 
                    src={inboxOpen?.avatar || '/avatar_default.jpg'}
                    alt="avatar message"
                    width={500}
                    height={500}
                    priority
                    className="object-cover w-11 h-11 rounded-xl"
                />
                <div className="w-full flex justify-between items-center gap-1">
                    <span className="text-lg">{inboxOpen?.chat_name}</span>
                    <span className="text-sm text-gray-400">{inboxOpen?.lastMessage_time}</span>
                </div>
            </div>

            {/* Body de la caja de mensaje */}
            <div className="flex-grow w-full h-full border-y border-gray-600 p-2 overflow-y-auto scroll-custom">
                {

                    loadingMessages ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <FiLoader className="text-gray-500 animate-spin" size={30} />
                        </div>
                    ) : (
                        messages?.length > 0 ? (
                            <article className="w-full flex flex-col gap-2">
                                {
                                    messages.map((item) => {
                                        const date = moment(item.created_at).format('hh:mm A')
                                        return (
                                            <div
                                                key={item.id}
                                                ref={bodyScrollRef}
                                                className={cn(
                                                    `w-full flex`,
                                                    item.user_id === idHost ? "justify-end" : "justify-start"
                                                )}
                                                >
    
                                                    {
                                                        item.is_group ? (
                                                            <span
                                                                className={cn(
                                                                    "py-1 px-2 rounded-md max-w-[75%] flex flex-col gap-1 text-gray-200 text-sm",
                                                                    item.user_id === idHost ? "bg-emerald-900 border border-emerald-950 shadow-lg" : "bg-gray-700 border border-gray-900 shadow-lg"
                                                                )}
                                                                >
                                                                    <span className="w-full">{item.content}</span>
                                                                    <span
                                                                        className="w-full text-end text-sm text-gray-400"
                                                                        >
                                                                            {date}
                                                                    </span>
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className={cn(
                                                                    "py-1 px-2 rounded-md max-w-[75%] flex flex-col text-gray-200 text-sm",
                                                                    item.user_id === idHost ? "bg-emerald-900 border border-emerald-950 shadow-lg" : "bg-gray-700 border border-gray-900 shadow-lg"
                                                                )}
                                                                >
                                                                    <span className="w-full">{item.content}</span>
                                                                    <div
                                                                        className="w-full justify-end flex gap-1 items-center"
                                                                        >
                                                                            <span className='text-[0.7rem] text-gray-400'>{date}</span>
                                                                            {
                                                                                item.user_id === idHost && (
                                                                                    item.isRead ? (
                                                                                        <IoCheckmarkDoneOutline size={15} className="text-emerald-500" />
                                                                                    ) : (
                                                                                        <IoCheckmarkOutline size={15} />
                                                                                    )
                                                                                )
                                                                            }
                                                                    </div>
                                                            </span>
                                                        )
                                                    }
    
                                                    {/* diseno para Reply un mensaje */}
                                                    {/* <div 
                                                        className={cn(
                                                            "p-1 rounded-md max-w-[49%] flex flex-col gap-1",
                                                            item.role === "host" ? "bg-gray-800" : "bg-cyan-700"
                                                        )}
                                                        style={{ alignSelf: item.role === "host" ? 'end' : 'start' }}
                                                        >
                                                            <span 
                                                                className={cn(
                                                                    "w-full text-sm font-bold",
                                                                )}
                                                                >
                                                                    {item.role === "host" ? "You" : item.user_name}
                                                            </span>
                                                            <span
                                                                className="w-full rounded-md bg-slate-600 p-1"
                                                                >
                                                                    {item.message}
                                                            </span>
                                                    </div> */}
                                            </div>
                                        )
                                    })
                                }
                                
                            </article>
                        ) : (
                            <div className="w-full h-full flex flex-col justify-center items-center">
                                <BiMessageSquareX className="text-gray-600 animate-pulse" size={40} />
                                <span className="text-gray-500">Not data message</span>
                            </div>
                        )
                    )
                }
            </div>

            {/* barra de envio de mensajes */}
            <div className="w-full p-2">
                <form
                    action={sendMessage}
                    className="w-full flex md:flex-col justify-center gap-2"
                    >
                        <Input
                            name="content_text"
                            className="w-full text-sm bg-origin border border-gray-600 rounded-lg p-2 h-10"
                            type="text"
                            placeholder={"reply to " + inboxOpen?.chat_name + "..."}
                            autoComplete="off"
                            ref={inputRef}
                            required
                        />

                        <Button
                            className="border border-gray-600 rounded-lg md:self-end"
                            type="submit"
                            disabled={loadingSendMessage}
                            >
                                Send
                        </Button>
                </form>
            </div>
            {/* <BtnScrollDown bodyScrollRef={bodyScrollRef} /> */}
        </div>
    )
}