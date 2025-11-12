<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fantasy_teams', function (Blueprint $table) {
            $table->unsignedBigInteger('match_id')->after('user_id');

            $table->foreign('match_id')
                  ->references('id')
                  ->on('matches')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('fantasy_teams', function (Blueprint $table) {
            $table->dropForeign(['match_id']);
            $table->dropColumn('match_id');
        });
    }
};
