<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // ----------------------
    // Get logged-in user profile
    // ----------------------
    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}
