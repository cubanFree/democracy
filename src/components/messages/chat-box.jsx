'use client';

import React, { useEffect, useRef, useState, memo } from "react";
import Image from 'next/image';
import moment from "moment";

import { MdOutlineClear, MdOutlineDelete } from "react-icons/md";
import { BiMessageSquareX } from "react-icons/bi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { scrollDown } from "../general/scroll-down";
import { fetchMessages, fetchProfileData } from "@/lib/data";
import { toast } from "sonner";
import { create_message } from "@/lib/action";
import { FiLoader } from "react-icons/fi";
import { useMessages } from "@/hooks/useGlobal";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import BtnSendMessage from "./btnSendMessage";
import { TbPointFilled } from "react-icons/tb";
// import BtnScrollDown from "./btn-scrollDown";

const Message = memo(({ message, date, bodyScrollRef, idHost }) => {
    return (
        <article
            ref={bodyScrollRef}
            className={cn(
                `w-full flex`,
                message.user_id === idHost ? "justify-end" : "justify-start"
            )}
        >

            {
                message.is_group ? (
                    <div
                        className={cn(
                            "py-1 px-2 rounded-md max-w-[75%] flex flex-col gap-1 text-gray-200 text-sm",
                            message.user_id === idHost ? "bg-emerald-900 border border-emerald-950 shadow-lg" : "bg-gray-700 border border-gray-900 shadow-lg"
                        )}
                    >
                        <span className="w-full">{message.content}</span>
                        <span className="w-full text-end text-sm text-gray-400">{date}</span>
                    </div>
                ) : (
                    <span
                        className={cn(
                            "py-1 px-2 rounded-md max-w-[75%] flex flex-col text-gray-200 text-sm",
                            message.user_id === idHost ? "bg-emerald-900 border border-emerald-950 shadow-lg" : "bg-gray-700 border border-gray-900 shadow-lg"
                        )}
                    >
                        <span className="w-full">{message.content}</span>
                        <div className="w-full justify-end flex gap-1 items-center">
                            <span className='text-[0.7rem] text-gray-400'>{date}</span>
                            {
                                message.user_id === idHost && (
                                    message.isRead ? (
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
                    message.role === "host" ? "bg-gray-800" : "bg-cyan-700"
                )}
                style={{ alignSelf: message.role === "host" ? 'end' : 'start' }}
                >
                    <span 
                        className={cn(
                            "w-full text-sm font-bold",
                        )}
                        >
                            {message.role === "host" ? "You" : message.user_name}
                    </span>
                    <span
                        className="w-full rounded-md bg-slate-600 p-1"
                        >
                            {message.message}
                    </span>
            </div> */}
        </article>
    );
  }, (prevProps, nextProps) => {
    return prevProps.message.id === nextProps.message.id &&
           prevProps.message.isRead === nextProps.message.isRead &&
           prevProps.message.content === nextProps.message.content
});
Message.displayName = "Message";

export default function ChatBox({ idHost, supabase }) {

    // GET
    const inboxOpen = useMessages((state) => state.inboxOpen);

    // SET
    const setInboxOpen = useMessages((state) => state.setInboxOpen);

    // OTHER STATES
    const bodyScrollRef = useRef(null);
    const inputRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [user_active, setUser_active] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(true);

    console.log(user_active)

    // OBTENER TODOS LOS MENSAJES DEL INBOX CORRESPONDIENTE
    useEffect(() => {
        if (!inboxOpen?.inbox_id) return;

        const getMessages = async () => {
            const { data: content_messages } = await fetchMessages(inboxOpen?.inbox_id);
            const { data: isActive, error } = await fetchProfileData({ filter: { id: inboxOpen?.contacts[0].user_id }, table: 'users', caseBox: ['status'] });
            setMessages(content_messages);
            setUser_active(isActive.status);
            setLoadingMessages(false);
        }
        getMessages();

    }, [inboxOpen]);

    // ESCUCHANDO REALTIME MENSAJES ENVIADOS EN EL INBOX CORRESPONDIENTE
    useEffect(() => {
        const channel = supabase.channel('realtime-messages')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' }, 
                (payload) => {
                    // El mensaje capturado si pertenece al inbox correspondiente se guarda en el estado de los mensajes, para todos los participantes del Inbox
                    if (inboxOpen?.inbox_id === payload.new.inbox_id) {
                        setMessages((prevMessages) => {
                            // Verifica si el mensaje ya existe para evitar duplicados
                            const messageExists = prevMessages.some((m) => m.id === payload.new.id);
                            if (!messageExists) {
                                return [...prevMessages, payload.new];
                            }
                            return prevMessages;
                        });
                    }
                }
            )
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'messages' },
                (payload) => {
                    // En caso de que capture un mensaje modificado, evalue si es igual al idHost, para cambiar el estado de isRead del mismo
                    if (payload.new.user_id === idHost) {
                        setMessages((prevMessages) => {
                            const messageIndex = prevMessages.findIndex((m) => m.id === payload.new.id);
                            if (messageIndex !== -1) {
                                const updatedMessages = [...prevMessages];
                                updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], ...payload.new };
                                return updatedMessages;
                            }
                            return prevMessages;
                        });
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [supabase, inboxOpen?.inbox_id, idHost]);

    // ESTADO PARA HACER SCROLL HASTA EL FINAL SI HAY MENSAJES
    useEffect(() => {
        if (messages?.length) {
            scrollDown({ ref: bodyScrollRef });
        }
    }, [messages]);

    // FUNCION PARA EL ENVIO DEL MENSAJE REDACTADO
    const sendMessage = async (formData) => {
        try {
            if (!inboxOpen?.inbox_id || formData.get('content_text') === '') throw new Error('Inbox_id or Content not found');
            const { rejected, error } = await create_message(inboxOpen?.inbox_id, {user_id: idHost, message: formData.get('content_text')}, inboxOpen.contacts.map((c) => c.user_id) || []);

            if (error || rejected) throw new Error(error);

        } catch (error) {
            toast.error(error.message);
        }

        inputRef.current.value = '';
    }

    return (
        <div className="w-full h-full grid grid-rows-[1fr_1fr_15fr_1fr] grid-cols-1 relative">
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
                    <div className="flex flex-col justify-between">
                        <span className="text-lg">{inboxOpen?.chat_name}</span>
                        <div className="flex justify-start items-center gap-1 text-sm text-gray-400">
                            {
                                user_active === 'online' ? (
                                        <>
                                        <TbPointFilled className="text-green-500" />
                                        <span>online</span>
                                        </>
                                ) : user_active === 'offline' ? (
                                    <>
                                    <TbPointFilled className="text-red-500" />
                                    <span>offline</span>
                                    </>
                                ) : (
                                    <>
                                    <TbPointFilled className="text-gray-500" />
                                    <span>N/A</span>
                                    </>
                                )
                            }
                        </div>
                    </div>
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
                        messages?.length ? (
                            <div className="w-full flex flex-col gap-2">
                                {
                                    messages.map((item) => {
                                        const date = moment(item.created_at).format('hh:mm A')
                                        return (
                                            <Message
                                                key={item.id}
                                                message={item}
                                                date={date}
                                                bodyScrollRef={bodyScrollRef}
                                                idHost={idHost}
                                            />
                                        )
                                    })
                                }
                                
                            </div>
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

                    <BtnSendMessage />
                </form>
            </div>
            {/* <BtnScrollDown bodyScrollRef={bodyScrollRef} /> */}
        </div>
    )
}