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
        Schema::create('teams', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->unsignedBigInteger('fantasy_league_id'); // manually define
    $table->foreign('fantasy_league_id')
          ->references('id')
          ->on('fantasy_leagues')
          ->onDelete('cascade');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
