import React from "react";
import { DataTable } from "./data-table/data-table";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { FileUploader } from "../ui/file-uploader";
import { api } from "@/api";
import { getFileColumns } from "./data-table/columns";
import { BFile } from "@/types/BFile";

// async function getData(): Promise<File[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "1",
//       fileName: "report.pdf",
//       fileType: "PDF",
//       fileSize: "1.2 MB",
//       uploadDate: "2025-01-15",
//     },
//     {
//       id: "2",
//       fileName: "photo.jpg",
//       fileType: "Image",
//       fileSize: "3.4 MB",
//       uploadDate: "2025-01-14",
//     },
//     {
//       id: "3",
//       fileName: "data.xlsx",
//       fileType: "Spreadsheet",
//       fileSize: "850 KB",
//       uploadDate: "2025-01-13",
//     },
//     {
//       id: "4",
//       fileName: "presentation.pptx",
//       fileType: "Presentation",
//       fileSize: "4.2 MB",
//       uploadDate: "2025-01-12",
//     },
//     {
//       id: "5",
//       fileName: "document.docx",
//       fileType: "Document",
//       fileSize: "2.5 MB",
//       uploadDate: "2025-01-11",
//     },
//     {
//       id: "6",
//       fileName: "archive.zip",
//       fileType: "Archive",
//       fileSize: "15.8 MB",
//       uploadDate: "2025-01-10",
//     },
//     {
//       id: "7",
//       fileName: "notes.txt",
//       fileType: "Text File",
//       fileSize: "12 KB",
//       uploadDate: "2025-01-09",
//     },
//     {
//       id: "8",
//       fileName: "design.psd",
//       fileType: "Photoshop File",
//       fileSize: "25 MB",
//       uploadDate: "2025-01-08",
//     },
//     {
//       id: "9",
//       fileName: "script.js",
//       fileType: "JavaScript File",
//       fileSize: "5 KB",
//       uploadDate: "2025-01-07",
//     },
//     {
//       id: "10",
//       fileName: "video.mp4",
//       fileType: "Video",
//       fileSize: "150 MB",
//       uploadDate: "2025-01-06",
//     },
//     {
//       id: "11",
//       fileName: "project-plan.docx",
//       fileType: "Document",
//       fileSize: "2.1 MB",
//       uploadDate: "2025-01-05",
//     },
//     {
//       id: "12",
//       fileName: "invoice.pdf",
//       fileType: "PDF",
//       fileSize: "750 KB",
//       uploadDate: "2025-01-04",
//     },
//     {
//       id: "13",
//       fileName: "logo.png",
//       fileType: "Image",
//       fileSize: "1.5 MB",
//       uploadDate: "2025-01-03",
//     },
//     {
//       id: "14",
//       fileName: "budget.csv",
//       fileType: "Spreadsheet",
//       fileSize: "650 KB",
//       uploadDate: "2025-01-02",
//     },
//     {
//       id: "15",
//       fileName: "app.apk",
//       fileType: "Application",
//       fileSize: "20.4 MB",
//       uploadDate: "2025-01-01",
//     },
//     {
//       id: "16",
//       fileName: "manual.pdf",
//       fileType: "PDF",
//       fileSize: "3.2 MB",
//       uploadDate: "2024-12-31",
//     },
//     {
//       id: "17",
//       fileName: "background.jpg",
//       fileType: "Image",
//       fileSize: "5.8 MB",
//       uploadDate: "2024-12-30",
//     },
//     {
//       id: "18",
//       fileName: "notes.md",
//       fileType: "Markdown File",
//       fileSize: "25 KB",
//       uploadDate: "2024-12-29",
//     },
//     {
//       id: "19",
//       fileName: "animation.gif",
//       fileType: "GIF",
//       fileSize: "2.3 MB",
//       uploadDate: "2024-12-28",
//     },
//     {
//       id: "20",
//       fileName: "music.mp3",
//       fileType: "Audio",
//       fileSize: "4.5 MB",
//       uploadDate: "2024-12-27",
//     },
//   ];
// }

export default function Files() {
  const [data, setData] = React.useState<BFile[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const { setRoutes } = useBreadcrumb();

  React.useEffect(() => {
    setRoutes?.([
      { href: "/", title: "Home" },
      { href: "/files", title: "Files" },
    ]);
  }, []);

  React.useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await api.file.fetchAll();
      setData(data.records);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto p-5 no-scrollbar">
      <div>
        <FileUploader className="my-5" maxFileCount={Infinity} />
      </div>
      <DataTable columns={getFileColumns()} data={data} />
    </div>
  );
}
