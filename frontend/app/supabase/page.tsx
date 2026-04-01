import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select("id,name");

  console.log('todos error', error)
  console.log('todos data', todos)

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-balance text-xl font-semibold tracking-tight text-black">
                Supabase todos
              </h1>
              <p className="mt-1 text-sm text-black/60">
                Server-rendered query from <code className="font-mono">public.todos</code>
              </p>
            </div>

            <div className="rounded-full border border-black/10 bg-black/3 px-3 py-1 text-xs font-medium text-black/70">
              {error ? "Error" : `${todos?.length ?? 0} item(s)`}
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="text-sm font-medium text-red-700">Query failed</div>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-red-800">
                {error.message}
              </pre>
            </div>
          ) : (todos?.length ?? 0) === 0 ? (
            <div className="mt-6 rounded-xl border border-black/10 bg-black/2 p-6 text-center">
              <div className="text-sm font-medium text-black">No todos yet</div>
              <p className="mt-1 text-sm text-black/60">
                Add a row in Supabase (Table Editor → <code className="font-mono">todos</code>) and refresh.
              </p>
            </div>
          ) : (
            <ul className="mt-6 divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10">
              {todos?.map((todo) => (
                <li key={todo.id} className="flex items-center justify-between gap-4 bg-white px-4 py-3">
                  <span className="truncate text-sm font-medium text-black">{todo.name}</span>
                  <span className="shrink-0 rounded-md bg-black/4 px-2 py-1 font-mono text-xs text-black/60">
                    {todo.id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
