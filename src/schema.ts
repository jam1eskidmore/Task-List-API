import { builder } from "./builder";
import { prisma } from "./prisma";

builder.prismaObject("Task", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title"),
    completed: t.exposeBoolean("completed"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});

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
          const { search } = args;

          if (search !== null && search !== undefined) {
            if (typeof search !== "string" || search.length === 0) {
              throw new Error("Search term must be a non-empty string");
            }
            if (search.length > 100) {
              throw new Error("Search term is too long");
            }
          }
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
          if (error instanceof Error) {
            throw new Error(`Failed to fetch tasks: ${error.message}`);
          }
          throw new Error("Failed to fetch tasks");
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
          const id = Number(args.id);
          if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
            throw new Error("ID must be a positive integer");
          }

          return await prisma.task.findUnique({
            where: { id },
          });
        } catch (error) {
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
          const { title } = args;

          if (!title || title.trim().length === 0) {
            throw new Error("Title is required");
          }
          if (title.length > 200) {
            throw new Error("Title is too long (max 200 characters)");
          }

          return await prisma.task.create({
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

    // toggleTask mutation
    toggleTask: t.prismaField({
      type: "Task",
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, root, args) => {
        try {
          const id = Number(args.id);

          if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
            throw new Error("ID must be a positive integer");
          }

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
          const id = Number(args.id);

          if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
            throw new Error("ID must be a positive integer");
          }

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
