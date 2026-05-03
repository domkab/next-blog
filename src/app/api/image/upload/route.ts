import { withAdminAuth } from "@/lib/auth/withAdminAuth";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { getUploadsPath } from "@/utils/uploadPath";

type UploadTarget = "main" | "inline" | "featured";

export const POST = withAdminAuth(async (_user, req: NextRequest) => {
  const { uploadToFirebase } = await import("@/lib/firebaseSync");

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const slug = formData.get("slug") as string;
  const target = formData.get("target");

  if (
    !(file instanceof File) ||
    typeof slug !== "string" ||
    typeof target !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const normalizedTarget = target as UploadTarget;

  if (!["main", "inline", "featured"].includes(target)) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  try {
    const inputBuffer = Buffer.from(await file.arrayBuffer());

    const processedBuffer =
      normalizedTarget === "main" || normalizedTarget === "featured"
        ? await sharp(inputBuffer)
            .resize({ width: 1920, height: 1080, fit: "cover" })
            .webp({ quality: 82 })
            .toBuffer()
        : await sharp(inputBuffer)
            .resize({ width: 900, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

    const fileName = `${normalizedTarget}-${Date.now()}-${uuidv4()}.webp`;

    // let resized: Buffer;
    // if (target === "main" || target === "featured") {
    //   resized = await sharp(inputBuffer)
    //     .resize({ width: 1920, height: 1080, fit: "cover" })
    //     .webp({ quality: 82 })
    //     .toBuffer();
    // } else if (target === "inline") {
    //   resized = await sharp(inputBuffer)
    //     .resize({ width: 900, withoutEnlargement: true })
    //     .webp({ quality: 80 })
    //     .toBuffer();
    // } else {
    //   return NextResponse.json({ error: "Invalid target" }, { status: 400 });
    // }

    const relativePath =
      normalizedTarget === "featured"
        ? `featured-posts/${fileName}`
        : `posts/${slug}/${fileName}`;

    // pakeisti i 1 parametra uploadToFirebase
    const firebaseUrl = await uploadToFirebase({
      buffer: processedBuffer,
      storagePath: relativePath,
      contentType: "image/webp",
    });

    //
    // const filePath = getUploadsPath(relativePath);
    // const publicUrl = `/uploads/${relativePath}`;

    // issiaskinti ka daryti su situo, nes dabar visada bus firebase sync

    // ☁️ Upload to Firebase if enabled
    // if (process.env.ENABLE_FIREBASE_SYNC === "true") {
    //   await uploadToFirebase(filePath, relativePath);
    // }

    // return NextResponse.json({ url: publicUrl });

    return NextResponse.json({
      url: firebaseUrl,
      storagePath: relativePath,
      provider: "firebase",
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
});
