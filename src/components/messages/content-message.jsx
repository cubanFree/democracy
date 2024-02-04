'use client';

import { MdOutlineClear, MdOutlineDelete } from "react-icons/md";
import { BiMessageSquareX } from "react-icons/bi";
import Image from 'next/image'
import { Button } from "../ui/button";

export default function ContentMessage({ dataMessages, setDataMessages = () => {} }) {

    return (
        <>
            <div className="w-full h-7 flex items-center justify-between p-2">
                <MdOutlineDelete size={20}/>
                <MdOutlineClear className="cursor-pointer" size={20} onClick={() => setDataMessages(null)}/>
            </div>

            <div className="w-full border-b border-gray-600" />

            {/* En caso de que exista data o no */}
            {
                dataMessages ? (
                    <div className="w-full h-full grid grid-rows-[1fr_8fr_2fr] pb-5">
                        <div className="w-full flex items-center gap-4 p-2">
                            <Image 
                                src={dataMessages[0].avatar_url || '/avatar_default.jpg'}
                                alt="avatar message"
                                width={500}
                                height={500}
                                priority
                                className="object-cover w-11 h-11 rounded-xl"
                            />
                            <div className="w-full flex flex-col justify-start gap-1">
                                <div className="flex justify-between gap-1">
                                    <span className="text-md font-semibold">{dataMessages[0].user_name}</span>
                                    <span className="text-sm text-gray-400">{dataMessages[0].date}</span>
                                </div>
                                <span className="text-sm "><span className="text-yellow-700">Topic: </span><span className="text-gray-400 font-semibold">{dataMessages[0].topic}</span></span>
                            </div>
                        </div>

                        <div className="flex-grow w-full border-y border-gray-600 p-2 overflow-y-auto scroll-custom">
                            <span>{dataMessages[0].content}</span>
                        </div>

                        <div className="w-full p-2">
                            <form
                                className="w-full flex flex-col gap-2"
                                >
                                    <input
                                        name="message_send"
                                        className="w-full text-sm bg-origin border border-gray-600 rounded-lg p-2 focus-visible:outline-none"
                                        type="text"
                                        placeholder="write a message..."
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
                    <div className="w-full h-full">
                        <BiMessageSquareX className="text-gray-600 animate-pulse" size={30} />
                        <span className="text-gray-500">Not data message</span>
                    </div>
                )
            }
        </>
    )
}