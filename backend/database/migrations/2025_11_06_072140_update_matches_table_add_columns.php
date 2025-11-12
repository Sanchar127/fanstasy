<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->unsignedBigInteger('fantasy_league_id')->after('id');
            $table->unsignedBigInteger('team_a_id')->after('fantasy_league_id');
            $table->unsignedBigInteger('team_b_id')->after('team_a_id');
            $table->dateTime('match_date')->after('team_b_id');
            $table->string('venue')->nullable()->after('match_date');

            // Foreign keys
            $table->foreign('fantasy_league_id')->references('id')->on('fantasy_leagues')->onDelete('cascade');
            $table->foreign('team_a_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('team_b_id')->references('id')->on('teams')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('matches', function (Blueprint $table) {
            $table->dropForeign(['fantasy_league_id']);
            $table->dropForeign(['team_a_id']);
            $table->dropForeign(['team_b_id']);

            $table->dropColumn(['fantasy_league_id', 'team_a_id', 'team_b_id', 'match_date', 'venue']);
        });
    }
};
