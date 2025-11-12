<?php

use Illuminate\Support\Facades\Route;

// Root route
Route::get('/', function () {
    return view('welcome');
});

// ✨ CSRF cookie route required for SPA stateful auth
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json([], 204); // just returns 204 No Content
});
