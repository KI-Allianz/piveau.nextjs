"use client";
import { AppRouter } from "@/server";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>({});

// type RouterInput = inferRouterInputs<AppRouter>;
// type RouterOutput = inferRouterOutputs<AppRouter>;
// export type CompanyCreateInput = RouterInput["createCompany"];
