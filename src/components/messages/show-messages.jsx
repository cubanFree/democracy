'use client';

import { cn } from "@/lib/utils";
import Image from "next/image"
import { RiCloudOffLine } from "react-icons/ri";

export default function ShowMessages({ search, data, dataMessages, openMessage = () => {} }) {
    
    return (
        <>
            {
                data.map((item, index) => {
                    return (
                        <div 
                            key={index}
                            className={cn(
                                "w-full border-b sm:border-gray-700 hover:bg-zinc-800 p-2 flex flex-col gap-2",
                                item.user_name.includes(search) ? 'visible' : 'hidden'
                            )}
                            onClick={() => openMessage([{ avatar_url: item.avatar_url, user_name: item.user_name, content: item.content, topic: item.topic, date: item.date }])}
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
                                                dataMessages ? 'hidden md:flex' : ''
                                            )}
                                            >
                                                <div className="w-full flex justify-between">
                                                    <span className="text-md font-semibold">{item.user_name}</span>
                                                    <span className="text-sm text-gray-400">{item.date}</span>
                                                </div>
                                                <span className="text-sm "><span className="text-yellow-700">Topic: </span><span className="text-gray-400">{item.topic}</span></span>
                                        </div>
                                </div>

                                <span 
                                    className={cn(
                                        "w-full text-md text-gray-400 truncate",
                                        dataMessages ? 'hidden md:flex' : 'visible'
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
                search && (
                    <div className="flex flex-col justify-center items-center">
                        <RiCloudOffLine className="text-gray-600 animate-pulse" size={40} />
                        <span className="text-gray-500">No se encontraron resultados</span>
                    </div>
                )
            }
        </>
    )
}