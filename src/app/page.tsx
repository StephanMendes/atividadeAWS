"use client";
import { useState } from "react";
import FileUploader from "../components/FileUploader";
import FileList from "../components/FileList";

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  return (
    <main className="p-6">
      <h1>Gerenciador S3</h1>
      <FileUploader onDone={() => setRefresh((v) => v + 1)} />
      <div key={refresh}>
        <FileList />
      </div>
    </main>
  );
}
