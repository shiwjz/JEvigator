import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const downloads = "/Users/min/Downloads";
const destination = join(process.cwd(), "public", "data");

const encodedCsvFiles = [
  "한국수산자원공단_해조류(김) 데이터_20230109.csv",
  "한국수산자원공단_해조류(김 제외) 데이터_20230109.csv"
];
const utf8Files = [
  "제주특별자치도_마을어장 생태환경 해조류 데이터_20221130.csv"
];
const referencePdf = "천연 식용색소 위생 표준(최종개정_ 2023년 3월 29일).pdf";

await mkdir(destination, { recursive: true });

for (const fileName of encodedCsvFiles) {
  const buffer = await readFile(join(downloads, fileName));
  const text = new TextDecoder("euc-kr").decode(buffer);
  await writeFile(join(destination, fileName), text, "utf8");
}

for (const fileName of utf8Files) {
  await copyFile(join(downloads, fileName), join(destination, fileName));
}

await copyFile(join(downloads, referencePdf), join(destination, referencePdf));

console.log("Seaweed CSV and food-color reference imported into public/data.");
