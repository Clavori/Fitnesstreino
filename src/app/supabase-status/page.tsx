import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function SupabaseCheckPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Tenta consultar perfis e grupos (ou todos caso a tabela de exemplo exista)
  const { data: groups, error: groupsError } = await supabase
    .from("gym_groups")
    .select("*");

  const { data: todos } = await supabase.from("todos").select();

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#070A12] p-6 text-white">
      <div className="rounded-3xl border border-neon-lime/40 bg-slate-900 p-5">
        <span className="rounded-full bg-neon-lime/15 px-3 py-1 text-xs font-extrabold uppercase text-neon-lime">
          Supabase SSR Conectado
        </span>
        <h1 className="mt-2 text-xl font-black">
          Status da Conexão com Supabase
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </p>

        {groupsError ? (
          <div className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200">
            <p className="font-bold">
              Cliente Supabase SSR funcionando! Falta apenas rodar o SQL Schema:
            </p>
            <p className="mt-1 text-slate-300">
              Abra o SQL Editor do seu projeto Supabase e execute o arquivo{" "}
              <code>supabase/schema.sql</code> para criar as tabelas{" "}
              <code>profiles</code>, <code>workout_plans</code>,{" "}
              <code>attendance_logs</code> e <code>gym_groups</code>.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-xs text-emerald-200">
            <p className="font-bold">Tabelas do FORJA ativas no Supabase!</p>
            <ul className="mt-2 space-y-1">
              {groups?.map((g) => (
                <li key={g.code}>
                  • <strong>{g.code}</strong>: {g.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {todos && todos.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-300">Tabela Todos:</p>
            <ul className="mt-1 list-disc pl-4 text-xs text-slate-300">
              {todos.map((todo: { id: string | number; name: string }) => (
                <li key={todo.id}>{todo.name}</li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/"
          className="mt-5 block w-full rounded-xl bg-neon-lime py-3 text-center text-xs font-black uppercase text-slate-950"
        >
          Voltar para o App FORJA
        </Link>
      </div>
    </div>
  );
}
