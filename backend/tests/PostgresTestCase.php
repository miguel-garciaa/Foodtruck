<?php

namespace Tests;

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class PostgresTestCase extends TestCase
{
    use RefreshDatabase;

    public function createApplication(): Application
    {
        $app = parent::createApplication();
        if ($app['config']['database.default'] !== 'pgsql' || $app['config']['database.connections.pgsql.database'] !== 'foodtrucks_testing' || ! $app->environment('testing')) {
            throw new \RuntimeException('Los tests solo pueden migrar la base PostgreSQL aislada foodtrucks_testing.');
        }

        return $app;
    }
}
