import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "ai-therapy" });

// Example function
const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.id}!` };
    }
);

export const functions = [helloWorld];
