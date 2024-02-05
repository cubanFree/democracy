'use client';

import { cn } from "@/lib/utils";
import Image from "next/image"
import { RiCloudOffLine } from "react-icons/ri";

export default function ShowMessages({ data, onOpen = () => {} }) {
    
    return (
        <>
            {
                data.map((item, index) => {
                    return (
                        <div 
                            key={index}
                            className={cn(
                                "w-full border-b border-gray-700 hover:bg-zinc-800 px-2 py-4 flex flex-col gap-2"
                            )}
                            onClick={() => onOpen([{ avatar_url: item.avatar_url, user_name: item.user_name, content: item.content, topic: item.topic, date: item.date }])}
                            >
                                <div 
                                    className={cn(
                                        "w-full flex gap-4 justify-center md:justify-start"
                                    )}
                                    >
                                        <Image 
                                            src={item.avatar_url || '/avatar_default.jpg'}
                                            alt="avatar message"
                                            width={500}
                                            height={500}
                                            priority
                                            className='object-cover w-11 h-11 rounded-xl'
                                        />

                                        <div 
                                            className={cn(
                                                "w-full flex flex-col justify-between",
                                            )}
                                            >
                                                <div className="w-full flex justify-between">
                                                    <span className="text-md">{item.user_name}</span>
                                                    <span className="text-sm text-gray-400">{item.date}</span>
                                                </div>
                                                <span className="text-sm "><span className="text-yellow-700">Topic: </span><span className="text-gray-400">{item.topic}</span></span>
                                        </div>
                                </div>

                                <span 
                                    className={cn(
                                        "w-full text-sm text-gray-400 truncate",
                                    )}
                                    >
                                        {item.content}
                                </span>
                        </div>
                    )
                })
            }

            {/* En caso de que no se encuentren resultados */}
            {
                data.length === 0 && (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <RiCloudOffLine className="text-gray-600 animate-pulse" size={40} />
                        <span className="text-gray-500">No se encontraron resultados</span>
                    </div>
                )
            }
        </>
    )
}