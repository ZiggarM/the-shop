"use server"

import { createClient } from "@/supabase/server";

export const authenticate = async (email: string, password: string) => {
    try {
        const supabase = await createClient(); // await the resolution of the Promise
        const { error } = await supabase.auth.signInWithPassword({ email, password });
    }
    catch (error) {
        console.log("Inside auth.tsx this is your error", error);
    }
    
};