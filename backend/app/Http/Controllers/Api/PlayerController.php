<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Player;
use App\Models\Team;

class PlayerController extends Controller
{
    // ✅ List all players
    public function index()
    {
        return response()->json(Player::with('team')->get());
    }

    // ✅ Create players (admin only)
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

    // ✅ Update a player
    public function update(Request $request, $id)
    {
        $player = Player::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string',
            'team_id' => 'sometimes|required|exists:teams,id',
            'role' => 'sometimes|required|string|in:WK,BAT,ALL,BOWL,AR',
        ]);

        $player->update($request->only(['name', 'team_id', 'role']));

        return response()->json([
            'message' => 'Player updated successfully',
            'player' => $player,
        ]);
    }

    // ✅ Delete a player
    public function destroy($id)
    {
        $player = Player::findOrFail($id);
        $player->delete();

        return response()->json([
            'message' => 'Player deleted successfully',
        ]);
    }
}
