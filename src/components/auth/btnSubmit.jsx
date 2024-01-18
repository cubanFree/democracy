'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { AiOutlineReload } from "react-icons/ai";

export default function BtnSubmit({ text, isDisabled }) {

    const { pending } = useFormStatus();

    return (
        <Button
            disabled={isDisabled || pending}
            variant="default"
            type="submit"
            className="w-full dark"
            >
                {
                    pending ? (
                        <span className='flex gap-2'><AiOutlineReload className="mr-2 h-4 w-4 animate-spin" />Please wait</span>
                    ) : (
                        <span>{text || 'null'}</span>
                    )
                }
        </Button>
    )
}