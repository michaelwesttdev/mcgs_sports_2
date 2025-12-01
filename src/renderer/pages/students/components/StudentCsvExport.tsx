import React from "react";
import { Button } from "@/renderer/components/ui/button";

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "male" | "female";
};

function toCsv(students: Student[]): string {
  const header = ["First Name", "Last Name", "Date of Birth", "Gender"];
  const rows = students.map((s) => [s.firstName, s.lastName, s.dob, s.gender]);
  return [header, ...rows].map((row) => row.join(",")).join("\r\n");
}

export default function StudentCsvExport({ students, type }: { students: Student[]; type: "performance" | "team" }) {
  function handleExport() {
    const csv = toCsv(students);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Button onClick={handleExport} variant="outline">
      Export Students as CSV ({type === "performance" ? "Performance" : "Team"})
    </Button>
  );
}
