'use server'

import { ChatOpenAI } from '@langchain/openai'
import { getVectorStore } from '@/lib/pinecone'
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const vectorStore = await getVectorStore();
const llm = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.7,
});

const retriever = vectorStore.asRetriever({
    searchType: "similarity",
    k: 3
});

const prompt = PromptTemplate.fromTemplate(`
Answer the following question based on the provided context. If the context doesn't contain relevant information, 
use your general knowledge but mention that the answer is not based on the provided context.

Context: {context}

Question: {question}

Please provide a clear and concise answer. If you're using information from the context, reference it in your response.
`);

const ragChain = RunnableSequence.from([
    {
        context: async (input: { question: string }) => {
            const relevantDocs = await retriever.invoke(input.question);
            return relevantDocs.map(doc => doc.pageContent).join("\n\n");
        },
        question: (input: { question: string }) => input.question,
    },
    prompt,
    llm,
    new StringOutputParser(),
]);

export async function message(message: string) {
    try {
        const response = await ragChain.invoke({
            question: message,
        });
        return response;
    } catch (error) {
        console.error('Error in RAG chain:', error);
        return "I apologize, but I encountered an error while processing your request. Please try again.";
    }
}