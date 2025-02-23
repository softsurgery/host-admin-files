export const downloadFile = (file: File) => {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export function downloadFileFromUrl(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = url.split("/").pop() || "file";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
