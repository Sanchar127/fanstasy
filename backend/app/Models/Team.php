<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'fantasy_league_id',
    ];

    public function league()
    {
        return $this->belongsTo(FantasyLeague::class, 'fantasy_league_id');
    }

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function matchPlayers()
{
    return $this->hasMany(MatchPlayer::class);
}

}
