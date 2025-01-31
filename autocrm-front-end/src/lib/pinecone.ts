"use server"

import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from "@pinecone-database/pinecone"
import { PineconeStore } from "@langchain/pinecone"
import { Document } from "@langchain/core/documents"
import { ArticleMetadata } from '@/types/schema';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!PINECONE_API_KEY || !PINECONE_INDEX || !OPENAI_API_KEY) {
    throw new Error('PINECONE_API_KEY or PINECONE_INDEX or OPENAI_API_KEY is not set');
}

const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY
});

let vectorStore: PineconeStore | null = null;

export async function getVectorStore() {
	if (!vectorStore) {
		vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({
			modelName: "text-embedding-3-large",
			apiKey: OPENAI_API_KEY
		}), {
			pineconeIndex: pinecone.index(PINECONE_INDEX || ""),
			namespace: "knowledge-base"
		});
	}
    return vectorStore;
}

export async function uploadText(text: string, metadata: Partial<ArticleMetadata>) {
    const vectorStore = await getVectorStore();
    await vectorStore.addDocuments([new Document({
        pageContent: text,
        metadata: metadata
    })]);
}