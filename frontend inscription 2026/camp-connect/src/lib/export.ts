import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportToPDF = (
  data: Record<string, string>[],
  title: string,
  columns: string[]
) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Exporté le ${new Date().toLocaleDateString("fr-FR")}`, 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [columns],
    body: data.map((row) => columns.map((col) => row[col] || "")),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 41, 59], textColor: 255 },
  });

  doc.save(`${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
};

export const exportToExcel = (
  data: Record<string, string>[],
  fileName: string
) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Données");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
