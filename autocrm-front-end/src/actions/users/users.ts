"use server"

// import { createClient } from "@/lib/supabase-server";
import { getAdminClient } from "@/actions/supabase-server";

export async function getUsersBySearch(search: string) {

    const supabase = await getAdminClient();
    
    // Split search into individual terms
    const searchTerms = search
        .split(' ')
        .map(term => term.trim())
        .filter(term => term.length > 0);

    // Build the query with partial matching
    let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    // Add ILIKE conditions for each search term
    searchTerms.forEach(term => {
        query = query.ilike('email', `%${term}%`);
    });

    const { data, error } = await query;

    if (error) {
        console.error('Search error:', error);
        return [];
    }

    return data;
}