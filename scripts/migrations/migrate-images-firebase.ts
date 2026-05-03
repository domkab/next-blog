import mongoose from "mongoose";
import dotenv from "dotenv";
import * as cheerio from "cheerio";

dotenv.config({ path: ".env.local" });

type Provider = "firebase";

type CliOptions = {
  dryRun: boolean;
  confirm: boolean;
  limit?: number;
  slug?: string;
};

type RewriteResult = {
  oldUrl: string;
  firebaseUrl: string;
  storagePath: string;
  action: "rewrite" | "dry_run";
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

const FIREBASE_PUBLIC_BUCKET = requireEnv("FIREBASE_PUBLIC_BUCKET");

const toFirebaseUrl = (storagePath: string) => {
  return `https://storage.googleapis.com/${FIREBASE_PUBLIC_BUCKET}/${encodeURIComponent(
    storagePath,
  )}`;
};

const getArgValue = (name: string) => {
  const arg = process.argv.find(value => value.startsWith(`--${name}=`));

  return arg?.split("=")[1];
};

const getOptions = (): CliOptions => {
  const dryRun = process.argv.includes("--dry-run");
  const confirm = process.argv.includes("--confirm");
  const limitValue = getArgValue("limit");
  const slug = getArgValue("slug");

  if (!dryRun && !confirm) {
    throw new Error("Use either --dry-run or --confirm");
  }

  if (dryRun && confirm) {
    throw new Error("Use only one: --dry-run or --confirm");
  }

  return {
    dryRun,
    confirm,
    limit: limitValue ? Number(limitValue) : undefined,
    slug,
  };
};

const isLocalUploadUrl = (url?: string) => {
  return typeof url === "string" && url.startsWith("/uploads/");
};

const isFirebaseUrl = (url?: string) => {
  return typeof url === "string" && url.includes("storage.googleapis.com");
};

const toStoragePath = (localUrl: string) => {
  return localUrl.replace(/^\/uploads\//, "");
};

const rewriteLocalImageReference = (
  localUrl: string,
  cache: Map<string, RewriteResult>,
  dryRun: boolean,
): RewriteResult => {
  const cached = cache.get(localUrl);
  if (cached) return cached;

  const storagePath = toStoragePath(localUrl);
  const firebaseUrl = toFirebaseUrl(storagePath);

  const result: RewriteResult = {
    oldUrl: localUrl,
    firebaseUrl,
    storagePath,
    action: dryRun ? "dry_run" : "rewrite",
  };
  cache.set(localUrl, result);

  return result;
};

const rewriteContentImages = async (
  content: string,
  cache: Map<string, RewriteResult>,
  dryRun: boolean,
) => {
  const $ = cheerio.load(content);

  const contentResults: RewriteResult[] = [];

  for (const element of $("img").toArray()) {
    const src = $(element).attr("src");

    if (!isLocalUploadUrl(src) || typeof src !== "string") {
      continue;
    }

    const result = rewriteLocalImageReference(src, cache, dryRun);

    contentResults.push(result);

    if (result.firebaseUrl) {
      $(element).attr("src", result.firebaseUrl);
    }
  }

  return {
    content: $.html(),

    results: contentResults,
  };
};

const main = async () => {
  const options = getOptions();

  const mongoUri = process.env.TARGET_MONGODB_URI;
  const dbName = process.env.TARGET_MONGODB_DBNAME;

  if (!mongoUri) {
    throw new Error("Missing TARGET_MONGODB_URI or MONGODB_URI");
  }

  if (!dbName) {
    throw new Error("Missing TARGET_MONGODB_DBNAME or MONGODB_DBNAME");
  }

  const conn = await mongoose
    .createConnection(mongoUri, { dbName })
    .asPromise();

  const postsCollection = conn.collection("posts");
  const query = options.slug ? { slug: options.slug } : {};
  let cursor = postsCollection.find(query);

  if (options.limit) {
    cursor = cursor.limit(options.limit);
  }

  const posts = await cursor.toArray();

  console.log(`Found ${posts.length} post(s).`);

  console.log(
    options.dryRun ? "Running DRY RUN." : "Running CONFIRMED migration.",
  );

  const summary = {
    postsChecked: posts.length,
    postsChanged: 0,
    imagesRewritten: 0,
    missingFiles: 0,
    alreadyFirebase: 0,
    dryRunImages: 0,
  };

  for (const post of posts) {
    const cache = new Map<string, RewriteResult>();

    const results: RewriteResult[] = [];

    let changed = false;

    const nextImages = {
      ...(post.images || {}),

      main: {
        ...(post.images?.main || {}),
      },

      inline: Array.isArray(post.images?.inline)
        ? post.images.inline.map((image: any) => ({ ...image }))
        : [],
    };

    if (isLocalUploadUrl(nextImages.main?.url)) {
      const result = rewriteLocalImageReference(
        nextImages.main.url,
        cache,
        options.dryRun,
      );

      results.push(result);

      if (result.firebaseUrl) {
        nextImages.main.url = result.firebaseUrl;
        nextImages.main.storagePath = result.storagePath;
        nextImages.main.provider = "firebase" satisfies Provider;

        changed = true;
      }
    } else if (isFirebaseUrl(nextImages.main?.url)) {
      summary.alreadyFirebase += 1;
    }

    for (const inlineImage of nextImages.inline) {
      if (!isLocalUploadUrl(inlineImage?.url)) {
        if (isFirebaseUrl(inlineImage?.url)) {
          summary.alreadyFirebase += 1;
        }

        continue;
      }

      const result = rewriteLocalImageReference(
        inlineImage.url,
        cache,
        options.dryRun,
      );

      results.push(result);

      if (result.firebaseUrl) {
        inlineImage.url = result.firebaseUrl;
        inlineImage.storagePath = result.storagePath;
        inlineImage.provider = "firebase" satisfies Provider;

        changed = true;
      }
    }

    const contentResult = await rewriteContentImages(
      post.content || "",
      cache,
      options.dryRun,
    );

    results.push(...contentResult.results);

    if (contentResult.content !== post.content) {
      changed = true;
    }

    for (const result of results) {
      if (result.action === "rewrite") summary.imagesRewritten += 1;
      if (result.action === "dry_run") summary.dryRunImages += 1;
    }

    console.log(`\nPost: ${post.slug}`);

    if (results.length === 0) {
      console.log("  No local images found.");
    }

    for (const result of results) {
      console.log(`  ${result.action}`);
      console.log(`    before: ${result.oldUrl}`);
      console.log(`    after:  ${result.firebaseUrl}`);
      console.log(`    path:   ${result.storagePath}`);
    }

    const hasInvalidRewrite = results.some(result => {
      if (result.action === "rewrite") {
        return !result.firebaseUrl || !result.storagePath;
      }

      return false;
    });

    if (hasInvalidRewrite) {
      console.log("  Skipping save due to invalid rewrite.");
      continue;
    }

    if (!changed) {
      continue;
    }

    summary.postsChanged += 1;

    if (options.dryRun) {
      console.log("  Preview only. No database changes written.");

      continue;
    }

    if (options.confirm) {
      await postsCollection.updateOne(
        { _id: post._id },

        {
          $set: {
            images: nextImages,
            content: contentResult.content,
            updatedAt: new Date(),
          },
        },
      );

      console.log("  Saved.");
    } else {
      console.log("  Would save.");
    }
  }

  console.log("\nMigration summary:");
  console.table(summary);
  await conn.close();
};

main().catch(error => {
  console.error(error);

  process.exit(1);
});

//  should support:

// tsx scripts/migrate-images-to-firebase.ts --dry-run
// tsx scripts/migrate-images-to-firebase.ts --confirm
// tsx scripts/migrate-images-to-firebase.ts --confirm --limit=10
// tsx scripts/migrate-images-to-firebase.ts --confirm --slug=my-post-slug
