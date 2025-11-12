<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FantasyLeague;

class FantasyLeagueController extends Controller
{
    // List all leagues (public)
    public function index()
    {
        return response()->json(FantasyLeague::all());
    }

    // Create a new league (admin only)
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|unique:fantasy_leagues,name',
    ]);

    $league = FantasyLeague::create([
        'name' => $request->name,
        'created_by' => $request->user()->id, // ✅ Automatically assign logged-in admin
    ]);

    return response()->json($league, 201);
}

}
