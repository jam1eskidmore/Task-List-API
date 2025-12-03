/* eslint-disable */
import type { Prisma, Task } from "./client/client.js";
import type { PothosPrismaDatamodel } from "@pothos/plugin-prisma";
export default interface PrismaTypes {
  Task: {
    Name: "Task";
    Shape: Task;
    Include: never;
    Select: Prisma.TaskSelect;
    OrderBy: Prisma.TaskOrderByWithRelationInput;
    WhereUnique: Prisma.TaskWhereUniqueInput;
    Where: Prisma.TaskWhereInput;
    Create: {};
    Update: {};
    RelationName: never;
    ListRelations: never;
    Relations: {};
  };
}
export function getDatamodel(): PothosPrismaDatamodel;
