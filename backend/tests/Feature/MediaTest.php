<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\Sessions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\PostgresTestCase;

class MediaTest extends PostgresTestCase
{
    public function test_upload_is_reencoded_resized_and_private_to_the_owner(): void
    {
        Storage::fake('local');
        $owner = User::factory()->create();
        $session = DB::transaction(fn () => app(Sessions::class)->issue($owner));
        $image = imagecreatetruecolor(2400, 1200);
        ob_start();
        imagepng($image);
        $bytes = ob_get_clean().'synthetic-private-metadata';
        $response = $this->call('POST', '/api/v1/me/media', [], [], [], ['CONTENT_TYPE' => 'image/png', 'HTTP_ACCEPT' => 'application/json', 'HTTP_AUTHORIZATION' => 'Bearer '.$session['accessToken']], $bytes);
        $id = $response->assertCreated()->json('id');
        $stored = Storage::disk('local')->get('media/'.$id.'.jpg');
        $this->assertSame('image/jpeg', (new \finfo(FILEINFO_MIME_TYPE))->buffer($stored));
        $this->assertSame([2048, 1024], array_slice(getimagesizefromstring($stored), 0, 2));
        $this->assertStringNotContainsString('synthetic-private-metadata', $stored);
        $this->withToken($session['accessToken'])->get('/api/v1/media/'.$id)->assertOk()->assertHeader('Content-Type', 'image/jpeg');
        app('auth')->forgetGuards();
        $this->withoutHeader('Authorization')->getJson('/api/v1/media/'.$id)->assertNotFound();
        $other = User::factory()->create();
        $otherSession = DB::transaction(fn () => app(Sessions::class)->issue($other));
        app('auth')->forgetGuards();
        $this->withToken($otherSession['accessToken'])->getJson('/api/v1/media/'.$id)->assertNotFound();
    }

    public function test_a_declared_jpeg_cannot_upload_markup_or_an_oversized_body(): void
    {
        Storage::fake('local');
        $owner = User::factory()->create();
        $session = DB::transaction(fn () => app(Sessions::class)->issue($owner));
        $headers = ['CONTENT_TYPE' => 'image/jpeg', 'HTTP_ACCEPT' => 'application/json', 'HTTP_AUTHORIZATION' => 'Bearer '.$session['accessToken']];
        $this->call('POST', '/api/v1/me/media', [], [], [], $headers, '<svg xmlns="http://www.w3.org/2000/svg"></svg>')->assertUnprocessable();
        $this->call('POST', '/api/v1/me/media', [], [], [], $headers, str_repeat('x', 8 * 1024 * 1024 + 1))->assertStatus(413);
        $this->assertDatabaseCount('media_assets', 0);
        $this->assertSame([], Storage::disk('local')->allFiles('media'));
    }
}
