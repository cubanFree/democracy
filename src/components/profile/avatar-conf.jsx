'use client';

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Image from "next/image";

export default function AvatarConf({ avatar_url, status}) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Image 
                    src={avatar_url || '/avatar_default.jpg'}
                    alt="avatar profile"
                    width={500}
                    height={500}
                    priority
                    className={cn("object-cover w-16 h-16 rounded-xl sticky top-2 lg:sticky lg:top-auto lg:rounded-3xl lg:w-28 lg:h-28 lg:mx-auto cursor-pointer", 
                        status === 'online' ? 'border-4 border-transparent ring-2 ring-green-700' : status === 'offline' ? 'border-4 border-transparent ring-2 ring-red-900' : 'border-4 border-transparent ring-2 ring-gray-500'
                    )}
                />
            </DialogTrigger>
            <DialogContent className="w-96 h-96 p-0 bg-transparent border-0 dark">
                <Image 
                    src={avatar_url || '/avatar_default.jpg'}
                    alt="avatar profile"
                    width={1000}
                    height={1000}
                    priority
                    className="object-cover w-full h-full rounded-2xl"
                />
            </DialogContent>
        </Dialog>
    )
}