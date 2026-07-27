import { promises as fs } from "fs";
import path from "path";

// Map document types to Foundry collection names
const typeToCollection = {
  Actor: "actors",
  Item: "items",
  JournalEntry: "journal"
};

const packs = [
  { dir: "src/packs/ez-personagens", docType: "Actor" },
  { dir: "src/packs/ez-adversarios", docType: "Actor" },
  { dir: "src/packs/ez-itens",       docType: "Item" },
  { dir: "src/packs/ez-diario",      docType: "JournalEntry" }
];

for (const { dir, docType } of packs) {
  const collection = typeToCollection[docType];
  const files = (await fs.readdir(dir)).filter(f => f.endsWith(".json"));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const doc = JSON.parse(await fs.readFile(filePath, "utf8"));
    doc._key = `!${collection}!${doc._id}`;

    // Add _key to embedded pages in JournalEntry documents
    if (docType === "JournalEntry" && Array.isArray(doc.pages)) {
      for (const page of doc.pages) {
        page._key = `!journal.pages!${doc._id}.${page._id}`;
      }
    }

    // Add _key to embedded items/effects in Actor documents
    if (docType === "Actor") {
      if (Array.isArray(doc.items)) {
        for (const item of doc.items) {
          item._key = `!actors.items!${doc._id}.${item._id}`;
        }
      }
      if (Array.isArray(doc.effects)) {
        for (const effect of doc.effects) {
          effect._key = `!actors.effects!${doc._id}.${effect._id}`;
        }
      }
    }

    await fs.writeFile(filePath, JSON.stringify(doc, null, 2), "utf8");
    console.log(`Keyed ${file}: ${doc._key}`);
  }
}
console.log("Done.");
