<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fantasy_teams', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // User who owns the team
            $table->json('players'); // Store player names as JSON
            $table->string('captain');
            $table->string('vice_captain');
            $table->json('points_list')->nullable(); // Optional points data
            $table->integer('total_points')->default(0);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fantasy_teams');
    }
};
