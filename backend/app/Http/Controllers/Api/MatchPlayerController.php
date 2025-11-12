<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MatchPlayer;
use App\Models\Matches;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class MatchPlayerController extends Controller
{
    /**
     * Add or update players for a match
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'match_id' => 'required|exists:matches,id',
            'players' => 'required|array',
            'players.*.player_id' => 'required|exists:players,id',
            'players.*.is_playing_11' => 'boolean',
            'players.*.is_bench' => 'boolean',
        ]);

        $match = Matches::with(['teamA', 'teamB'])->findOrFail($validated['match_id']);

        $teamIds = [$match->teamA->id, $match->teamB->id];

        $benchCount = 0;
        $updatedPlayers = [];

        foreach ($validated['players'] as $playerData) {
            $player = Player::findOrFail($playerData['player_id']);

            if (!in_array($player->team_id, $teamIds)) {
                throw ValidationException::withMessages([
                    'player_id' => "Player {$player->name} does not belong to a team in this match."
                ]);
            }

            if (($playerData['is_bench'] ?? false) && $benchCount >= 3) {
                throw ValidationException::withMessages([
                    'players' => "You can only assign 3 players to the bench."
                ]);
            }

            if ($playerData['is_bench'] ?? false) {
                $benchCount++;
            }

            $matchPlayer = MatchPlayer::updateOrCreate(
                [
                    'match_id' => $match->id,
                    'player_id' => $player->id,
                    'team_id' => $player->team_id,
                ],
                [
                    'is_playing_11' => $playerData['is_playing_11'] ?? false,
                    'is_bench' => $playerData['is_bench'] ?? false,
                ]
            );

            // Collect info for logging
            $updatedPlayers[] = [
                'player_id' => $player->id,
                'player_name' => $player->name,
                'team_id' => $player->team_id,
                'is_playing_11' => $matchPlayer->is_playing_11,
                'is_bench' => $matchPlayer->is_bench,
            ];
        }

        // Log the action
        Log::info('Match players updated', [
            'match_id' => $match->id,
            'match_date' => $match->match_date,
            'updated_players' => $updatedPlayers,
            'updated_by_user_id' => $request->user()->id ?? null,
        ]);

        return response()->json([
            'message' => 'Match players updated successfully'
        ], 200);
    }

    /**
     * Get all players for a match
     */
    public function index($matchId)
    {
        $players = MatchPlayer::with('player', 'team')
            ->where('match_id', $matchId)
            ->get();

        return response()->json($players);
    }
}
