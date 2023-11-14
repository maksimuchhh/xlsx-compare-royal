import { useState } from "react";
import * as XLSX from "xlsx";

import FileLoader from "./components/FileLoader";

function App() {
  const [error, setError] = useState("");
  const [isReverse, setIsReverse] = useState(false);

  async function onDrop(files) {
    if (files.length !== 2) return;

    if (isReverse) {
      files = [...files].reverse();
    }

    const firstFile = files[0];
    const secondFile = files[1];

    const firstData = await firstFile.arrayBuffer();
    const secondData = await secondFile.arrayBuffer();

    const firstWorkbook = XLSX.read(firstData);
    const secondWorkbook = XLSX.read(secondData);

    const firstSheetNames = firstWorkbook.SheetNames;
    const secondSheetNames = secondWorkbook.SheetNames;

    if (firstSheetNames.length !== secondSheetNames.length) {
      setError("В файлах різна кількість сторінок! Не можу обробити!");
    }

    const resultArr = [];

    firstSheetNames.forEach((el) => {
      const firstBookSheet = firstWorkbook.Sheets[el];
      const secondBookSheet = secondWorkbook.Sheets[el];
      console.log("firstBookSheet", firstBookSheet);
      const firstBookAColumn = [];
      for (let z in firstBookSheet) {
        if (z.toString()[0] === "A") {
          firstBookAColumn.push({
            rowNumber: z.toString().replace(/^\D+/g, ""),
            ...firstBookSheet[z],
          });
        }
      }

      const secondBookAColumn = [];
      for (let z in secondBookSheet) {
        if (z.toString()[0] === "A") {
          secondBookAColumn.push({
            rowNumber: z.toString().replace(/^\D+/g, ""),
            ...secondBookSheet[z],
          });
        }
      }

      const firstBookBColumn = [];
      for (let z in firstBookSheet) {
        if (z.toString()[0] === "B") {
          firstBookBColumn.push({
            rowNumber: z.toString().replace(/^\D+/g, ""),
            ...firstBookSheet[z],
          });
        }
      }

      const secondBookBColumn = [];
      for (let z in secondBookSheet) {
        if (z.toString()[0] === "B") {
          secondBookBColumn.push({
            rowNumber: z.toString().replace(/^\D+/g, ""),
            ...secondBookSheet[z],
          });
        }
      }

      const firstBookCColumn = [];
      for (let z in firstBookSheet) {
        if (z.toString()[0] === "C") {
          firstBookCColumn.push({
            rowNumber: z.toString().replace(/^\D+/g, ""),
            ...firstBookSheet[z],
          });
        }
      }

      const secondBookCColumn = [];
      for (let z in secondBookSheet) {
        if (z.toString()[0] === "C") {
          secondBookCColumn.push({
            rowNumber: z.toString().replace(/^\D+/g, ""),
            ...secondBookSheet[z],
          });
        }
      }

      firstBookBColumn.forEach((_, key) => {
        const firstValue = firstBookBColumn[key].v;
        if (firstValue) {
          // Find same value as firstValue in second book
          const secondValueKey = secondBookBColumn.findIndex(
            (_, index) => secondBookBColumn[index].v === firstValue
          );

          const secondValue = secondBookBColumn[secondValueKey]?.v;

          if (!secondValue && firstBookBColumn[key]) {
            return resultArr.push([
              firstBookSheet[`A${firstBookBColumn[key].rowNumber}`] || "",
              firstBookBColumn[key] || "",
              "Видалено",
            ]);
          }

          // Check price
          const firstPrice =
            firstBookSheet[`C${firstBookBColumn[key].rowNumber}`]?.v;
          const secondPrice =
            secondBookSheet[`C${secondBookBColumn[secondValueKey].rowNumber}`]
              ?.v;

          if (!firstPrice && !secondPrice) return;

          if (firstPrice === secondPrice) return;

          // Add row to result Array
          resultArr.push([
            firstBookSheet[`A${firstBookBColumn[key].rowNumber}`] || "",
            firstBookBColumn[key] || "",
            secondPrice || "",
          ]);
        }
      });
    });

    if (!resultArr.length) return setError("Різниці в цінах не знайдено!");

    const newWorksheet = XLSX.utils.aoa_to_sheet(resultArr);

    const newWorkbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Різниця");

    XLSX.writeFile(newWorkbook, "Різниця.xlsx");
  }

  return (
    <div className="App">
      <label>
        Змінити файли місцями
        <input
          type="checkbox"
          checked={isReverse}
          onChange={(e) => setIsReverse(e.target.checked)}
        />
      </label>
      <FileLoader onDrop={onDrop} />
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
