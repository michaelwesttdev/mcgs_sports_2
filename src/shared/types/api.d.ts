import { TournamentGroup, TournamentMatch, TournamentPlayer, TournamentPlayerStat, TournamentRound, TournamentTeam } from "@/db/sqlite/tournaments/schema"
import { SessionSettings, Settings } from "../settings"

export type FetchSessionSettingsArgs = { type: "main" | "session", sessionId?: string }
export type UpdateSessionSettingsArgs = {
    settings: Partial<Settings>|Partial<SessionSettings>,
    type: "main" | "session",
    sessionId?: string
}

export type TournamentTeamCompound = TournamentTeam &{
    players:(TournamentPlayer&{
        stats:TournamentPlayerStat[]
    })[]
}
export type TournamentGroupCompund = TournamentGroup&{
    rounds:(TournamentRound&{matches:(
        TournamentMatch&{
            teams:TournamentTeam[]
        }
    )[]})[]
}