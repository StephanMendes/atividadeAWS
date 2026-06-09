"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";

type FileItem = {
  key: string;
  size: number;
  lastModified: string;
};

export default function FileList() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const openFile = async (key: string) => {
    const response = await fetch(`/api/files/${encodeURIComponent(key)}`);

    const data = await response.json();

    window.open(data.url, "_blank");
  };

  const load = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/files");

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (key: string) => {
    try {
      await fetch(`/api/files/${encodeURIComponent(key)}`, {
        method: "DELETE",
      });

      setFiles((prev) => prev.filter((file) => file.key !== key));
    } catch (error) {
      console.error(error);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="mt-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Arquivos armazenados
          </h2>
          <p className="text-sm text-slate-500">{files.length} arquivo(s)</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          </div>
        ) : files.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            Nenhum arquivo encontrado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Nome
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Tamanho
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Data
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {files.map((file) => (
                  <tr
                    key={file.key}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        {file.key}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {formatSize(file.size)}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {new Date(file.lastModified).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-right ">
                      <button
                        onClick={() => openFile(file.key)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        <Eye size={16} />
                        Abrir
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => remove(file.key)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
