import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { bucket, s3 } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: file.name,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

