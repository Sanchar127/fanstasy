<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Matches;

class MatchController extends Controller
{
    // List all matches
    public function index()
    {
        return response()->json(Matches::with(['league', 'teamA', 'teamB'])->get());
    }

    // Create a match
    public function store(Request $request)
    {
        $request->validate([
            'fantasy_league_id' => 'required|exists:fantasy_leagues,id',
            'team_a_id' => 'required|exists:teams,id',
            'team_b_id' => 'required|exists:teams,id',
            'match_date' => 'required|date',
            'venue' => 'nullable|string',
        ]);

        $match = Matches::create([
    'fantasy_league_id' => $request->fantasy_league_id,
    'team_a_id' => $request->team_a_id,
    'team_b_id' => $request->team_b_id,
    'match_date' => $request->match_date,
    'venue' => $request->venue,
]);

        return response()->json($match, 201);
    }
}
