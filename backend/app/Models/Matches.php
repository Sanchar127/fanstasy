<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    use HasFactory;

    protected $fillable = [
        'fantasy_league_id',
        'team_a_id',
        'team_b_id',
        'match_date',
        'venue',
    ];

    public function league()
    {
        return $this->belongsTo(FantasyLeague::class, 'fantasy_league_id');
    }

    public function teamA()
    {
        return $this->belongsTo(Team::class, 'team_a_id');
    }

    public function teamB()
    {
        return $this->belongsTo(Team::class, 'team_b_id');
    }


    public function matchPlayers()
{
    return $this->hasMany(MatchPlayer::class);
}

public function players()
{
    return $this->belongsToMany(Player::class, 'match_players')
        ->withPivot('team_id')
        ->withTimestamps();
}

}
