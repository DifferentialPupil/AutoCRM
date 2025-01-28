'use server'

import { ChatOpenAI } from '@langchain/openai'

const llm = new ChatOpenAI();

export async function message(message: string) {
    const result = await llm.invoke(message);
    return result.content.toString();
}