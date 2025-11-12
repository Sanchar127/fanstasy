<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('player_performances', function (Blueprint $table) {
            $table->id();

            // Link to match_player table
            $table->foreignId('match_player_id')->constrained('match_players')->cascadeOnDelete();

            // Batting
            $table->integer('runs')->default(0);
            $table->integer('fours')->default(0);
            $table->integer('sixes')->default(0);
            $table->integer('balls_faced')->default(0);

            // Bowling
            $table->integer('wickets')->default(0);
            $table->boolean('lbw_or_bowled')->default(false);
            $table->integer('maidens')->default(0);
            $table->integer('no_balls')->default(0);
            $table->integer('wides')->default(0);
            $table->integer('byes')->default(0);
            $table->integer('leg_byes')->default(0);

            // Fielding
            $table->integer('catches')->default(0);
            $table->integer('stumpings')->default(0);
            $table->integer('run_outs')->default(0);

            $table->integer('points')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('player_performances');
    }
};
