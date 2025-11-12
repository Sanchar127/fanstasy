<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FantasyTeam;
use App\Models\Player;
use App\Models\Matches;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FantasyTeamController extends Controller
{
    /**
     * Store a newly created fantasy team in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // 1. Validate Input - Added 'team_name' as required field.
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'match_id' => 'required|exists:matches,id',
                'team_name' => 'required|string|max:100', // NEW: Added required field based on DB error
                'playing_11' => 'required|array|size:11',
                'playing_11.*' => 'exists:players,id',
                'bench_players' => 'required|array|size:3',
                'bench_players.*' => 'exists:players,id',
                'captain' => 'required|exists:players,id',
                'vice_captain' => 'required|exists:players,id',
            ]);

            $userId = $validated['user_id'];
            $matchId = $validated['match_id'];
            $teamName = $validated['team_name']; // NEW: Extracted team name
            $playing11Ids = $validated['playing_11'];
            $benchIds = $validated['bench_players'];
            $captainId = $validated['captain'];
            $viceCaptainId = $validated['vice_captain'];

            // 2. Prevent multiple submissions
            if (FantasyTeam::where('user_id', $userId)->where('match_id', $matchId)->exists()) {
                return response()->json(['message' => 'You have already submitted a team for this match.'], 400);
            }

            // 3. Validate all selected players belong to the correct match teams
            $match = Matches::findOrFail($matchId);
            $allowedTeamIds = [$match->team_a_id, $match->team_b_id];
            $allSelectedIds = array_merge($playing11Ids, $benchIds);

            $players = Player::whereIn('id', $allSelectedIds)
                             ->whereIn('team_id', $allowedTeamIds)
                             ->get();

            if ($players->count() != 14) {
                return response()->json(['message' => 'All 14 players must be valid and from the two teams playing.'], 400);
            }

            // 4. Validate captain & vice-captain are in playing XI
            if (!in_array($captainId, $playing11Ids)) {
                return response()->json(['message' => 'Captain must be in the playing 11.'], 400);
            }
            if (!in_array($viceCaptainId, $playing11Ids)) {
                return response()->json(['message' => 'Vice-captain must be in the playing 11.'], 400);
            }

            // 5. Validate team composition (roles, max players from same team)
            $this->validateTeamComposition($players, $playing11Ids);

            // 6. Create Fantasy Team Record - Added 'team_name'
            $fantasyTeam = FantasyTeam::create([
                'user_id' => $userId,
                'match_id' => $matchId,
                'team_name' => $teamName, // NEW: Insert team name
                'total_points' => 0,
            ]);

            $playerData = [];

            // 7. Prepare and Attach players to the pivot table
            foreach ($allSelectedIds as $playerId) {
                $isCaptain = ($playerId == $captainId);
                $isViceCaptain = ($playerId == $viceCaptainId);
                $isPlayingXi = in_array($playerId, $playing11Ids);
                $isBench = in_array($playerId, $benchIds);

                $playerData[$playerId] = [
                    'is_playing_xi' => $isPlayingXi,
                    'is_bench' => $isBench,
                    'is_captain' => $isCaptain,
                    'is_vice_captain' => $isViceCaptain,
                    'points' => 0,
                ];
            }

            // Use sync or attach once for better performance
            $fantasyTeam->players()->sync($playerData);

            // 8. Return Success Response
            return response()->json([
                'message' => 'Fantasy team added successfully',
                'team' => $fantasyTeam->load('players')
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Log the detailed error
            \Log::error('Fantasy Team Store Error: ' . $e->getMessage());
            return response()->json(['message' => 'An unexpected error occurred.', 'error_detail' => $e->getMessage()], 500);
        }
    }


    /**
     * Validates the composition rules for the full squad and the playing XI.
     *
     * @param \Illuminate\Support\Collection $players
     * @param array $playing11Ids
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    private function validateTeamComposition($players, $playing11Ids)
    {
        $rolesCount = ['WK' => 0, 'BAT' => 0, 'ALL' => 0, 'BOWL' => 0];
        $playingRolesCount = ['WK' => 0, 'BAT' => 0, 'ALL' => 0, 'BOWL' => 0];

        foreach ($players as $player) {
            $rolesCount[$player->role]++;
            if (in_array($player->id, $playing11Ids)) {
                $playingRolesCount[$player->role]++;
            }
        }

        // --- Full Team (14 Players) Validation ---
        if ($rolesCount['WK'] < 2) abort(400, 'Full team must have at least 2 wicket keepers.');
        if ($rolesCount['BAT'] < 2 || $rolesCount['BAT'] > 6) abort(400, 'Full team must have 2-6 batters.');
        if ($rolesCount['BOWL'] < 2 || $rolesCount['BOWL'] > 6) abort(400, 'Full team must have 2-6 bowlers.');
        if ($rolesCount['ALL'] < 2 || $rolesCount['ALL'] > 5) abort(400, 'Full team must have 2-5 all-rounders.');

        // --- Playing XI (11 Players) Validation ---
        if ($playingRolesCount['WK'] < 1 || $playingRolesCount['WK'] > 2) abort(400, 'Playing 11 must have 1-2 wicket keepers.');
        if ($playingRolesCount['BAT'] < 2 || $playingRolesCount['BAT'] > 5) abort(400, 'Playing 11 must have 2-5 batters.');
        if ($playingRolesCount['BOWL'] < 2 || $playingRolesCount['BOWL'] > 6) abort(400, 'Playing 11 must have 2-6 bowlers.');
        if ($playingRolesCount['ALL'] < 2 || $playingRolesCount['ALL'] > 5) abort(400, 'Playing 11 must have 2-5 all-rounders.');

        // --- Max Players from Same Team (Corrected Logic) ---
        $teamCounts = $players->groupBy('team_id')->map->count();
        foreach ($teamCounts as $count) {
            // Changed the condition from $count > 8 to $count > 7 to enforce Max 7 based on the error message.
            if ($count > 7) abort(400, 'Cannot select more than 7 players from the same team.');
        }
    }

    // The index and getUserTeamForMatch methods remain unchanged.

    public function index()
    {
        return FantasyTeam::with(['user', 'match'])->get();
    }

    public function getUserTeamForMatch($userId, $matchId)
    {
        $team = FantasyTeam::where('user_id', $userId)
                           ->where('match_id', $matchId)
                           ->with('match')
                           ->first();

        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        return response()->json($team);
    }
}