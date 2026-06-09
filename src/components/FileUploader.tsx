'use client';
import { useState } from 'react';

export default function FileUploader({onDone}:{onDone:()=>void}){
 const [loading,setLoading]=useState(false);

 async function upload(file:File){
  setLoading(true);
  const fd=new FormData();
  fd.append('file',file);
  await fetch('/api/files/upload',{method:'POST',body:fd});
  setLoading(false);
  onDone();
 }

 return <input type="file" disabled={loading}
  onChange={e=>e.target.files?.[0] && upload(e.target.files[0])}/>;
}
