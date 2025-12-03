import { builder } from "./builder";
import { prisma } from "./prisma";

// Define the Task type
builder.prismaObject("Task", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title"),
    completed: t.exposeBoolean("completed"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

//Placeholder
builder.queryType({
  fields: (t) => ({
    // Placeholder query
    hello: t.string({
      resolve: () => "Hello World!",
    }),
  }),
});

//addTask
//addTask
builder.mutationType({
  fields: (t) => ({
    addTask: t.prismaField({
      type: "Task",
      args: {
        title: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args) => {
        try {
          const { title } = args;

          // Validate title
          if (!title || title.trim().length === 0) {
            throw new Error("Title is required");
          }
          if (title.length > 200) {
            throw new Error("Title is too long (max 200 characters)");
          }

          return await prisma.task.create({
            // Remove the ...query spread
            data: {
              title: title.trim(),
              completed: false,
            },
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Failed to create task: ${error.message}`);
          }
          throw new Error("Failed to create task");
        }
      },
    }),
  }),
});

// Build and export the schema
export const schema = builder.toSchema();
