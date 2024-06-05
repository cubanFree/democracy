'use client';

import { useFormStatus } from 'react-dom';

import { Button } from "../ui/button";

export default function BtnSendForm({ text, className, isDisabled }) {

    const { pending } = useFormStatus();

    return (
        <Button
            className={className}
            type="submit"
            disabled={ isDisabled || pending}
        >
            {text || 'null'}
        </Button>
    )
}