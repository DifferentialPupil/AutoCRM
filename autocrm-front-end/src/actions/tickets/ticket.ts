"use server"

import { Ticket } from "@/types/schema";
import { getAdminClient } from "@/actions/supabase-server";

const supabase = await getAdminClient();

export async function createTicket(ticket: Partial<Ticket>) {
    const { data, error } = await supabase.from('tickets').insert(ticket).select();
    if (error) throw error;
    return data;
}

export async function getTicketsBySearch(search: string) {

    // Split search into individual terms
    const searchTerms = search
        .split(' ')
        .map(term => term.trim())
        .filter(term => term.length > 0);    

    // Build the query with partial matching
    let query = supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

    // Add ILIKE conditions for each search term
    searchTerms.forEach(term => {
        query = query.ilike('title', `%${term}%`);
    });

    const { data, error } = await query;

    console.log(data);

    if (error) {
        console.error('Search error:', error);
        return [];
    }

    return data;
}