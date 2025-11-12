<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fantasy_teams', function (Blueprint $table) {
            // Drop the old 'players' column
            $table->dropColumn('players');

            // Add new columns
            $table->json('playing_11')->after('user_id'); // First 11 players
            $table->json('bench_players')->nullable()->after('playing_11'); // Bench players
        });
    }

    public function down(): void
    {
        Schema::table('fantasy_teams', function (Blueprint $table) {
            // Rollback: remove new columns
            $table->dropColumn(['playing_11', 'bench_players']);

            // Restore old 'players' column
            $table->json('players')->after('user_id');
        });
    }
};
