'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { ChatOpenAI } from '@langchain/openai'

const llm = new ChatOpenAI();

export async function message(message: string) {
    const result = await llm.invoke(message);
    return result.content.toString();
}

// const inputSchema = z.object({
//   // define schema
// })

// async function createTicket(formData: FormData) {
//   try {
//     // 1. Validate input
//     // 2. Get supabase client
//     // 3. Perform action
//     // 4. Revalidate path
//     // 5. Return result
//   } catch (error) {
//     // Handle error
//   }
// }