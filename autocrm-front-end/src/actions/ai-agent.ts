'use server'

import { ChatOpenAI } from '@langchain/openai'
import { getVectorStore } from '@/lib/pinecone'
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { searchUsersByName } from '@/agents/tools/user-tools';
import { searchTickets, createTicket } from '@/agents/tools/ticket-tools';
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

const vectorStore = await getVectorStore();

// Base LLM for RAG and Console agents
const llm = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.7,
});

// Supervisor LLM with lower temperature for more consistent oversight
const supervisorLLM = new ChatOpenAI({
    modelName: "gpt-4-turbo-preview",
    temperature: 0.3,
});

const retriever = vectorStore.asRetriever({
    searchType: "similarity",
    k: 3
});

// Base RAG prompt
const ragPrompt = PromptTemplate.fromTemplate(`
Answer the following question based on the provided context. If the context doesn't contain relevant information, 
use your general knowledge but mention that the answer is not based on the provided context.

Context: {context}

Question: {question}

Please provide a clear and concise answer. If you're using information from the context, reference it in your response.
`);

// User Search Agent prompt
const userSearchPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a user search agent. Your role is to help find users in the system.
        You have access to a tool that can search users by name.
        
        When searching for users:
        1. Extract the name or partial name from the query
        2. Use the searchUsersByName tool to find matching users
        3. Present the results in a clear, formatted way
        
        If no name is provided or the query is unclear, ask for clarification.`
    ),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
    SystemMessagePromptTemplate.fromTemplate("{agent_scratchpad}")
]);

// Create the user search agent
const userSearchAgent = await createOpenAIFunctionsAgent({
    llm,
    tools: [searchUsersByName],  // Define tools available to the agent
    prompt: userSearchPrompt
});

// The executor requires tools to be specified explicitly, even though the agent already has them
const userSearchExecutor = AgentExecutor.fromAgentAndTools({
    agent: userSearchAgent,
    tools: [searchUsersByName],
});

// User Search Chain
const userSearchChain = RunnableSequence.from([
    {
        input: (input: { question: string }) => input.question,
    },
    async (input: string) => {
        const result = await userSearchExecutor.invoke({ input });
        return result.output;
    },
    new StringOutputParser(),
]);

// Ticket Agent prompt
const ticketAgentPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a ticket management agent. Your role is to help users create and find tickets in the system.
        You have access to the following tools:
        1. createTicket: Create new tickets with title, status, priority, and customer_id
        2. searchTickets: Search existing tickets using various criteria

        When handling ticket requests:
        - For creation: Ensure all required fields are provided (title, status, priority, customer_id)
        - For searching: Extract relevant search criteria from the query
        - Present results in a clear, formatted way
        
        Valid ticket status options: 'open', 'pending', 'resolved'
        Valid priority options: 'low', 'medium', 'high'

        If the request is unclear or missing required information, ask for clarification.`
    ),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
    SystemMessagePromptTemplate.fromTemplate("{agent_scratchpad}")
]);

// Create the ticket agent
const ticketAgent = await createOpenAIFunctionsAgent({
    llm,
    tools: [createTicket, searchTickets],
    prompt: ticketAgentPrompt
});

const ticketExecutor = AgentExecutor.fromAgentAndTools({
    agent: ticketAgent,
    tools: [createTicket, searchTickets],
});

// Ticket Chain
const ticketChain = RunnableSequence.from([
    {
        input: (input: { question: string }) => input.question,
    },
    async (input: string) => {
        const result = await ticketExecutor.invoke({ input });
        return result.output;
    },
    new StringOutputParser(),
]);

// Modify supervisor prompt to include user search agent and ticket agent
const supervisorPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a supervisor overseeing multiple agents. Your role is to:
        1. Analyze the input question
        2. Choose the appropriate agent:
           - RAG Agent: For questions requiring knowledge retrieval and detailed answers
           - User Search Agent: For queries about finding or looking up users
           - Ticket Agent: For creating or searching tickets
        
        Review the following response and start your response with one of these:
        a) "APPROVED_RAG:" followed by the RAG agent's response
        b) "APPROVED_USER_SEARCH:" followed by the User Search agent's response
        c) "APPROVED_TICKET:" followed by the Ticket agent's response

        Choose the Ticket Agent for requests like:
        - Creating new tickets
        - Searching for tickets
        - Updating ticket status
        - Ticket-related queries

        Always include the final response that should be shown to the user, not just your review comments.
        Consider the nature of the question when choosing between agents.`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `Original Question: {question}
         Available Context: {context}
         RAG Response: {ragResponse}
         User Search Response: {userSearchResponse}
         Ticket Response: {ticketResponse}
         
         Please review and select the most appropriate response:`
    )
]);

// RAG Chain
const ragChain = RunnableSequence.from([
    {
        context: async (input: { question: string }) => {
            const relevantDocs = await retriever.invoke(input.question);
            return relevantDocs.map(doc => doc.pageContent).join("\n\n");
        },
        question: (input: { question: string }) => input.question,
    },
    ragPrompt,
    llm,
    new StringOutputParser(),
]);


const supervisedChain = RunnableSequence.from([
    {
        question: (input: { question: string }) => input.question,
        context: async (input: { question: string }) => {
            const relevantDocs = await retriever.invoke(input.question);
            return relevantDocs.map(doc => doc.pageContent).join("\n\n");
        },
        ragResponse: async (input: { question: string }) => {
            return await ragChain.invoke({ question: input.question });
        },
        userSearchResponse: async (input: { question: string }) => {
            return await userSearchChain.invoke({ question: input.question });
        },
        ticketResponse: async (input: { question: string }) => {
            return await ticketChain.invoke({ question: input.question });
        },
    },
    supervisorPrompt,
    supervisorLLM,
    new StringOutputParser(),
    // Process the supervisor's response to extract the actual response
    (response: string) => {
        if (response.startsWith('APPROVED_RAG:')) {
            return response.slice('APPROVED_RAG:'.length).trim();
        } else if (response.startsWith('APPROVED_USER_SEARCH:')) {
            return response.slice('APPROVED_USER_SEARCH:'.length).trim();
        } else if (response.startsWith('APPROVED_TICKET:')) {
            return response.slice('APPROVED_TICKET:'.length).trim();
        }
        return response;
    }
]);

export async function message(message: string) {
    try {
        const response = await supervisedChain.invoke({
            question: message,
        });
        return response;
    } catch (error) {
        console.error('Error in supervised chain:', error);
        return "I apologize, but I encountered an error while processing your request. Please try again.";
    }
}