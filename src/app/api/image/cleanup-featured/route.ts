import { withAdminAuth } from "@/lib/auth/withAdminAuth";

export const POST = withAdminAuth(async () => {
  const { cleanupUnusedImagesFromFirebaseAndFilestore } = await import(
    "@/lib/firebaseSync"
  );
  const { connect } = await import("@/lib/mongodb/mongoose");

  await connect();

  const startedAt = Date.now();

  try {
    const result = await cleanupUnusedImagesFromFirebaseAndFilestore();
    const duration = Date.now() - startedAt;

    return Response.json(
      {
        success: true,
        message: "Image cleanup completed.",
        stats: {
          deleted: result.deletedCount,
        },
        durationMs: duration,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CLEANUP_FAILED]", error);

    return Response.json(
      {
        success: false,
        message: "Failed to clean up unused images.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
});
