'use client';

import { MdOutlineClear, MdOutlineDelete } from "react-icons/md";

export default function ContentMessage({ dataMessages, setDataMessages = () => {} }) {

    return (
        <>
            <div className="w-full h-7 flex items-center justify-between">
                <MdOutlineDelete size={20}/>
                <MdOutlineClear className="cursor-pointer" size={20} onClick={() => setDataMessages(null)}/>
            </div>

            <div className="w-full border-b border-gray-600" />

            <span className="py-2">{JSON.stringify(dataMessages, null, 2)}</span>
        </>
    )
}