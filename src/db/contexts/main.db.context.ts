import { MainEventRepository } from "../repositories/main.event.repository";
import { MainHouseRepository } from "../repositories/main.house.repository";
import { SessionRepository } from "../repositories/session.repository";
import { StudentRepository } from "../repositories/student.repository";
import { Database } from "../sqlite";

export class MainDBContext {
  public session: SessionRepository;
  public event: MainEventRepository;
  public student: StudentRepository;
  public house: MainHouseRepository;
  constructor(db: Database) {
    this.event = new MainEventRepository(db);
    this.session = new SessionRepository(db);
    this.student = new StudentRepository(db);
    this.house = new MainHouseRepository(db);
  }
}
 