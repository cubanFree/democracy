'use client';

import { MdOutlineClear, MdOutlineDelete } from "react-icons/md";
import { BiMessageSquareX } from "react-icons/bi";
import Image from 'next/image'
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ContentMessage({ data, onOpen = () => {} }) {

    return (
        <>
            {/* Opciones de la caja de mensaje */}
            <div className="w-full h-10 flex items-center justify-between border-b border-gray-700 sm:pb-0">
                { data.length > 0 && <MdOutlineDelete size={20} /> }
                <MdOutlineClear className="cursor-pointer" size={20} onClick={() => onOpen([])}/>
            </div>

            {/* Formulario de la caja de mensaje */}
            {
                data.length > 0 ? (
                    <div className="w-full h-full grid grid-rows-[1fr_8fr_1fr] grid-cols-1 pb-10">

                        {/* Header */}
                        <div className="w-full flex items-center gap-4 p-2">
                            <Image 
                                src={data[0].avatar_url || '/avatar_default.jpg'}
                                alt="avatar message"
                                width={500}
                                height={500}
                                priority
                                className="object-cover w-11 h-11 rounded-xl"
                            />
                            <div className="w-full flex flex-col justify-start gap-1">
                                <div className="flex justify-between gap-1">
                                    <span className="text-md font-semibold">{data[0].user_name}</span>
                                    <span className="text-sm text-gray-400">{data[0].date}</span>
                                </div>
                                <span className="text-sm "><span className="text-yellow-700">Topic: </span><span className="text-gray-400 font-semibold">{data[0].topic}</span></span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-grow w-full border-y border-gray-600 p-2 overflow-y-auto scroll-custom">
                            <span>{data[0].content}</span>
                        </div>

                        {/* Footer */}
                        <div className="w-full p-2">
                            <form
                                className="w-full h-full flex flex-col justify-center gap-2"
                                >
                                    <Input
                                        name="message_send"
                                        className="w-full text-sm bg-origin border border-gray-600 rounded-lg p-2 focus-visible:outline-none"
                                        type="text"
                                        placeholder="write a message..."
                                        autoComplete="off"
                                        required
                                    />
                                    <div className="w-full flex items-center justify-between">
                                        <span className="text-gray-500">Attachments</span>
                                        <Button
                                            className="border border-gray-600 rounded-lg"
                                            type="submit"
                                        >
                                            Send
                                        </Button>
                                    </div>
                            </form>
                        </div>

                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <BiMessageSquareX className="text-gray-600 animate-pulse" size={40} />
                        <span className="text-gray-500">Not data message</span>
                    </div>
                )
            }
        </>
    )
}