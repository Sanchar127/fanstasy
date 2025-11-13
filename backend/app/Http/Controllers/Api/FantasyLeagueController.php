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
            'created_by' => $request->user()->id, // Assign logged-in admin
        ]);

        return response()->json($league, 201);
    }

    // Update an existing league
    public function update(Request $request, $id)
    {
        $league = FantasyLeague::findOrFail($id);

        $request->validate([
            'name' => 'required|string|unique:fantasy_leagues,name,' . $league->id,
        ]);

        $league->update([
            'name' => $request->name,
        ]);

        return response()->json($league);
    }

    // Delete a league
    public function destroy($id)
    {
        $league = FantasyLeague::findOrFail($id);
        $league->delete();

        return response()->json(['message' => 'League deleted successfully']);
    }
}
