<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Middleware\HandleCors; // ✅ use this instead


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // 1. Ensure CORS middleware runs first in the 'web' group (for csrf-cookie)
      $middleware->web(prepend: [
    HandleCors::class, // Laravel built-in
]);

        // 2. Sanctum API session support
        $middleware->group('api', [
            EnsureFrontendRequestsAreStateful::class,
        ]);

        // 3. Role Middleware alias
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();