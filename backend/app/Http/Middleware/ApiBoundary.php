<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiBoundary
{
    public function handle(Request $request, Closure $next)
    {
        $isMedia = $request->is('api/v1/me/media');
        $limit = $isMedia ? 8 * 1024 * 1024 : 128 * 1024;
        abort_if(strlen($request->getContent()) > $limit, 413, 'Solicitud demasiado grande.');
        if (! $isMedia && in_array($request->method(), ['POST', 'PUT', 'PATCH'], true) && strlen($request->getContent()) > 0) {
            abort_unless($request->isJson(), 415, 'Envía JSON.');
        }
        $response = $next($request);
        $response->headers->set('Cache-Control', 'no-store');
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        return $response;
    }
}
