'use client';

import { changeStatus } from "@/lib/action";
import { Button } from "../ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import { cn } from "@/lib/utils";

export default function BtnSignOut() {

    const router = useRouter();
    const [pending, setPending] = React.useState(false);

    // cerrar todas las sesiones de supabase ( { scope: 'global' } )
    const signOut = async() => {
        setPending(true);
        try {
            const supabase = createClientComponentClient();

            const { error: errorStatus } = await changeStatus('offline');
            if (errorStatus) throw new Error(errorStatus.message);

            const { error } = await supabase.auth.signOut({ scope: 'global' });
            if (error) throw new Error(error.message);
            router.push('/');
            
        } catch (error) {
            console.error(error);
            setPending(false);
        }
    };

    return (
        <Button 
            onClick={signOut} 
            size="sm" 
            disabled={pending}
            className={cn(
                "w-full border border-red-500 text-red-500 bg-default",
                pending && "cursor-not-allowed opacity-50"
            )}
        >
            {
                pending ? 'Please wait...' : 'Sign out'
            }
        </Button>
    )
}