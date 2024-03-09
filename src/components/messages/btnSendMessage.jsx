'use client';

import { useFormStatus } from 'react-dom';

import { Button } from "../ui/button";

export default function BtnSendMessage() {

    const { pending } = useFormStatus();

    return (
        <Button
            className="border border-gray-600 rounded-lg md:self-end"
            type="submit"
            disabled={pending}
        >
            Send
        </Button>
    )
}