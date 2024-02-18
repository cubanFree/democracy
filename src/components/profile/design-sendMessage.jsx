'use client';

import { LiaTelegram } from "react-icons/lia";
import { Button } from "../ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Input } from "../ui/input";
import React from "react";
import { create_inbox } from "@/lib/action";
import { IoReloadCircleOutline } from "react-icons/io5";
import { toast } from "sonner"

export default function DesignSendMessage({ idHost, idTarget, user_name }) {

    const inputRef = React.useRef(null)
    const [loading, setLoading] = React.useState(false)
    
    // function para enviar el mensaje dado
    const sendMessage = async (formData) => {
        setLoading(true)
        const { error } = await create_inbox({user_id1: idHost, user_id2: idTarget, content_text: {user_id: idHost, message: formData.get('content_text')}});
        setLoading(false)
        if (error) return toast.error('Message could not be sent');

        inputRef.current.value = '';
        return toast.success('Message sent');
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="default" className="w-full flex justify-center items-center gap-2">
                    <LiaTelegram size={20} />
                    <span className="font-bold">Message</span>
                </Button>
            </DrawerTrigger>

            <DrawerContent className="bg-origin border border-stone-800">
                <form 
                    action={sendMessage}
                    className="mx-auto w-full max-w-sm"
                    >
                        <DrawerHeader>
                            <DrawerTitle>Send message to {user_name}</DrawerTitle>
                            <DrawerDescription>Please, respect the community policies</DrawerDescription>
                        </DrawerHeader>

                        <div className="p-4 pb-0">
                            <Input
                                name="content_text"
                                type="text"
                                ref={inputRef}
                                placeholder="Enter message"
                                className="w-full"
                                required
                                autoComplete="off"
                            />
                        </div>

                        <DrawerFooter>
                            <Button
                                type="submit"
                                variant="default"
                                className="w-full dark"
                                disabled={loading}
                                >
                                    {
                                        loading ? (
                                            <>
                                                <IoReloadCircleOutline className="mr-2 h-4 w-4 animate-spin" />
                                                <span>Please wait</span>
                                            </>
                                        ) : (
                                            <span>Submit</span>
                                        )
                                    }
                            </Button>
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
    )
}