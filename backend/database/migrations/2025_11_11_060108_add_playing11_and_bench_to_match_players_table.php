<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('match_players', function (Blueprint $table) {
            // Add a column to indicate if the player is in the playing 11
            $table->boolean('is_playing_11')->default(false);

            // Add a column to indicate if the player is a bench player
            $table->boolean('is_bench')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('match_players', function (Blueprint $table) {
            $table->dropColumn(['is_playing_11', 'is_bench']);
        });
    }
};
