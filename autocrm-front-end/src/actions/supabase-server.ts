"use server"

/*
To whom it may concern:

This is a temporary file to test the supabase server actions since
the project was not setup to properly handle server actions.

*/

import { createClient } from "@supabase/supabase-js";
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.log(supabaseServiceRoleKey)
    throw new Error('Missing Supabase environment variables');
}

export async function getAdminClient() {
    return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
        db: {
            schema: 'public' // Explicitly set to public schema for admin access
        }
    });
}