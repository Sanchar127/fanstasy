<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ------------------------------
        // Drop old table if exists
        // ------------------------------
        Schema::dropIfExists('fantasy_teams');

        // ------------------------------
        // Create fantasy_teams table
        // ------------------------------
        Schema::create('fantasy_teams', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Owner of team
            $table->unsignedBigInteger('match_id'); // Match reference
            $table->string('team_name');
            $table->integer('total_points')->default(0);
            $table->timestamps();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('match_id')->references('id')->on('matches')->onDelete('cascade');
        });

        // ------------------------------
        // Create fantasy_team_players table
        // ------------------------------
        Schema::create('fantasy_team_players', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fantasy_team_id');
            $table->unsignedBigInteger('player_id');

            // Role flags
            $table->boolean('is_playing_xi')->default(false);
            $table->boolean('is_bench')->default(false);
            $table->boolean('is_captain')->default(false);
            $table->boolean('is_vice_captain')->default(false);
            $table->integer('points')->default(0);

            $table->timestamps();

            // Foreign keys
            $table->foreign('fantasy_team_id')->references('id')->on('fantasy_teams')->onDelete('cascade');
            $table->foreign('player_id')->references('id')->on('players')->onDelete('cascade');

            // Prevent duplicate player for the same team
            $table->unique(['fantasy_team_id', 'player_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fantasy_team_players');
        Schema::dropIfExists('fantasy_teams');
    }
};
