<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FantasyTeam extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'match_id',
        'team_name',
        'total_points',
    ];

    // ---------------------------
    // Relationships
    // ---------------------------

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function match()
    {
        return $this->belongsTo(Matches::class);
    }

    public function players()
    {
        return $this->belongsToMany(Player::class, 'fantasy_team_players')
                    ->withPivot('is_playing_xi', 'is_bench', 'is_captain', 'is_vice_captain', 'points')
                    ->withTimestamps();
    }

    // ---------------------------
    // Helper Scopes
    // ---------------------------

    public function playingXI()
    {
        return $this->players()->wherePivot('is_playing_xi', true);
    }

    public function benchPlayers()
    {
        return $this->players()->wherePivot('is_bench', true);
    }

    public function captain()
    {
        return $this->players()->wherePivot('is_captain', true)->first();
    }

    public function viceCaptain()
    {
        return $this->players()->wherePivot('is_vice_captain', true)->first();
    }
}
