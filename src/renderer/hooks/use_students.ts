import { useContext } from "react";
import { StudentContext } from "~/contexts/student.context.provider";

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error(
      "useStudentsContext must be used within a StudentProvider"
    );
  }
  return context;
}
