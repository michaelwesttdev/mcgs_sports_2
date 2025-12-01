import { MainDBContext } from "@/db/contexts/main.db.context";
import { PerformanceSportsDBContext } from "@/db/contexts/perfomance_sports.db.context";
import { TournamentsDBContext } from "@/db/contexts/tournaments.db.context";
import { BaseRepository } from "@/db/repositories/base.repository";
import { Database, initDb } from "@/db/sqlite";
import { RepositoryError } from "@/errors/repository.error";
import {
  DialogProperties,
  IpcChannel,
  PerfomanceSportsChannel,
  TeamSportsChannel,
  TournamentChannel,
} from "@/shared/types/electron.main";
import { BrowserWindow, dialog, ipcMain } from "electron";
import * as PsSchema from "@/db/sqlite/p_sports/schema";
import * as TsSchema from "@/db/sqlite/t_sports/schema";
import * as TournamentSchema from "@/db/sqlite/tournaments/schema";
import { getSessionDbPath } from "@/shared/helpers/urls";
import { SettingsHandler } from "@/main/handlers/settingsHandler";
import { defaultSettings as settings } from "@/shared/settings";
import fs from 'fs/promises'
import { TeamSportsDBContext } from "@/db/contexts/team_sports.db.context";

export class MainHandler {
  private sessionsContexts: Map<
    string,
    {
      db: Database;
      context: PerformanceSportsDBContext | TeamSportsDBContext | TournamentsDBContext | MainDBContext;
    }
  > = new Map();
  constructor(private db: MainDBContext) { }

  createMainCrudHandler<T>(
    context: "main",
    repoKey: keyof MainDBContext,
    operation: keyof BaseRepository<T>
  ) {
    const channel = `${context}:${repoKey}:${operation}` as IpcChannel;
    ipcMain.handle(channel, async (_, ...args: any[]) => {
      console.log("handling:", channel, "args:", args);
      try {
        const repo = this.db[repoKey] as any;
        const result = await repo[operation](...args);
        return { success: true, data: result };
      } catch (error) {
        this.handleError(error);
      }
    });
  }
  registerMainHandlers() {
    this.registerMainRepositoryHandlers();
    this.registerPerfomanceSportsHandlers();
    this.registerTeamSportsHandlers();
    this.registerTournamentHandlers();
    this.registerCustomHandlers();
  }
  registerMainRepositoryHandlers() {
    const repositories: (keyof MainDBContext)[] = [
      "session",
      "event",
      "student",
      "house"
    ];
    repositories.forEach((repoKey) => {
      this.createMainCrudHandler("main", repoKey, "list");
      this.createMainCrudHandler("main", repoKey, "read");
      this.createMainCrudHandler("main", repoKey, "create");
      this.createMainCrudHandler("main", repoKey, "update");
      this.createMainCrudHandler("main", repoKey, "delete");
    });
  }
  registerPerfomanceSportsHandlers() {
    const channels: PerfomanceSportsChannel[] = [
      "ps:event:create",
      "ps:event:read",
      "ps:event:update",
      "ps:event:delete",
      "ps:event:list",
      "ps:house:create",
      "ps:house:read",
      "ps:house:update",
      "ps:house:delete",
      "ps:house:list",
      "ps:participant:create",
      "ps:participant:read",
      "ps:participant:update",
      "ps:participant:delete",
      "ps:participant:list",
      "ps:event_result:create",
      "ps:event_result:read",
      "ps:event_result:update",
      "ps:event_result:delete",
      "ps:event_result:list",
    ];

    channels.forEach((channel) => {
      ipcMain.handle(channel, async (_, ...args: any[]) => {
        console.log("handling PS:", channel, "args:", args);
        try {
          const [_, repoKey, operation] = channel.split(":") as [
            string,
            keyof PerformanceSportsDBContext,
            keyof BaseRepository<any>
          ];
          const [sessionId, data] = args;
          console.log("found sessionId:", sessionId);
          console.log("found data:", data);
          let context = this.sessionsContexts.get(sessionId).context;
          if (!context) {
            const db = initDb({
              schema: PsSchema,
              dbPath: getSessionDbPath(sessionId),
              migrate: true,
              migrationsPath: `${__dirname}/p_sports/drizzle`,
            });
            const newContext = new PerformanceSportsDBContext(db);
            this.sessionsContexts.set(sessionId, {
              db,
              context: newContext,
            });
            context = newContext;
          }
          console.log("found context");
          const repo = context[repoKey as never] as any;
          console.log("found repo");
          const result = await repo[operation](data);
          console.log("result:", result);

          return { success: true, data: result };
        } catch (error) {
          this.handleError(error);
        }
      });
    });
  }
  registerTeamSportsHandlers() {
    const channels: TeamSportsChannel[] = [
      "ts:team:create",
      "ts:team:read",
      "ts:team:update",
      "ts:team:delete",
      "ts:team:list",
      "ts:player:create",
      "ts:player:read",
      "ts:player:update",
      "ts:player:delete",
      "ts:player:list",
      "ts:fixture:create",
      "ts:fixture:read",
      "ts:fixture:update",
      "ts:fixture:delete",
      "ts:fixture:list",
      "ts:fixture_event:create",
      "ts:fixture_event:read",
      "ts:fixture_event:update",
      "ts:fixture_event:delete",
      "ts:fixture_event:list",
      "ts:fixture_participant:create",
      "ts:fixture_participant:read",
      "ts:fixture_participant:update",
      "ts:fixture_participant:delete",
      "ts:fixture_participant:list",
      "ts:player_fixture_stats:create",
      "ts:player_fixture_stats:read",
      "ts:player_fixture_stats:update",
      "ts:player_fixture_stats:delete",
      "ts:player_fixture_stats:list",
    ];

    channels.forEach((channel) => {
      ipcMain.handle(channel, async (_, ...args: any[]) => {
        console.log("handling TS:", channel, "args:", args);
        try {
          const [_, repoKey, operation] = channel.split(":") as [
            string,
            keyof TeamSportsDBContext,
            keyof BaseRepository<any>
          ];
          const [sessionId, data] = args;
          console.log("found sessionId:", sessionId);
          console.log("found data:", data);
          let context = this.sessionsContexts.get(sessionId).context;
          console.log("Context:",Object.keys(context||null))
          if (!context) {
            const db = initDb({
              schema: TsSchema,
              dbPath: getSessionDbPath(sessionId),
              migrate: true,
              migrationsPath: `${__dirname}/t_sports/drizzle`,
            });
            const newContext = new TeamSportsDBContext(db);
            this.sessionsContexts.set(sessionId, {
              db,
              context: newContext,
            });
            context = newContext;
          }
          const repo = context[repoKey as never] as any;
          if(!repo){
            throw new Error("repo not found")
          }
          console.log("found repo");
          const result = await repo[operation](data);
          console.log("result:", result);

          return { success: true, data: result };
        } catch (error) {
          this.handleError(error);
        }
      });
    });
  }
  registerTournamentHandlers() {
    const channels: TournamentChannel[] = [
      "tournament:team:create",
      "tournament:team:read",
      "tournament:team:update",
      "tournament:team:delete",
      "tournament:team:list",
      "tournament:player:create",
      "tournament:player:read",
      "tournament:player:update",
      "tournament:player:delete",
      "tournament:player:list",
      "tournament:group:create",
      "tournament:group:read",
      "tournament:group:update",
      "tournament:group:delete",
      "tournament:group:list",
      "tournament:group_team:create",
      "tournament:group_team:read",
      "tournament:group_team:update",
      "tournament:group_team:delete",
      "tournament:group_team:list",
      "tournament:round:create",
      "tournament:round:read",
      "tournament:round:update",
      "tournament:round:delete",
      "tournament:round:list",
      "tournament:match:create",
      "tournament:match:read",
      "tournament:match:update",
      "tournament:match:delete",
      "tournament:match:list",
      "tournament:match_participant:create",
      "tournament:match_participant:read",
      "tournament:match_participant:update",
      "tournament:match_participant:delete",
      "tournament:match_participant:list",
      "tournament:player_stat:create",
      "tournament:player_stat:read",
      "tournament:player_stat:update",
      "tournament:player_stat:delete",
      "tournament:player_stat:list",
    ];

    channels.forEach((channel) => {
      ipcMain.handle(channel, async (_, ...args: any[]) => {
        console.log("handling TS:", channel, "args:", args);
        try {
          const [_, repoKey, operation] = channel.split(":") as [
            string,
            keyof TournamentsDBContext,
            keyof BaseRepository<any>
          ];
          const [sessionId, data] = args;
          console.log("found sessionId:", sessionId);
          console.log("found data:", data);
          let context = this.sessionsContexts.get(sessionId)?.context;
          if (!context) {
            const db = initDb({
              schema: TournamentSchema,
              dbPath: getSessionDbPath(sessionId),
              migrate: true,
              migrationsPath: `${__dirname}/tournaments/drizzle`,
            });
            const newContext = new TournamentsDBContext(db);
            this.sessionsContexts.set(sessionId, {
              db,
              context: newContext,
            });
            context = newContext;
          }
          const repo = context[repoKey as never] as any;
          if(!repo){
            throw new Error("repo not found")
          }
          console.log("found repo");
          const result = await repo[operation](data);
          console.log("result:", result);

          return { success: true, data: result };
        } catch (error) {
          this.handleError(error);
        }
      });
    });
  }
  /* registerTournamentHandlers() {
    const channels: TournamentChannel[] = [
      "tournament:team:create",
      "tournament:team:read",
      "tournament:team:update",
      "tournament:team:delete",
      "tournament:team:list",
      "tournament:player:create",
      "tournament:player:read",
      "tournament:player:update",
      "tournament:player:delete",
      "tournament:player:list",
      "tournament:group:create",
      "tournament:group:read",
      "tournament:group:update",
      "tournament:group:delete",
      "tournament:group:list",
      "tournament:group_team:create",
      "tournament:group_team:read",
      "tournament:group_team:update",
      "tournament:group_team:delete",
      "tournament:group_team:list",
      "tournament:round:create",
      "tournament:round:read",
      "tournament:round:update",
      "tournament:round:delete",
      "tournament:round:list",
      "tournament:match:create",
      "tournament:match:read",
      "tournament:match:update",
      "tournament:match:delete",
      "tournament:match:list",
      "tournament:match_participant:create",
      "tournament:match_participant:read",
      "tournament:match_participant:update",
      "tournament:match_participant:delete",
      "tournament:match_participant:list",
      "tournament:player_stat:create",
      "tournament:player_stat:read",
      "tournament:player_stat:update",
      "tournament:player_stat:delete",
      "tournament:player_stat:list",
    ];

    channels.forEach((channel) => {
      ipcMain.handle(channel, async (_, ...args: any[]) => {
        console.log("handling Tournament:", channel, "args:", args);
        try {
          const [_, repoKey, operation] = channel.split(":") as [
            string,
            keyof TournamentsDBContext,
            keyof BaseRepository<any>
          ];
          const [sessionId, data] = args;
          console.log("found sessionId:", sessionId);
          console.log("found data:", data);
          let context = this.sessionsContexts.get(sessionId)?.context;
          console.log("Context:",Object.keys(context||null))
          if (!context) {
            const db = initDb({
              schema: TournamentSchema,
              dbPath: getSessionDbPath(sessionId),
              migrate: true,
              migrationsPath: `${__dirname}/tournaments/drizzle`,
            });
            const newContext = new TournamentsDBContext(db);
            this.sessionsContexts.set(sessionId, {
              db,
              context: newContext,
            });
            context = newContext;
          }
          const repo = context[repoKey as never] as any;
          if(!repo){
            throw new Error("repo not found")
          }
          console.log("found repo");
          const result = await repo[operation](data);
          console.log("result:", result);

          return { success: true, data: result };
        } catch (error) {
          this.handleError(error);
        }
      });
    });
  } */
  registerCustomHandlers() {
    ipcMain.handle("session:createDbContext", async (_, args: {sessionId:string,sessionType:"team"|"performance"|"tournament"}) => {
      console.log("creating db context for session:", args);
      try {
        const context = this.sessionsContexts.get(args.sessionId);
        if (context) {
          return { success: true };
        }
        const dbPath = getSessionDbPath(args.sessionId);
        const migrationsPath = args.sessionType==="tournament"?`${__dirname}/tournaments/drizzle`:`${__dirname}/${args.sessionType==="team"?"t":"p"}_sports/drizzle`;
        console.log("migrationsPath:", migrationsPath);
        console.log("dbPath:", dbPath);
        const db = initDb({
          schema:args.sessionType==="team"?TsSchema: args.sessionType==="tournament"?TournamentSchema:PsSchema,
          dbPath: dbPath,
          migrate: true,
          migrationsPath: migrationsPath,
        });

        let c;
        if(args.sessionType==="team"){
          c = new TeamSportsDBContext(db)
        }else if(args.sessionType==="tournament"){
          c = new TournamentsDBContext(db)
        }else{
          new PerformanceSportsDBContext(db)
        }
        this.sessionsContexts.set(args.sessionId, {
          db,
          context: c,
        });
        return { success: true };
      } catch (error) {
        this.handleError(error);
      }
    });
    ipcMain.handle("session:closeDbContext", async (_, args: string) => {
      try {
        const context = this.sessionsContexts.get(args);
        if (!context) {
          return { success: true };
        }
        context.db.close();
        this.sessionsContexts.delete(args);
        return { success: true };
      } catch (error) {
        this.handleError(error);
      }
    });
    const settingsHandler = new SettingsHandler(settings, this.handleError);
    settingsHandler.registerHandlers();
    ipcMain.handle('printHTML', async (event, { html, deviceName, silent }) => {
      const win = new BrowserWindow({
        show: false,
        webPreferences: { offscreen: true }
      });

      await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

      return new Promise((resolve, reject) => {
        win.webContents.print({
          silent: silent ?? false,
          deviceName: deviceName || '', // use default if not provided
          printBackground: true
        }, (success, errorType) => {
          win.close();
          if (!success) reject(new Error(errorType));
          else resolve(true);
        });
      });
    });
    ipcMain.handle("export:csv", async (_, args: { data: string, filename: string }) => {
      const { data, filename } = args;
      try {
        const folderPath = await this.getFolderPathUrl("export");
        if (!folderPath) {
          throw new Error("No folder specified.")
        }
        await fs.writeFile(`${folderPath}/${filename}`, data);
        return { success: true, error: null }
      } catch (error) {
        return this.handleError(error);
      }
    })
  }

  private async getFolderPathUrl(operation: "export" | "import") {
    try {
      const properties: DialogProperties = operation === "export" ? ["openDirectory", "createDirectory"] : ["openDirectory"];
      const result = await dialog.showOpenDialog({
        properties,
        title: `Select a folder to ${operation} to.`
      });
      if (!result.canceled) {
        return result.filePaths[0]
      }
      return null;
    } catch (error) {
      console.error(error)
      return null;
    }
  }


  private handleError(error: any) {
    console.log("error: ", error);
    if (error instanceof RepositoryError) {
      return {
        success: false,
        error: error.message,
        ...(error.originalError
          ? { details: error.originalError.toString() }
          : {}),
      };
    }
    return {
      success: false,
      error: "An unknown error occurred",
      ...(error instanceof Error ? { details: error.message } : {}),
    };
  }
}
