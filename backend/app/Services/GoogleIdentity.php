<?php

namespace App\Services;

use Firebase\JWT\JWK;
use Google\Auth\OAuth2;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GoogleIdentity
{
    public function verify(string $token): object
    {
        abort_unless(config('foodtrucks.google_client_id'), 503);
        $keys = Cache::remember('google:sign-in:jwks', 3600, function () {
            $response = Http::connectTimeout(3)->timeout(8)->get('https://www.googleapis.com/oauth2/v3/certs');
            abort_unless($response->successful(), 503);

            return $response->json();
        });
        try {
            $claims = (new OAuth2(['audience' => config('foodtrucks.google_client_id'), 'idToken' => $token]))->verifyIdToken(JWK::parseKeySet($keys, 'RS256'));
        } catch (\Throwable) {
            abort(401, 'La identificación de Google no es válida.');
        }
        abort_unless($claims && in_array($claims->iss ?? '', ['accounts.google.com', 'https://accounts.google.com'], true) && ($claims->email_verified ?? false) === true && is_string($claims->sub ?? null) && strlen($claims->sub) <= 255 && filter_var($claims->email ?? '', FILTER_VALIDATE_EMAIL) && is_string($claims->nonce ?? null), 401, 'La identificación de Google no es válida.');

        return $claims;
    }
}
