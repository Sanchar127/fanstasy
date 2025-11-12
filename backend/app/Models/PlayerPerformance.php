<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerPerformance extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_player_id', 'runs', 'fours', 'sixes', 'balls_faced',
        'wickets', 'lbw_or_bowled', 'maidens', 'no_balls', 'wides', 'byes', 'leg_byes',
        'catches', 'stumpings', 'run_outs', 'points'
    ];

    // Relation to MatchPlayer
    public function matchPlayer()
    {
        return $this->belongsTo(MatchPlayer::class);
    }

    // Get the Player model via MatchPlayer
    public function player()
    {
        return $this->matchPlayer ? $this->matchPlayer->player : null;
    }

    // Get the Match model via MatchPlayer
    public function match()
    {
        return $this->matchPlayer ? $this->matchPlayer->match : null;
    }
}
