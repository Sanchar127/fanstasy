<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PlayerPerformance;
use App\Models\MatchPlayer;

class PlayerPerformanceController extends Controller
{
    // Store or update a player's performance for a match
    public function store(Request $request)
{
    // If a single object is sent, wrap it in an array
    $data = $request->all();
    if (isset($data['match_player_id'])) {
        $data = [$data];
    }

    $performances = validator($data, [
        '*.match_player_id' => 'required|exists:match_players,id',
        '*.runs' => 'required|integer|min:0',
        '*.fours' => 'required|integer|min:0',
        '*.sixes' => 'required|integer|min:0',
        '*.balls_faced' => 'nullable|integer|min:0',
        '*.wickets' => 'required|integer|min:0',
        '*.lbw_or_bowled' => 'nullable|boolean',
        '*.maidens' => 'nullable|integer|min:0',
        '*.no_balls' => 'nullable|integer|min:0',
        '*.wides' => 'nullable|integer|min:0',
        '*.byes' => 'nullable|integer|min:0',
        '*.leg_byes' => 'nullable|integer|min:0',
        '*.catches' => 'nullable|integer|min:0',
        '*.stumpings' => 'nullable|integer|min:0',
        '*.run_outs' => 'nullable|integer|min:0',
    ])->validate();

    $results = [];

    foreach ($performances as $data) {
        $points = $this->calculateBattingPoints($data['runs'], $data['fours'], $data['sixes'])
            + $this->calculateBowlingPoints(
                $data['wickets'], $data['lbw_or_bowled'] ?? false,
                $data['maidens'] ?? 0, $data['no_balls'] ?? 0, $data['wides'] ?? 0
            )
            + $this->calculateFieldingPoints(
                $data['catches'] ?? 0, $data['stumpings'] ?? 0, $data['run_outs'] ?? 0
            );

        $results[] = PlayerPerformance::updateOrCreate(
            ['match_player_id' => $data['match_player_id']],
            array_merge($data, ['points' => $points])
        );
    }

    return response()->json($results, 201);
}


    private function calculateBattingPoints($runs, $fours, $sixes)
    {
        $points = $runs + ($fours * 1) + ($sixes * 2);
        if ($runs >= 30) $points += 4;
        if ($runs >= 50) $points += 8;
        if ($runs >= 100) $points += 16;
        if ($runs === 0) $points -= 2; // duck
        return $points;
    }

    private function calculateBowlingPoints($wickets, $lbwOrBowled, $maidens, $noBalls = 0, $wides = 0)
    {
        $points = $wickets * 25;
        if ($lbwOrBowled) $points += 8;
        if ($wickets >= 3) $points += 4;
        if ($wickets >= 4) $points += 8;
        if ($wickets >= 5) $points += 16;
        $points += $maidens * 12;
        $points -= $noBalls * 2; // penalty
        $points -= $wides;       // penalty
        return $points;
    }

    private function calculateFieldingPoints($catches, $stumpings, $runOuts)
    {
        return ($catches * 8) + ($stumpings * 12) + ($runOuts * 6);
    }
}

//i neeed profoance tables data for all playes  