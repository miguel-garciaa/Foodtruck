<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use Tests\PostgresTestCase;

class RedisTest extends PostgresTestCase
{
    public function test_disposable_redis_stores_values_and_serializes_a_lock(): void
    {
        $this->assertSame('15', (string) config('database.redis.default.database'));
        $this->assertSame('127.0.0.1', config('database.redis.default.host'));
        $key = 'ci:'.Str::uuid();
        $redis = Redis::connection();
        try {
            $this->assertTrue((bool) $redis->set($key, 'first', 'EX', 30, 'NX'));
            $this->assertFalse((bool) $redis->set($key, 'second', 'EX', 30, 'NX'));
            $this->assertSame('first', $redis->get($key));
            $this->assertGreaterThan(0, $redis->ttl($key));
        } finally {
            $redis->del($key);
        }
    }
}
