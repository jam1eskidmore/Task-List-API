import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "../generated/prisma/pothos-types";
import { getDatamodel } from "../generated/prisma/pothos-types";
import { prisma } from "./prisma";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
  },
});

// Define the DateTime scalar
builder.scalarType("DateTime", {
  serialize: (date) => date.toISOString(),
  parseValue: (value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    throw new Error("Invalid DateTime value");
  },
});
