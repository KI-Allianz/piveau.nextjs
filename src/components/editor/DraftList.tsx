"use client";

import { trpc } from "@/app/_trpc/client";

export function DraftList() {
  const getDrafts = trpc.dataset.draft.getAll.useQuery();

  return (
    <div className="max-w-3xl mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">Drafts</h1>
      {getDrafts.isLoading && <p>Loading drafts...</p>}
      {getDrafts.isError && (
        <p className="text-red-500">
          Error loading drafts: {getDrafts.error.message}
        </p>
      )}
      {getDrafts.data && getDrafts.data.length === 0 && <p>No drafts found.</p>}
      {getDrafts.data && getDrafts.data.length > 0 && (
        <ul className="space-y-2">
          {getDrafts.data.map((draft) => (
            <li key={draft.id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">{draft.title}</h2>
              <p>ID: {draft.id}</p>
              <p>Status: {draft.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
