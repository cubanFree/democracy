'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function checkUsernameExists(username) {
    try {
        const supabase = createServerActionClient({ cookies });

        if (!username) throw new Error('Username is required');
        
        const { data, error } = await supabase
            .from('users')
            .select('user_name')
            .eq('user_name', username)
        if (error) throw new Error('ERROR 500: Something went wrong');

        return { data: data?.length ? true : false, error: null };

    } catch (error) {
        console.error('[ ERROR checkUsernameExists ]', error);
        return { data: false, error: error.message };
    }
}