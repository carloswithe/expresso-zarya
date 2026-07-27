import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { promises as fs } from "fs";
import path from "path";

const packs = [
  { name: "ez-personagens", type: "Actor" },
  { name: "ez-adversarios", type: "Actor" },
  { name: "ez-itens", type: "Item" },
  { name: "ez-diario", type: "JournalEntry" }
];

for (const pack of packs) {
  const inputDir = `./src/packs/${pack.name}`;
  const outputDir = `./packs/${pack.name}`;
  try {
    await fs.rm(outputDir, { recursive: true });
  } catch {}
  await fs.mkdir(outputDir, { recursive: true });
  await compilePack(inputDir, outputDir, { recursive: true, verbose: true });
  console.log(`✓ Compiled ${pack.name}`);
}
console.log("Build complete.");
