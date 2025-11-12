<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TeamsController extends Controller
{
    /**
     * Store single or multiple teams for a fantasy league
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate request
        $request->validate([
            'fantasy_league_id' => 'required|exists:fantasy_leagues,id',
            'name' => 'sometimes|required|string',
            'teams' => 'sometimes|required|array|min:1',
            'teams.*.name' => 'required|string|distinct'
        ]);

        $userId = auth()->id(); // Logged-in user

        // --- Single team insert ---
        if ($request->has('name')) {

            $team = Team::create([
                'name' => $request->name,
                'fantasy_league_id' => $request->fantasy_league_id,
            ]);

            // ✅ Log the single team creation
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

            // ✅ Log bulk insert
            Log::info('Bulk teams created', [
                'user_id' => $userId,
                'fantasy_league_id' => $request->fantasy_league_id,
                'count' => count($teamsData),
                'teams' => $teamsData
            ]);

            return response()->json([
                'message' => 'Teams created successfully',
                'count' => count($teamsData),
                'teams' => $teamsData
            ], 201);
        }

        // ❌ Invalid request log
        Log::warning('Invalid team creation request', [
            'user_id' => $userId,
            'payload' => $request->all()
        ]);

        return response()->json(['error' => 'Invalid request.'], 400);
    }

    /**
     * List all teams
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
}
