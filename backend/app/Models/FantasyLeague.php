<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FantasyLeague extends Model
{
    use HasFactory;

    // Mass assignable fields
    protected $fillable = [
        'name',
        'created_by'
    ];
    // Relationship: a league has many teams
    public function teams()
    {
        return $this->hasMany(Team::class, 'fantasy_league_id');
    }
}
