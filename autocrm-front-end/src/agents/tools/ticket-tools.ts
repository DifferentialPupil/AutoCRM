import { TicketPriority, TicketStatus } from "@/types/schema";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { createTicket as createTicketAction, getTicketsBySearch } from "@/actions/tickets/ticket";

// Define valid options explicitly from the type definitions
const STATUS_OPTIONS = ['open', 'pending', 'resolved'] as const;
const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const;

const validStatusOptions = STATUS_OPTIONS.join(', ');
const validPriorityOptions = PRIORITY_OPTIONS.join(', ');

function validateTicketInput(input: {
    title: string,
    status: TicketStatus,
    priority: TicketPriority,
    customer_id: string
}) {
    // Check if status is valid
    if (!STATUS_OPTIONS.includes(input.status as typeof STATUS_OPTIONS[number])) {
        throw new Error(`Invalid status. Must be one of: ${validStatusOptions}`);
    }

    // Check if priority is valid
    if (!PRIORITY_OPTIONS.includes(input.priority as typeof PRIORITY_OPTIONS[number])) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorityOptions}`);
    }

    // Validate title
    if (!input.title || input.title.trim().length === 0) {
        throw new Error('Title is required');
    }

    // Validate customer_id
    if (!input.customer_id || input.customer_id.trim().length === 0) {
        throw new Error('Customer ID is required');
    }
}

const schema = z.object({
    title: z.string().describe("The title of the ticket"),
    status: z.enum(STATUS_OPTIONS).describe(`The status of the ticket. Must be one of: ${validStatusOptions}`),
    priority: z.enum(PRIORITY_OPTIONS).describe(`The priority of the ticket. Must be one of: ${validPriorityOptions}`),
    customer_id: z.string().describe("The unique identifier of the customer"),
});

type TicketInput = z.infer<typeof schema>;

export const createTicket = new DynamicStructuredTool({
    name: "createTicket",
    description: `Create a new ticket with the following parameters:
- title: string (required) - A clear description of the ticket
- status: one of [${validStatusOptions}]
- priority: one of [${validPriorityOptions}]
- customer_id: string (required) - The unique identifier of the customer`,
    schema: schema,
    func: async ({ title, status, priority, customer_id }: TicketInput) => {
        try {
            validateTicketInput({
                title,
                status: status as TicketStatus,
                priority: priority as TicketPriority,
                customer_id
            });

            await createTicketAction({
                title: title.trim(),
                status: status as TicketStatus,
                priority: priority as TicketPriority,
                customer_id: customer_id.trim(),
            });

            return `Successfully created ticket: ${title}`;
        } catch (error) {
            if (error instanceof Error) {
                return `Failed to create ticket: ${error.message}`;
            }
            return 'Failed to create ticket: Unknown error';
        }
    }
});

const searchSchema = z.object({
    query: z.string().describe("The search query to find tickets by title"),
});

type TicketSearchInput = z.infer<typeof searchSchema>;

export const searchTickets = new DynamicStructuredTool({
    name: "searchTickets",
    description: "Search for tickets by their title",
    schema: searchSchema,
    func: async ({ query }: TicketSearchInput) => {
        try {
            const tickets = await getTicketsBySearch(query);
            
            if (tickets.length === 0) {
                return "No matching tickets found.";
            }

            return JSON.stringify({
                type: "ticket_search_results",
                data: tickets.map(ticket => ({
                    id: ticket.id,
                    title: ticket.title,
                    status: ticket.status,
                    priority: ticket.priority,
                    customer_id: ticket.customer_id,
                    created_at: ticket.created_at
                })),
                display: `🎫 Found ${tickets.length} ticket(s):\n\n${
                    tickets.map(ticket => 
                        `• **${ticket.title}**\n  Status: ${ticket.status} | Priority: ${ticket.priority}\n  Created: ${new Date(ticket.created_at).toLocaleDateString()}`
                    ).join('\n\n')
                }`
            });
        } catch (error) {
            return JSON.stringify({
                type: "error",
                message: error instanceof Error ? error.message : "Search failed"
            });
        }
    }
});