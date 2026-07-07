# AutoFlow AI API

Base URL: `http://127.0.0.1:5050/api`

## Auth

`POST /auth/register`

```json
{
  "name": "Sakshi",
  "email": "sakshi@example.com",
  "password": "password123"
}
```

`POST /auth/login`

```json
{
  "email": "demo@autoflow.ai",
  "password": "demo1234"
}
```

`GET /auth/me`

Requires `Authorization: Bearer <token>`.

## Workflows

`GET /workflows`

Returns workflow list and dashboard stats.

`POST /workflows`

```json
{
  "prompt": "Create a client called Tesla. Schedule a meeting tomorrow at 3 PM. Generate proposal. Notify sales team."
}
```

`GET /workflows/:id`

Returns workflow details, tasks, generated plan, and logs.
