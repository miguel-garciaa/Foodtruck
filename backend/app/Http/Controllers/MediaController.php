<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function store(Request $request)
    {
        abort_unless($request->user()->hasVerifiedEmail(), 403, 'Verifica tu correo.');
        abort_unless(extension_loaded('gd'), 503);
        $bytes = $request->getContent();
        abort_unless(in_array((new \finfo(FILEINFO_MIME_TYPE))->buffer($bytes), ['image/jpeg', 'image/png'], true), 422, 'Utiliza JPEG o PNG.');
        $size = @getimagesizefromstring($bytes);
        abort_unless($size && $size[0] > 0 && $size[1] > 0 && $size[0] * $size[1] <= 24000000, 422, 'Imagen inválida o demasiado grande (máximo 24 megapíxeles).');
        $image = @imagecreatefromstring($bytes);
        abort_unless($image, 422, 'No se puede decodificar la imagen.');
        $scale = min(1, 2048 / max($size[0], $size[1]));
        $output = imagecreatetruecolor(max(1, (int) ($size[0] * $scale)), max(1, (int) ($size[1] * $scale)));
        imagefill($output, 0, 0, imagecolorallocate($output, 255, 255, 255));
        imagecopyresampled($output, $image, 0, 0, 0, 0, imagesx($output), imagesy($output), $size[0], $size[1]);
        ob_start();
        imagejpeg($output, null, 85);
        $encoded = ob_get_clean();
        $id = (string) Str::uuid();
        $filename = $id.'.jpg';
        abort_unless(Storage::disk('local')->put('media/'.$filename, $encoded), 503, 'No se ha podido guardar la imagen. Inténtalo de nuevo.');
        try {
            DB::table('media_assets')->insert(['id' => $id, 'user_id' => $request->user()->id, 'filename' => $filename, 'created_at' => now(), 'updated_at' => now()]);
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete('media/'.$filename);
            throw $exception;
        }

        return response()->json(['id' => $id], 201);
    }

    public function show(Request $request, string $id)
    {
        $asset = DB::table('media_assets')->where('id', $id)->first();
        abort_unless($asset !== null, 404);
        $public = DB::table('food_trucks')->whereNotNull('published')->where('status', '<>', 'archived')->whereRaw("published->'photos' @> ?::jsonb", [json_encode([$id])])->exists();
        abort_unless($public || $request->user('sanctum')?->id === $asset->user_id, 404);

        return Storage::disk('local')->response('media/'.$asset->filename, null, ['Content-Type' => 'image/jpeg', 'Cache-Control' => 'private, no-store', 'X-Content-Type-Options' => 'nosniff']);
    }
}
