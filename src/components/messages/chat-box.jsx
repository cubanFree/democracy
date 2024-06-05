'use client';

import React, { useEffect, memo } from "react";
import Image from 'next/image';
import moment from "moment";

import { MdOutlineClear, MdOutlineDelete } from "react-icons/md";
import { BiMessageSquareX } from "react-icons/bi";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { scrollDown } from "../general/scroll-down";
import { toast } from "sonner";
import { create_message } from "@/lib/action";
import { FiLoader } from "react-icons/fi";
import { useMessages } from "@/hooks/useGlobal";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import BtnSendForm from "./btnSendForm";
import { TbPointFilled } from "react-icons/tb";
import { SkProfileInbox } from "../skeleton/sk-profile";
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
                            message.user_id === idHost ? "bg-emerald-900 border border-emerald-900 shadow-lg" : "bg-gray-700 border border-gray-800 shadow-lg"
                        )}
                    >
                        <span className="w-full">{message.user_id != idHost && message.user_name}</span>
                        <span className="w-full">{message.content}</span>
                        <span className="w-full text-end text-sm text-gray-400">{date}</span>
                    </div>
                ) : (
                    <span
                        className={cn(
                            "py-1 px-2 rounded-md max-w-[75%] flex flex-col text-gray-200 text-sm",
                            message.user_id === idHost ? "bg-emerald-900 border border-emerald-900 shadow-lg" : "bg-gray-700 border border-gray-800 shadow-lg"
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
    const dataMessages = useMessages((state) => state.dataMessages);
    const isLoadingMessages = useMessages((state) => state.isLoadingMessages);

    // SET
    const setInboxOpen = useMessages((state) => state.setInboxOpen);
    const setDataMessages = useMessages((state) => state.setDataMessages);

    // OTHER STATES
    const [inputValue, setInputValue] = React.useState('');
    const bodyScrollRef = React.useRef(null);
    const inputRef = React.useRef(null);

    // ESCUCHANDO REALTIME MENSAJES ENVIADOS EN EL INBOX CORRESPONDIENTE
    useEffect(() => {
        const channel = supabase.channel('realtime-messages')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' }, 
                (payload) => {
                    // El mensaje capturado si pertenece al inbox correspondiente se guarda en el estado de los mensajes, para todos los participantes del Inbox
                    if (inboxOpen?.inbox_id === payload.new.inbox_id) {
                        setDataMessages({value: {action: 'POST', item: payload.new}});
                    }
                }
            )
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'messages' },
                (payload) => {
                    // En caso de que capture un mensaje modificado, evalue si es igual al idHost, para cambiar el estado de isRead del mismo
                    if (payload.new.user_id === idHost) {
                        setDataMessages({value: {action: 'UPDATE', item: payload.new}});
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [supabase, inboxOpen?.inbox_id, idHost]);

    // ESTADO PARA HACER SCROLL HASTA EL FINAL SI HAY MENSAJES
    useEffect(() => {
        if (dataMessages?.length) {
            scrollDown({ ref: bodyScrollRef });
        }
    }, [dataMessages]);

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
                { dataMessages?.length > 0 && <MdOutlineDelete size={20} /> }
                <MdOutlineClear className="cursor-pointer" size={20} onClick={() => setInboxOpen(null)}/>
            </div>

            {/* Avatar y datos */}
            {
                isLoadingMessages ? (
                    <SkProfileInbox />
                ):(
                    <div className="w-full flex items-center gap-5 p-2">
                        {inboxOpen?.is_group && !inboxOpen?.avatar ? (
                            <div className="flex -space-x-5 mr-2">
                                {inboxOpen.contacts.map((contact) => (
                                    <Image
                                        key={contact.user_id}
                                        src={contact.avatar_url || '/avatar_default.jpg'}
                                        alt="avatar contact"
                                        width={500}
                                        height={500}
                                        priority
                                        className="object-cover w-8 h-8 rounded-full"
                                    />
                                ))}
                            </div>
                        ) : (
                            <Image
                                src={inboxOpen?.avatar || '/avatar_default.jpg'}
                                alt="avatar message"
                                width={500}
                                height={500}
                                priority
                                className="object-cover w-11 h-11 rounded-xl"
                            />
                        )}
                         <div className="w-full flex justify-between items-start gap-1">
                            <div className="flex flex-col justify-between truncate">
                                <span className="text-lg truncate">
                                    {inboxOpen?.is_group && !inboxOpen?.chat_name ? (
                                         `You, ${inboxOpen.contacts.filter(contact => contact.user_id !== idHost).map(contact => contact.user_name).join(', ')}`
                                    ) : (
                                        inboxOpen?.chat_name
                                    )}
                                </span>
                                <div className="flex justify-start items-center gap-1 text-sm text-gray-400">
                                    {
                                        (inboxOpen?.status === 'online') ? (
                                            <>
                                            <TbPointFilled className="text-green-500" />
                                            <span>online</span>
                                            </>
                                        ) : (inboxOpen?.status === 'offline') ? (
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
                            <span className="inline-block text-sm text-gray-400 text-end">
                                {inboxOpen?.lastMessage_time}
                            </span>
                        </div>
                    </div>
                )
            }

            {/* Body de la caja de mensaje */}
            <div className="flex-grow w-full h-full border-y border-gray-600 p-2 overflow-y-auto scroll-custom bg-neutral-900">
                {
                    isLoadingMessages ? (
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <FiLoader className="text-gray-500 animate-spin" size={30} />
                        </div>
                    ) : (
                        dataMessages?.length ? (
                            <div className="w-full flex flex-col gap-2">
                                {
                                    dataMessages.map((item) => {
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
                        className="w-full border-0 p-2 h-auto bg-zinc-800"
                        type="text"
                        placeholder={"reply to " + (inboxOpen?.chat_name || "group/chat") + "..."}
                        autoComplete="off"
                        ref={inputRef}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                    />

                    <BtnSendForm text={'Send'} className={"rounded-lg md:self-end"} isDisabled={!inputValue} />
                </form>
            </div>
            {/* <BtnScrollDown bodyScrollRef={bodyScrollRef} /> */}
        </div>
    )
}