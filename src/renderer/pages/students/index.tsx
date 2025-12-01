import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { PlusCircle, Trash } from "lucide-react";
import ScrollBox from "@/renderer/components/ScrollBox";
import StudentFormDialog from "./components/StudentFormDialog";
import StudentCsvExport from "./components/StudentCsvExport";
import StudentCsvImport from "./components/StudentCsvImport";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
import { useStudents } from "@/renderer/hooks/use_students";
import { MStudent } from "@/db/sqlite/main/schema";
import { DeleteModal } from "@/renderer/components/deleteModal";
import { Toast } from "@/renderer/components/Toast";
import { useMainHouse } from "@/renderer/hooks/use_main_house";
import { Badge } from "@/renderer/components/ui/badge";

export default function StudentsPage() {
  const { students, createStudent, deleteStudent, updateStudent } =
    useStudents();
  const {houses} = useMainHouse()
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollBox>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Students</h1>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>Export</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="grid gap-2">
                <DropdownMenuItem asChild>
                  <StudentCsvExport
                    students={students.map((s) => ({
                      ...s,
                      gender: s.gender as "male" | "female",
                    }))}
                    type="performance"
                  />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <StudentCsvExport
                    students={students.map((s) => ({
                      ...s,
                      gender: s.gender as "male" | "female",
                    }))}
                    type="team"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>Add</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="grid gap-2">
                <DropdownMenuItem asChild>
                  <StudentCsvImport />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <StudentFormDialog />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredStudents.map(s=>{
            const house = houses.find(h=>s.houseId === h.id)
            return {
              ...s,
              house
            }
          }).map((student) => (
            <Card key={student.id} className="rounded-2xl shadow-md">
              <CardContent className="p-4 flex items-center">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {student.firstName} {student.lastName}
                    <Badge variant={"outline"} className="capitalize ml-5">{student.house.name}</Badge>
                  </h2>
                  <p className="text-sm text-gray-500">DOB: {student.dob}</p>
                  <p className="text-sm text-gray-500">
                    Gender: {student.gender}
                  </p>
                </div>
                <aside className="grid gap-3">
                  <DeleteModal
                    onDelete={async () => {
                      try {
                        await deleteStudent(student.id);
                        Toast({
                          message: "Student Deleted Successfully",
                          variation: "success",
                        });
                      } catch (error) {
                        Toast({
                          message: "An Error Occured. Please try again",
                          variation: "error",
                        });
                        console.log(error);
                      }
                    }}
                    trigger={
                      <Button
                        variant="destructive"
                        className="w-6 h-6"
                        size="icon">
                        <Trash />
                      </Button>
                    }
                    title="Delete Student"
                    itemName={`${student.firstName} ${student.lastName}`}
                  />
                  <StudentFormDialog purpose="update" student={student} />
                </aside>
              </CardContent>
            </Card>
          ))}
          {filteredStudents.length === 0 && (
            <p className="text-center text-gray-500">No students found.</p>
          )}
        </div>
      </div>
    </ScrollBox>
  );
}
