<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Player;
use App\Models\Team;

class PlayerController extends Controller
{
    // List all players
    public function index()
    {
        return response()->json(Player::with('team')->get());
    }

    // Create a player (admin only)
 public function store(Request $request)
{
    $request->validate([
        'team_id' => 'required|exists:teams,id',
        'players' => 'required|array|min:1',
        'players.*.name' => 'required|string',
        'players.*.role' => 'required|string|in:WK,BAT,ALL,BOWL,AR',
    ]);

    $team = Team::findOrFail($request->team_id);

    $createdPlayers = [];
    foreach ($request->players as $playerData) {
        $player = Player::create([
            'name' => $playerData['name'],
            'team_id' => $team->id,
            'role' => $playerData['role'],
        ]);
        $createdPlayers[] = $player;
    }

    return response()->json([
        'message' => 'Players added successfully',
        'players' => $createdPlayers,
    ], 201);
}

}
