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
        console.error('[ ERROR checkUsernameExists ]', error.message);
        return { data: false, error: error.message };
    }
}

// id = user target, caseBox [] = all columns - caseBox [some column/s] = get those columns;
export async function fetchProfileData(id, table, caseBox = []) {
    const supabase = createServerActionClient({ cookies });
    
    try {
        if (!id) throw new Error('ID is required');

        let resultRequest;
        if (caseBox.length) {
            // Crear un array de promesas, cada una resolviendo a un objeto {column: data}
            resultRequest = await Promise.all(caseBox.map(async column => {
                const { data, error } = await supabase.from(table).select(column).eq('id', id);
                if (error) throw new Error('ERROR 500: Something went wrong in fetchProfileData');
                return { [column]: data[0][column] };
            }));
        } else {
            // Si no se especifican columnas, obtener todas las columnas para el ID dado
            const { data, error } = await supabase.from(table).select().eq('id', id);
            if (error) throw new Error('ERROR 500: Something went wrong in fetchProfileData');
            resultRequest = [{ allData: data[0] }];
        }

        // Combina todos los objetos en uno solo, resultando en un objeto de objetos
        const combinedData = resultRequest.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        return { data: combinedData, error: null };
        
    } catch (error) {
        console.error('[ ERROR fetchProfileData ]', error.message);
        return { data: null, error: error.message };
    }
}