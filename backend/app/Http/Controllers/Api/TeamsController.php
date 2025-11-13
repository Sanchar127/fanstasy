<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TeamsController extends Controller
{
    /**
     * List all teams with their associated fantasy league
     */
    public function index()
    {
        $teams = Team::with('league')->get();

        Log::info('Teams list retrieved', [
            'user_id' => auth()->id(),
            'count' => $teams->count()
        ]);

        return response()->json($teams);
    }

    /**
     * Store single or multiple teams for a fantasy league
     */
    public function store(Request $request)
    {
        $request->validate([
            'fantasy_league_id' => 'required|exists:fantasy_leagues,id',
            'name' => 'sometimes|required|string',
            'teams' => 'sometimes|required|array|min:1',
            'teams.*.name' => 'required|string|distinct'
        ]);

        $userId = auth()->id();

        // --- Single team insert ---
        if ($request->has('name')) {
            $team = Team::create([
                'name' => $request->name,
                'fantasy_league_id' => $request->fantasy_league_id,
            ]);

            Log::info('Single team created', [
                'user_id' => $userId,
                'team_id' => $team->id,
                'team_name' => $team->name,
                'fantasy_league_id' => $team->fantasy_league_id,
            ]);

            return response()->json([
                'message' => 'Team created successfully',
                'team' => $team
            ], 201);
        }

        // --- Bulk insert ---
        if ($request->has('teams')) {
            $teamsData = [];
            foreach ($request->teams as $team) {
                $teamsData[] = [
                    'name' => $team['name'],
                    'fantasy_league_id' => $request->fantasy_league_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            Team::insert($teamsData);

            Log::info('Bulk teams created', [
                'user_id' => $userId,
                'fantasy_league_id' => $request->fantasy_league_id,
                'count' => count($teamsData),
            ]);

            return response()->json([
                'message' => 'Teams created successfully',
                'count' => count($teamsData),
                'teams' => $teamsData
            ], 201);
        }

        return response()->json(['error' => 'Invalid request.'], 400);
    }

    /**
     * Update a specific team
     */
    public function update(Request $request, $teamId)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $team = Team::find($teamId);

        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }

        $team->update(['name' => $request->name]);

        Log::info('Team updated', [
            'user_id' => auth()->id(),
            'team_id' => $team->id,
            'new_name' => $team->name,
        ]);

        return response()->json([
            'message' => 'Team updated successfully',
            'team' => $team
        ]);
    }

    /**
     * Delete a team
     */
    public function destroy($teamId)
    {
        $team = Team::find($teamId);

        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }

        $team->delete();

        Log::info('Team deleted', [
            'user_id' => auth()->id(),
            'team_id' => $teamId,
        ]);

        return response()->json(['message' => 'Team deleted successfully']);
    }
}
