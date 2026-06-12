"use client";
import { useState } from "react";
import FileUploader from "../components/FileUploader";
import FileList from "../components/FileList";
import { CloudUpload } from "lucide-react";

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  return (
    <main className=" p-2 mt-2 ml-2">
      <h1 className="text-4xl">Drive Paraguai</h1>
      <label className="mt-4  text-sm inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium  transition text-gray-400 hover:bg-gray-800 cursor-pointer border">
        <CloudUpload className="text-gray-400 hover:bg-gray-800" />
        <p className=" text-sm  text-gray-400 hover:bg-gray-800">
          Upload de Arquivos
        </p>
        <FileUploader onDone={() => setRefresh((v) => v + 1)} />
      </label>
      <div key={refresh}>
        <FileList />
      </div>
    </main>
  );
}
