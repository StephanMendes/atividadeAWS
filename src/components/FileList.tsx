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
      if (!response.ok) return;
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
    <div className="mt-6 w-full">
      {/* Ajustado background e bordas para o modo escuro */}
      <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900/40 shadow-xl backdrop-blur-sm">
        
        <div className="border-b border-gray-700 px-6 py-4 flex justify-between items-center bg-gray-900/60">
          <h2 className="text-sm font-semibold text-gray-200 tracking-wide uppercase">Arquivos no S3</h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
            {files.length} {files.length === 1 ? 'arquivo' : 'arquivos'}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
            <p className="text-xs text-gray-400">Buscando dados...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="py-16 text-center text-gray-500 font-medium text-sm">
            Nenhum arquivo encontrado no seu bucket S3.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900/20 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-3.5">Nome</th>
                  <th className="px-6 py-3.5">Tamanho</th>
                  <th className="px-6 py-3.5">Data de Modificação</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>

              {/* Linhas com divisores escuros e efeito hover discreto */}
              <tbody className="divide-y divide-gray-800/60">
                {files.map((file) => (
                  <tr key={file.key} className="transition-colors hover:bg-gray-800/30 group">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-200 group-hover:text-white block truncate max-w-xs md:max-w-md">
                        {file.key}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                      {formatSize(file.size)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(file.lastModified).toLocaleString("pt-BR")}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botão Abrir - Azul discreto */}
                        <button
                          onClick={() => openFile(file.key)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-400 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/20 hover:text-blue-300 transition-all cursor-pointer"
                        >
                          <Eye size={14} />
                          Abrir
                        </button>

                        {/* Botão Excluir - Vermelho discreto */}
                        <button
                          onClick={() => remove(file.key)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-400 border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/20 hover:text-rose-300 transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                          Excluir
                        </button>
                      </div>
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