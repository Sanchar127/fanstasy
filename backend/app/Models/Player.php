<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'team_id',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
    

    public function matchPlayers()
{
    return $this->hasMany(MatchPlayer::class);
}

public function matches()
{
    return $this->belongsToMany(Matches::class, 'match_players')
        ->withPivot('team_id')
        ->withTimestamps();
}

}
