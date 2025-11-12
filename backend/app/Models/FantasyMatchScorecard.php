<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FantasyMatchScorecard extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'fantasy_match_scorecards';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'match_id',
        'points_list',
        'total_points',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'points_list' => 'array', // Automatically converts JSON to PHP array
        'total_points' => 'decimal:2',
    ];

    /**
     * Get the match associated with this scorecard.
     */
    public function match()
    {
        return $this->belongsTo(Matches::class, 'match_id');
    }

    /**
     * Get the player associated with this scorecard.
     */

}




