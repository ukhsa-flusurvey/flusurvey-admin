# Service API: survey info export

This document describes the **Next.js proxy** that exposes the CASE Management API survey-info export to **service accounts** (API key authentication). It mirrors the pattern used for `/api/service-api/v1/studies/{studyKey}/data-explorer/responses`.

## Endpoint

```http
GET /api/service-api/v1/studies/{studyKey}/data-exporter/survey-info
```

- **`studyKey`**: Study identifier. Must be 2–50 characters and match `[a-zA-Z0-9_-]+`.

The proxy forwards the request to:

`{MANAGEMENT_API_URL}/v1/studies/{studyKey}/data-exporter/survey-info`

with the same query string.

## Authentication

Send a valid service account API key:

| Header       | Required | Description        |
|-------------|----------|--------------------|
| `X-API-Key` | Yes      | Service account key |

The server also sends `X-Instance-ID` to the management API using the app’s `INSTANCE_ID` environment variable. That variable must be set on the Next.js host; callers do not supply it on this route.

## Query parameters

Parameters are passed through to the management API. The in-app exporter uses the following (use the same names unless your API contract differs):

| Parameter    | Description |
|-------------|-------------|
| `surveyKey` | Survey to export |
| `format`    | `json` or `csv` |
| `language`  | Locale code (e.g. `en`, `nl`) |
| `shortKeys` | `true` or `false` |

Example:

```text
?surveyKey=weekly&format=json&language=en&shortKeys=true
```

## Successful response

- Status code from the management API is returned as-is (often `200`).
- Body is the file payload (not rewritten by the proxy).
- Headers preserved where relevant:
  - `Content-Type`
  - `Content-Disposition` (use this for the download filename when present)

## Error responses

| Status | Meaning |
|--------|---------|
| `400`  | Invalid `studyKey` — JSON body: `{ "error": "Invalid studyKey parameter." }` |
| `401`  | Missing `X-API-Key` — JSON: `{ "error": "Missing X-API-Key header." }` |
| `500`  | `INSTANCE_ID` not configured on the app — JSON: `{ "error": "INSTANCE_ID is not configured." }` |
| `502`  | Proxy could not reach the management API — JSON: `{ "error": "Failed to reach upstream service." }` |

For upstream errors (e.g. `403`, `404`, `422`), the proxy returns the management API’s status and body.

## Example: `curl`

Replace placeholders with your deployment URL, study key, and API key.

```bash
BASE_URL="https://your-app.example.com"
STUDY_KEY="your-study"
API_KEY="your-service-account-api-key"
SURVEY_KEY="weekly"

curl -sS -D - -o survey-info.json \
  -H "X-API-Key: ${API_KEY}" \
  "${BASE_URL}/api/service-api/v1/studies/${STUDY_KEY}/data-exporter/survey-info?surveyKey=${SURVEY_KEY}&format=json&language=en&shortKeys=true"
```

Inspect response headers for `Content-Disposition` to choose the output filename.

## App configuration

The proxy relies on the same settings as other service-api routes:

- `MANAGEMENT_API_URL` — base URL of the CASE Management API
- `INSTANCE_ID` — sent to the API as `X-Instance-ID`
