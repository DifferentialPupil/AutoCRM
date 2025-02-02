import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getUsersBySearch } from "@/actions/users/users";

const schema = z.object({
    name: z.string().describe("The user name to search for"),
});

type UserSearchInput = z.infer<typeof schema>;

export const searchUsersByName = new DynamicStructuredTool({
    name: "searchUsersByName",
    description: "Search for users by their name",
    schema: schema,
    func: async ({ name }: UserSearchInput) => {
        try {
            const users = await getUsersBySearch(name);

            console.log(users);
            
            if (users.length === 0) {
                return "No matching users found.";
            }

            return JSON.stringify({
                type: "user_search_results",
                data: users.map(user => ({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at
                })),
                display: `🔍 Found ${users.length} user(s):\n\n${
                    users.map(user => 
                        `• **${user.email}** (${user.role})\n  Created: ${new Date(user.created_at).toLocaleDateString()}`
                    ).join('\n')
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
