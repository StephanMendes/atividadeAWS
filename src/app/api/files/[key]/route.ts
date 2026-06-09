import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { bucket, s3 } from "@/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: decodeURIComponent(key),
      }),
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: decodeURIComponent(key),
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });

    return Response.json({ url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
