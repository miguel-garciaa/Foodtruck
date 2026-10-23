<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasVerifiedEmail() ?? false;
    }

    public function rules(): array
    {
        $prefix = $this->isMethod('post') && $this->routeIs('trucks.create') ? '' : 'draft.';
        $rules = [
            $prefix.'name' => ['present', 'string', 'max:100'],
            $prefix.'description' => ['present', 'string', 'max:3000'],
            $prefix.'category' => ['required', Rule::in(['Hamburguesas', 'Tacos', 'Vegetariano', 'Otros'])],
            $prefix.'contact' => ['present', 'string', 'max:200'],
            $prefix.'locality' => ['present', 'string', 'max:100'],
            $prefix.'province' => ['present', 'string', 'max:100'],
            $prefix.'address' => ['present', 'string', 'max:250'],
            $prefix.'longitude' => ['required', 'numeric:strict', 'between:-18.5,4.7'],
            $prefix.'latitude' => ['required', 'numeric:strict', 'between:27.5,43.9'],
            $prefix.'timezone' => ['required', Rule::in(['Europe/Madrid', 'Atlantic/Canary'])],
            $prefix.'photos' => ['present', 'array', 'max:8'],
            $prefix.'photos.*' => ['uuid', 'distinct', Rule::exists('media_assets', 'id')->where('user_id', $this->user()?->id)],
            $prefix.'hours' => ['present', 'array', 'max:70'],
            $prefix.'hours.*' => ['array:day,startMinute,endMinute'],
            $prefix.'hours.*.day' => ['required', 'integer:strict', 'between:1,7'],
            $prefix.'hours.*.startMinute' => ['required', 'integer:strict', 'between:0,1439'],
            $prefix.'hours.*.endMinute' => ['required', 'integer:strict', 'between:1,1440', 'gt:'.$prefix.'hours.*.startMinute'],
            $prefix.'menu' => ['present', 'array', 'max:100'],
            $prefix.'menu.*' => ['array:id,name,description,priceCents,allergens'],
            $prefix.'menu.*.id' => ['required', 'string', 'max:64', 'distinct'],
            $prefix.'menu.*.name' => ['required', 'string', 'max:100'],
            $prefix.'menu.*.description' => ['present', 'string', 'max:500'],
            $prefix.'menu.*.priceCents' => ['required', 'integer:strict', 'between:0,1000000'],
            $prefix.'menu.*.allergens' => ['present', 'string', 'max:500'],
        ];
        if ($prefix !== '') {
            $rules['version'] = ['required', 'integer:strict', 'between:1,2147483647'];
            $rules['draft'] = ['required', 'array:name,description,category,contact,locality,province,address,longitude,latitude,timezone,photos,hours,menu'];
        }

        return $rules;
    }
}
