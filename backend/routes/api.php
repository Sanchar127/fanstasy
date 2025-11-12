<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FantasyLeagueController;
use App\Http\Controllers\Api\PlayerController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\TeamsController; // ✅ correct impor
use App\Http\Controllers\Api\FantasyTeamController;
use App\Http\Controllers\Api\MatchPlayerController;
use App\Http\Controllers\Api\PlayerPerformanceController;
// --------------------
// Public routes
// --------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --------------------
// Protected routes (requires auth:sanctum)
// --------------------
Route::middleware('auth:sanctum')->group(function () {

    // Get logged-in user profile
    Route::get('/user', [UserController::class, 'profile']);

    // Logout user
    Route::post('/logout', [AuthController::class, 'logout']);

    // --------------------
    // Admin-only routes
    // --------------------
    Route::middleware('role:admin')->group(function () {

        // Fantasy League
        Route::post('/leagues', [FantasyLeagueController::class, 'store']);

        // Teams
        Route::post('/teams', [TeamsController::class, 'store']);

        // Players
        Route::post('/players', [PlayerController::class, 'store']);

        // Matches
        Route::post('/matches', [MatchController::class, 'store']);
        Route::post('/fantasy-team', [FantasyTeamController::class, 'store']);


        Route::post('/match-players', [MatchPlayerController::class, 'store']); // Add/update players
        Route::get('/match-players/{matchId}', [MatchPlayerController::class, 'index']); // Get players for a match

        Route::post('player-performance', [PlayerPerformanceController::class, 'store']);


        // Example admin-only test
        Route::get('/admin-only', function () {
            return response()->json(['message' => 'Welcome Admin']);
        });
    });

    // --------------------
    // User-only routes
    // --------------------
    Route::get('/user-only', function () {
        return response()->json(['message' => 'Welcome User']);
    })->middleware('role:user');

    // --------------------
    // Public GET endpoints for everyone (optional)
    // --------------------
    Route::get('/leagues', [FantasyLeagueController::class, 'index']);
    Route::get('/teams', [TeamsController::class, 'index']);
    Route::get('/players', [PlayerController::class, 'index']);
    Route::get('/matches', [MatchController::class, 'index']);
});
