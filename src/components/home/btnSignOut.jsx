'use client';

import { Button } from "../ui/button";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function BtnSignOut() {

    const router = useRouter();
    const [pending, setPending] = React.useState(false);

    // cerrar todas las sesiones de supabase ( { scope: 'global' } )
    const signOut = async() => {
        setPending(true);
        try {
            const supabase = createClientComponentClient();
            const { error } = await supabase.auth.signOut({ scope: 'global' });
            if (error) throw new Error(error.message);
            router.push('/');
        } catch (error) {
            console.error(error);
            setPending(false);
        }
    };

    return (
        <Button onClick={signOut} size="sm" variant="destructive" className="w-full mt-2">
            {
                pending ? 'Please wait...' : 'Sign out'
            }
        </Button>
    )
}