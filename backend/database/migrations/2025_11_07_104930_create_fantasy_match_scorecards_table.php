<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fantasy_match_scorecards', function (Blueprint $table) {
            $table->id();
            
            // Foreign key relating to the Matches table
            $table->foreignId('match_id')
                  ->constrained('matches')
                  ->onDelete('cascade')
                  ->comment('The ID of the match this scorecard is for.');
            
            // Foreign key relating to the Players table
   
            // JSON column to store the detailed breakdown of points (e.g., runs, wickets, catches)
            $table->json('points_list')->comment('Detailed breakdown of points earned by category.');
            
            // The final calculated base points for the player in the match
            $table->decimal('total_points', 8, 2)
                  ->unsigned()
                  ->default(0.00)
                  ->comment('The final base fantasy points earned by the player.');

            // Ensures a player only has one final scorecard entry per match
          
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fantasy_match_scorecards');
    }
};
