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
// --------------------match-players
Route::middleware('auth:sanctum')->group(function () {

    // Get logged-in user profile
    Route::get('/user', [UserController::class, 'profile']);

    // Logout user
    Route::post('/logout', [AuthController::class, 'logout']);

    // --------------------
    // Admin-only routes
    // --------------------
    Route::middleware('role:admin')->group(function () {

     
Route::get('/leagues', [FantasyLeagueController::class, 'index']);       // List all leagues
Route::post('/leagues', [FantasyLeagueController::class, 'store']);      // Create new league
Route::put('/leagues/{leagueId}', [FantasyLeagueController::class, 'update']); // Update existing league
Route::delete('/leagues/{leagueId}', [FantasyLeagueController::class, 'destroy']); 
        // Teams
        Route::post('/teams', [TeamsController::class, 'store']);

        Route::get('/teams', [TeamsController::class, 'index']);           // ✅ List all teams
        Route::post('/teams', [TeamsController::class, 'store']);          // ✅ Create team(s)
        Route::put('/teams/{teamId}', [TeamsController::class, 'update']); // ✅ Update team
        Route::delete('/teams/{teamId}', [TeamsController::class, 'destroy']);

     
        // 🏏 Players
        Route::get('/players', [PlayerController::class, 'index']);
        Route::post('/players', [PlayerController::class, 'store']);
        Route::put('/players/{id}', [PlayerController::class, 'update']);
        Route::delete('/players/{id}', [PlayerController::class, 'destroy']);


        // Matches CRUD routes
        Route::get('/matches', [MatchController::class, 'index']);        // List all matches
        Route::get('/matches/{id}', [MatchController::class, 'show']);    // Get single match
        Route::post('/matches', [MatchController::class, 'store']);       // Create match
        Route::put('/matches/{id}', [MatchController::class, 'update']);  // Update match
        Route::delete('/matches/{id}', [MatchController::class, 'destroy']); // Delete match


        Route::post('/fantasy-team', [FantasyTeamController::class, 'store']);


        Route::post('/match-players', [MatchPlayerController::class, 'store']); // Add/update players
        Route::get('/match-players/{matchId}', [MatchPlayerController::class, 'index']); // Get players for a match

        Route::post('player-performance', [PlayerPerformanceController::class, 'store']);


        // Example admin-ofantassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssnly test
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
