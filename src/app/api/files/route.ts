import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { bucket, s3 } from "../../../lib/s3";

export async function GET() {
  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: bucket }));
    console.log(data);
    return NextResponse.json(
      (data.Contents || []).map((f) => ({
        key: f.Key,
        size: f.Size,
        lastModified: f.LastModified,
      })),
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
