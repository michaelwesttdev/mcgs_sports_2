import { Database } from "../sqlite";
import { Student,MStudent } from "../sqlite/main/schema";
import { BaseRepository } from "./base.repository";

export class StudentRepository extends BaseRepository<MStudent> {
  constructor(db: Database) {
    super(db, Student);
  }
  // Additional methods specific to StudentRepository
}
