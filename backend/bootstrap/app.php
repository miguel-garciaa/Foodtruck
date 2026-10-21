<?php

use App\Http\Middleware\ApiBoundary;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trimStrings(except: ['currentPassword']);
        $middleware->convertEmptyStringsToNull(except: [fn (Request $request) => $request->is('api/*')]);
        $middleware->api(prepend: [ApiBoundary::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(fn (Request $request) => $request->is('api/*'));
        $exceptions->render(function (Throwable $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }
            $status = match (true) {
                $exception instanceof ValidationException => 422,
                $exception instanceof AuthenticationException => 401,
                $exception instanceof AuthorizationException => 403,
                $exception instanceof ModelNotFoundException => 404,
                $exception instanceof HttpExceptionInterface => $exception->getStatusCode(),
                default => 500,
            };
            $message = $status >= 500 ? ($status === 503 ? 'Servicio temporalmente no disponible.' : 'No se pudo completar la solicitud.') : ($exception instanceof ValidationException ? 'Revisa los campos indicados.' : ($exception->getMessage() ?: 'Solicitud rechazada.'));
            $body = ['code' => match ($status) {
                401 => 'unauthorized', 403 => 'forbidden', 404 => 'not_found', 409 => 'conflict', 422 => 'validation', 429 => 'rate_limited', 503 => 'unavailable', default => 'request_failed'
            }, 'message' => $message];
            if ($exception instanceof ValidationException) {
                $body['errors'] = $exception->errors();
            }

            return response()->json($body, $status, ['Cache-Control' => 'no-store']);
        });
    })->create();
