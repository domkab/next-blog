import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/auth/withAdminAuth";

export const POST = withAdminAuth(async () => {
  const { syncFromFirebase } = await import("@/lib/firebaseSync");

  const startedAt = Date.now();

  try {
    const result = await syncFromFirebase();

    return NextResponse.json({
      success: true,
      message: "Firebase → local image sync completed.",
      stats: {
        scanned: result?.scannedCount ?? null,
        downloaded: result?.downloadedCount ?? null,
        skipped: result?.skippedCount ?? null,
        failed: result?.failedCount ?? null,
      },
      durationMs: Date.now() - startedAt,
    });
  } catch (err) {
    console.error("🔥 Sync failed:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Firebase image sync failed.",
        error: err instanceof Error ? err.message : String(err),
        durationMs: Date.now() - startedAt,
      },
      { status: 500 },
    );
  }
});
