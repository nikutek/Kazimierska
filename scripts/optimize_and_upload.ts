import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type ArtworkType = "sculpture" | "painting" | "drawing";

interface ProcessedImage {
  originalSize: number;
  optimizedSize: number;
  fileName: string;
}

async function clearBucket() {
  console.log("🗑️  Czyszczenie bucketu...");

  const { data: files, error } = await supabase.storage
    .from("artworks")
    .list("", { limit: 1000 });

  if (error) {
    console.error("Błąd podczas listowania plików:", error);
    return;
  }

  for (const file of files) {
    if (file.name) {
      await supabase.storage.from("artworks").remove([file.name]);
    }
  }

  console.log("✅ Bucket wyczyszczony");
}

async function clearDatabase() {
  console.log("🗑️  Czyszczenie bazy danych...");

  const { error } = await supabase
    .from("artworks")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

  if (error) {
    console.error("Błąd podczas czyszczenia bazy:", error);
  } else {
    console.log("✅ Baza danych wyczyszczona");
  }
}

function getArtworkType(folderPath: string): ArtworkType {
  const folder = path.basename(folderPath).toLowerCase();
  if (folder.includes("painting") || folder.includes("obraz"))
    return "painting";
  if (folder.includes("sculpture") || folder.includes("rzezb"))
    return "sculpture";
  if (folder.includes("drawing") || folder.includes("grafik")) return "drawing";
  return "sculpture";
}

function extractTitle(fileName: string): string {
  const nameWithoutExt = fileName.replace(
    /\.(jpg|jpeg|png|webp|JPG|JPEG|PNG|WEBP)$/i,
    "",
  );
  const readable = nameWithoutExt.replace(/[_-]/g, " ");

  return readable
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

async function optimizeImage(inputPath: string): Promise<Buffer> {
  return await sharp(inputPath)
    .resize(2000, null, {
      withoutEnlargement: true,
      fit: "inside",
    })
    .webp({ quality: 80 })
    .toBuffer();
}

async function processFolder(folderPath: string) {
  const type = getArtworkType(folderPath);
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  console.log(
    `\n📁 Przetwarzam folder: ${path.basename(folderPath)} (${type})`,
  );
  console.log(`   Znaleziono ${imageFiles.length} obrazów\n`);

  const processed: ProcessedImage[] = [];
  let orderIndex = 0;

  for (const fileName of imageFiles) {
    const inputPath = path.join(folderPath, fileName);
    const originalSize = fs.statSync(inputPath).size;

    console.log(`📸 ${fileName}`);
    console.log(
      `   Oryginalny rozmiar: ${(originalSize / 1024 / 1024).toFixed(2)} MB`,
    );

    try {
      // Optymalizuj
      const optimizedBuffer = await optimizeImage(inputPath);
      const optimizedSize = optimizedBuffer.length;

      console.log(
        `   Zoptymalizowany: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`,
      );
      console.log(
        `   Oszczędność: ${((1 - optimizedSize / originalSize) * 100).toFixed(1)}%`,
      );

      // Przygotuj nazwę pliku (zamień na .webp)
      const webpFileName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, ".webp");
      const storagePath = `${type}/${webpFileName}`;

      // Upload do Supabase
      const { error: uploadError } = await supabase.storage
        .from("artworks")
        .upload(storagePath, optimizedBuffer, {
          contentType: "image/webp",
          upsert: false,
        });

      if (uploadError) {
        console.error(`   ❌ Błąd uploadu: ${uploadError.message}`);
        continue;
      }

      // Pobierz publiczny URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("artworks").getPublicUrl(storagePath);

      // Dodaj do bazy danych
      const title = extractTitle(fileName);

      const { error: dbError } = await supabase.from("artworks").insert({
        title,
        type,
        image_url: publicUrl,
        storage_path: storagePath,
        is_published: true,
        order_index: orderIndex++,
      });

      if (dbError) {
        console.error(`   ❌ Błąd zapisu do bazy: ${dbError.message}`);
        continue;
      }

      console.log(`   ✅ Upload i zapis do bazy zakończony\n`);

      processed.push({
        originalSize,
        optimizedSize,
        fileName,
      });
    } catch (error) {
      console.error(`   ❌ Błąd przetwarzania:`, error);
    }
  }

  return processed;
}

async function main() {
  const baseFolder = "C:\\Users\\HP\\Desktop\\KazimierskaMedia\\nadajace_sie";

  console.log("🎨 START OPTYMALIZACJI I UPLOADU\n");

  // 1. Wyczyść bucket i bazę
  await clearBucket();
  await clearDatabase();

  // 2. Przetwórz foldery
  const folders = ["painting", "sculpture"];
  let allProcessed: ProcessedImage[] = [];

  for (const folder of folders) {
    const folderPath = path.join(baseFolder, folder);

    if (fs.existsSync(folderPath)) {
      const processed = await processFolder(folderPath);
      allProcessed = [...allProcessed, ...processed];
    } else {
      console.log(`⚠️  Folder nie istnieje: ${folderPath}`);
    }
  }

  // 3. Podsumowanie
  console.log("\n" + "=".repeat(60));
  console.log("📊 PODSUMOWANIE");
  console.log("=".repeat(60));
  console.log(`Przetworzonych obrazów: ${allProcessed.length}`);

  const totalOriginal = allProcessed.reduce(
    (sum, p) => sum + p.originalSize,
    0,
  );
  const totalOptimized = allProcessed.reduce(
    (sum, p) => sum + p.optimizedSize,
    0,
  );

  console.log(
    `Oryginalny rozmiar: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`,
  );
  console.log(
    `Zoptymalizowany: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`,
  );
  console.log(
    `Oszczędność: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`,
  );
  console.log("\n🎉 GOTOWE!\n");
}

main();
