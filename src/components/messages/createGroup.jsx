'use client';

import React from "react";
import Image from "next/image";

import { MdOutlineClear } from "react-icons/md";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import BtnSendForm from "./btnSendForm";
import { useCreateGroup } from "@/hooks/useGlobal";
import { cn } from "@/lib/utils";

export default function CreateGroup() {

    // GET
    const members = useCreateGroup(state => state.members)

    // SET

    const [avatar, setAvatar] = React.useState('/avatar_default.jpg')
    
    // ESTADO DE VISIBILIDAD DEL AVATAR
    const handlingFileChange = (event) => {
        const file = event.target.files[0]

        // revocar la url cuando avatar => true y el evento contenga un objeto file
        if (avatar && file) URL.revokeObjectURL(avatar)
        
        // crea la nueva url y actualiza el estado si el objeto file existe
        if (file) setAvatar( URL.createObjectURL(file) )
    }

    return (
        <main className="flex justify-center items-center p-2 pl-0">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Drawer>
                            <DrawerTrigger asChild>
                                <MdOutlineClear size={20} className="rotate-45 text-blue-400 " />
                            </DrawerTrigger>

                            <DrawerContent className="bg-origin border border-stone-800">
                                <form 
                                    action=""
                                    className="mx-auto w-full max-w-sm"
                                    >
                                        <DrawerHeader>
                                            <DrawerTitle>Create a new group</DrawerTitle>
                                            <DrawerDescription>You can only add a max 3 members to the group.</DrawerDescription>
                                        </DrawerHeader>

                                        <div className="p-4 flex gap-8">
                                            <label className="flex flex-col justify-center gap-2 items-center cursor-pointer">
                                                <Image 
                                                    src={avatar}
                                                    alt="Avatar Group"
                                                    width={100}
                                                    height={100}
                                                    className="rounded-xl object-cover w-20 h-20"
                                                />
                                                <input
                                                    disabled={false}
                                                    name="avatar"
                                                    type="file"
                                                    onChange={handlingFileChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                <span className="text-sm text-gray-500">Choose an image</span>
                                            </label>

                                            <div className="grid grid-cols-3 gap-2">
                                                {
                                                    members?.length ? (
                                                        members?.map((member) => (
                                                            <article 
                                                                key={member.id}
                                                            >
                                                                <Image
                                                                    src={member.avatar}
                                                                    alt="Avatar Member"
                                                                    width={100}
                                                                    height={100}
                                                                    className="rounded-xl object-cover w-10 h-10"
                                                                />
                                                            </article>
                                                        ))
                                                    ) : null
                                                }
                                                <article 
                                                    className={cn(
                                                        members?.length < 3 ? "visible" : "hidden"
                                                    )}
                                                >
                                                    <span
                                                        className="rounded-xl border border-sky-600 text-sm font-bold text-sky-600 w-10 h-10 flex items-center justify-center cursor-pointer hover:border-sky-500 hover:text-sky-500"
                                                    >
                                                        + {members?.length + 1}
                                                    </span>
                                                </article>
                                            </div>
                                        </div>

                                        <DrawerFooter>
                                            <BtnSendForm text="Create" className={"w-full dark"} />
                                            <DrawerClose asChild>
                                                <Button 
                                                    variant="outline"
                                                    className="w-full bg-transparent dark"
                                                    >
                                                        Cancel
                                                </Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                </form>
                            </DrawerContent>

                        </Drawer>
                    </TooltipTrigger>

                    <TooltipContent className="bg-gray-100 text-black py-1 px-2">
                        <span className="text-sm">new group</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </main>
    )
}