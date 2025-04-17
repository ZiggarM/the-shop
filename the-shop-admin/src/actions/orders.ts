'use server'

import { createClient } from "@/supabase/server";


export const getOrderWithProducts = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('order')
        .select('*, order_items:order_item(*, product(*)), user(*)')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}