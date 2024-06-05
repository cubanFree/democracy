'use client';

import React, { useEffect } from "react";
import Image from "next/image";
import { useDebouncedCallback } from 'use-debounce';

import { MdOutlineClear } from "react-icons/md";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import BtnSendForm from "./btnSendForm";
import { useCreateGroup } from "@/hooks/useGlobal";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { fetchProfileData } from "@/lib/data";
import { MdOutlineDelete } from "react-icons/md";
import { create_inbox } from "@/lib/action";

// ESTADO DE VISIBILIDAD DEL AVATAR y FORMATEO DEL AVATAR a base64 para poder enviarlo al backend
const handlingFileChange = (event, setAvatar, setFileBase64) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(URL.createObjectURL(file));
            setFileBase64(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

export default function CreateGroup({ idHost }) {

    // GET
    const members = useCreateGroup(state => state.members)

    // SET
    const setAddMember = useCreateGroup(state => state.setAddMember)
    const setRemoveMember = useCreateGroup(state => state.setRemoveMember)
    const setEmptyMembers = useCreateGroup(state => state.setEmptyMembers)

    // OTROS ESTADOS
    const [avatar, setAvatar] = React.useState(null)
    const [membersFound, setMembersFound] = React.useState([])
    const [fileBase64, setFileBase64] = React.useState(null);
    const [openFrame, setOpenFrame] = React.useState(false)
    const [openSearch, setOpenSearch] = React.useState(false)
    const inputNameRef = React.useRef(null)

    // ESCUCHANDO BUSQUEDA DE MIEMBROS
    const searchMember = useDebouncedCallback(async (search) => {
        const { data, error } = await fetchProfileData({ filter: { user_name: search }, table: 'users', caseBox: ['id', 'user_name', 'avatar_url'], limit: 3 })
        setMembersFound(data)
    }, 500)

    // CREAR GRUPO
    const handleSubmit = async (formData) => {
        if (!idHost) return;

        const groupName = formData.get('group_name');
        const file_avatar = formData.get('group_avatar');

        const { error } = await create_inbox({
            user_id1: idHost,
            user_id2: members[0]?.id || null,
            user_id3: members[1]?.id || null,
            user_id4: members[2]?.id || null,
            is_group: true,
            avatar_group: { file: fileBase64, type: file_avatar.type },
            title_inbox: groupName || null
        });

        if (!error) {
            inputNameRef.current.value = '';
            setEmptyMembers();
            setAvatar(null);
            setOpenFrame(false);
            setFileBase64(null);
        }
    }

    useEffect(() => {
        if (!openFrame) {
            setAvatar(null)
            setEmptyMembers()
            setMembersFound([])
            setFileBase64(null);
        }
        !openSearch && setMembersFound([])

    }, [openFrame, openSearch, setEmptyMembers, setMembersFound, setAvatar, setFileBase64])

    return (
        <main className="flex justify-center items-center p-2 pl-0">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Drawer open={openFrame} onOpenChange={setOpenFrame}>
                            <DrawerTrigger asChild>
                                <MdOutlineClear size={20} className="rotate-45 text-blue-400 " />
                            </DrawerTrigger>

                            <DrawerContent className="bg-origin border border-stone-800">
                                <form 
                                    action={handleSubmit}
                                    className="mx-auto w-full max-w-sm"
                                >
                                    <DrawerHeader>
                                        <DrawerTitle>Create a new group</DrawerTitle>
                                        <DrawerDescription>You can only add a max 3 members to the group.</DrawerDescription>
                                    </DrawerHeader>

                                    <div className="p-4 w-full grid grid-cols-[auto_1fr] gap-8">
                                        <label className="flex flex-col justify-center gap-2 items-center cursor-pointer">
                                            <Image 
                                                src={avatar || '/avatar_default.jpg'}
                                                alt="Avatar Group"
                                                width={100}
                                                height={100}
                                                className="rounded-xl object-cover w-20 h-20"
                                            />
                                            <input
                                                disabled={false}
                                                name="group_avatar"
                                                type="file"
                                                onChange={(event) => handlingFileChange(event, setAvatar, setFileBase64)}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <span className="text-sm text-gray-500">Group Image</span>
                                        </label>

                                        <div className="w-full grid grid-rows-2 items-center">
                                            <Input
                                                name="group_name"
                                                ref={inputNameRef}
                                                type="text"
                                                placeholder="Group Name"
                                                className="w-full"
                                                autoComplete="off"
                                            />
                                            <div className="w-full grid grid-cols-[auto_auto_auto] gap-4 items-center justify-start">
                                                {
                                                    members?.length ? (
                                                        members?.map((member) => (
                                                            <article 
                                                                key={member.id}
                                                                className="cursor-pointer w-full flex justify-center items-center relative"
                                                                onClick={() => setRemoveMember(member.id)}
                                                            >
                                                                <div className="relative group w-10 h-10">
                                                                    <Image
                                                                        src={member.avatar_url}
                                                                        alt="Avatar Member"
                                                                        width={100}
                                                                        height={100}
                                                                        className="rounded-xl object-cover w-full h-full group-hover:opacity-50"
                                                                    />
                                                                    <MdOutlineDelete 
                                                                        size={25} 
                                                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden group-hover:flex"
                                                                    />
                                                                </div>
                                                            </article>
                                                        ))
                                                    ) : null
                                                }
                                                
                                                <Popover open={openSearch} onOpenChange={setOpenSearch}>
                                                    <PopoverTrigger asChild>
                                                        <article 
                                                            className={cn(
                                                                members?.length < 3 ? "visible w-full flex items-center justify-center" : "hidden"
                                                            )}
                                                        >
                                                            <span
                                                                className="rounded-xl border border-sky-600 text-md font-bold text-sky-600 w-10 h-10 flex items-center justify-center cursor-pointer hover:border-sky-500 hover:text-sky-500"
                                                            >
                                                                + {members?.length + 1}
                                                            </span>
                                                        </article>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="bg-zinc-800 p-0 border-0 text-gray-300 flex flex-col">
                                                        <Input 
                                                            type="text"
                                                            placeholder="search member..."
                                                            onChange={(e) => searchMember(e.target.value)}
                                                            className="w-full border-0 p-2 h-auto bg-transparent"
                                                            autoComplete="off"
                                                        />
                                                        {
                                                            membersFound?.length ? (
                                                                membersFound?.map((member) => (
                                                                    <article
                                                                        key={member.id}
                                                                        className="w-full flex justify-start items-center gap-4 p-2 hover:bg-zinc-700 cursor-pointer border-t border-zinc-600"
                                                                        onClick={() => {
                                                                            setAddMember({ id: member.id, avatar_url: member.avatar_url })
                                                                            setOpenSearch(false)
                                                                        }}
                                                                    >
                                                                        <Image
                                                                            src={member.avatar_url}
                                                                            alt="Avatar Found"
                                                                            width={100}
                                                                            height={100}
                                                                            className="rounded-xl object-cover w-10 h-10"
                                                                        />
                                                                        <span>{member.user_name}</span>
                                                                    </article>
                                                                ))
                                                            ) : null
                                                        }
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>

                                    <DrawerFooter>
                                        <BtnSendForm text="Create" className={"w-full dark"} isDisabled={members?.length < 1} />
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