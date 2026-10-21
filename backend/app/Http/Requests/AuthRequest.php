<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge(['email' => mb_strtolower(trim($this->input('email')))]);
        }
    }

    public function rules(): array
    {
        $email = ['required', 'string', 'email:rfc', 'max:254'];
        $password = ['required', 'string', 'min:12', 'max:128'];
        $token = ['required', 'string', 'min:32', 'max:256'];

        return match ($this->route()->getName()) {
            'auth.register' => ['displayName' => ['required', 'string', 'max:100'], 'email' => $email, 'password' => $password],
            'auth.login' => ['email' => $email, 'password' => ['required', 'string', 'max:128']],
            'auth.refresh', 'auth.verify' => ['token' => $token],
            'auth.resend', 'auth.forgot' => ['email' => $email],
            'auth.reset' => ['email' => $email, 'token' => $token, 'password' => $password],
            'auth.password' => ['currentPassword' => ['required', 'string', 'max:128'], 'password' => $password],
            'auth.google', 'auth.google.link' => ['challengeId' => ['required', 'uuid'], 'idToken' => ['required', 'string', 'max:12000']],
            default => [],
        };
    }
}
