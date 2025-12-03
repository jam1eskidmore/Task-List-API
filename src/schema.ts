import { builder } from "./builder";
import { prisma } from "./prisma";
import { z } from "zod";

builder.prismaObject("Task", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title"),
    completed: t.exposeBoolean("completed"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

// ----------ZOD VALIDATON OBJECT----------

const TaskValidation = {
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long (max 200 characters)"),

  id: z
    .number()
    .int("ID must be an integer")
    .positive("ID must be a positive number"),

  search: z
    .string()
    .min(1, "Search term must be non-empty")
    .max(100, "Search term is too long (max 100 characters)")
    .optional(),
};

// ----------QUERIES----------

builder.queryType({
  fields: (t) => ({
    //query tasks with optional search argument
    tasks: t.prismaField({
      type: ["Task"],
      args: {
        search: t.arg.string({ required: false }),
      },
      resolve: async (query, root, args) => {
        try {
          const search = args.search
            ? TaskValidation.search.parse(args.search)
            : undefined;

          const where = search
            ? {
                title: {
                  contains: search,
                },
              }
            : {};

          return await prisma.task.findMany({
            where,
            orderBy: {
              createdAt: "desc",
            },
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(
              `Validation error: ${
                error.issues[0]?.message || "Validation failed"
              }`
            );
          }
          if (error instanceof Error) {
            throw new Error(`Failed to [operation]: ${error.message}`);
          }
          throw new Error("Failed to [operation]");
        }
      },
    }),

    //query task by id
    task: t.prismaField({
      type: "Task",
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, root, args) => {
        try {
          const id = TaskValidation.id.parse(Number(args.id));

          return await prisma.task.findUnique({
            where: { id },
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(
              `Validation error: ${
                error.issues[0]?.message || "Validation failed"
              }`
            );
          }
          if (error instanceof Error) {
            throw new Error(`Failed to fetch task: ${error.message}`);
          }
          throw new Error("Failed to fetch task");
        }
      },
    }),
  }),
});

// ----------MUTATIONS----------

builder.mutationType({
  fields: (t) => ({
    // addTask mutation
    addTask: t.prismaField({
      type: "Task",
      args: {
        title: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args) => {
        try {
          const title = TaskValidation.title.parse(args.title);

          return await prisma.task.create({
            data: {
              title,
              completed: false,
            },
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(
              `Validation error: ${
                error.issues[0]?.message || "Validation failed"
              }`
            );
          }
          if (error instanceof Error) {
            throw new Error(`Failed to create task: ${error.message}`);
          }
          throw new Error("Failed to create task");
        }
      },
    }),

    // toggleTask mutation
    toggleTask: t.prismaField({
      type: "Task",
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, root, args) => {
        try {
          const id = TaskValidation.id.parse(Number(args.id));

          const existingTask = await prisma.task.findUnique({
            where: { id },
          });

          if (!existingTask) {
            return null;
          }

          return await prisma.task.update({
            where: { id },
            data: {
              completed: !existingTask.completed,
              updatedAt: new Date(),
            },
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(
              `Validation error: ${
                error.issues[0]?.message || "Validation failed"
              }`
            );
          }
          if (error instanceof Error) {
            throw new Error(`Failed to toggle task: ${error.message}`);
          }
          throw new Error("Failed to toggle task");
        }
      },
    }),

    // deleteTask mutation
    deleteTask: t.prismaField({
      type: "Task",
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, root, args) => {
        try {
          const id = TaskValidation.id.parse(Number(args.id));

          const existingTask = await prisma.task.findUnique({
            where: { id },
          });

          if (!existingTask) {
            return null;
          }

          return await prisma.task.delete({
            where: { id },
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(
              `Validation error: ${
                error.issues[0]?.message || "Validation failed"
              }`
            );
          }
          if (error instanceof Error) {
            throw new Error(`Failed to delete task: ${error.message}`);
          }
          throw new Error("Failed to delete task");
        }
      },
    }),
  }),
});

export const schema = builder.toSchema();
