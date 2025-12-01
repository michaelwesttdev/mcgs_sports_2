import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Toast } from "../components/Toast";
import { MStudent } from "@/db/sqlite/main/schema";

type Props = { children: React.ReactNode };

interface StudentContextProps {
  listAllStudents: () => void;
  createStudent: (
    student: Omit<
      MStudent,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    toast?:boolean
  ) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
  updateStudent: (
    id: string,
    student: Partial<MStudent>
  ) => Promise<boolean>;
  students: MStudent[];
  loading: boolean;
  error: Error | null;
}

export const StudentContext = React.createContext<StudentContextProps>({
  listAllStudents: () => Promise.resolve(),
  createStudent: () => Promise.resolve(false),
  deleteStudent: () => Promise.resolve(false),
  updateStudent: () => Promise.resolve(false),
  students: [],
  loading: false,
  error: null,
});

export default function StudentContextProvider({ children }: Props) {
  const [students, setStudents] = useState<MStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  async function listAllStudents() {
    setLoading(true);
    try {
      const response = await window.api.mainListStudent(undefined);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setStudents(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }
  async function createStudent(
    student: Omit<
      MStudent,
      "id" | "createdAt" | "updatedAt" | "deletedAt"
    >,
    toast = false
  ) {
    setLoading(true);
    try {
      const id = nanoid();
      const response = await window.api.mainCreateStudent({
        id,
        ...student,
      });
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setStudents((prev) => [...prev, data]);
      toast??Toast({
        message: "student created successfully",
        variation: "success",
      });
      return response.success;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function deleteStudent(id: string) {
    setLoading(true);
    try {
      const response = await window.api.mainDeleteStudent(id);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setStudents((prev) =>
        prev.filter((student) => student.id !== id)
      );
      Toast({
        message: "Student deleted successfully",
        variation: "success",
      });
      return response.success;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function updateStudent(
    id: string,
    student: Partial<MStudent>
  ) {
    setLoading(true);
    try {
      const response = await window.api.mainUpdateStudent([id, student]);
      if (!response.success) throw new Error(response.error);
      const data = await response.data;
      setStudents((prev) =>
        prev.map((student) => (student.id === id ? data : student))
      );
      Toast({
        message: "Student updated successfully",
        variation: "success",
      });
      return response.success;
    } catch (error) {
      Toast({ message: error.message, variation: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    (async () => {
      await listAllStudents();
    })();
  }, []);
  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        error,
        listAllStudents,
        createStudent,
        deleteStudent,
        updateStudent,
      }}>
      {children}
    </StudentContext.Provider>
  );
}
