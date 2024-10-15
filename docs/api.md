# API Documentation

## Overview

This document provides an overview of the API endpoints for the Obligation Register project. Each endpoint is described with its purpose, request format, and response format.

## Endpoints

### 1. Get All Obligations

**Endpoint:** `/api/obligations`\
**Method:** `GET`\
**Description:** Retrieves a list of all obligations.

**Response:**

```json
[{
    "id": "string",
    "title": "string",
    "description": "string",
    "due_date": "string",
    "status": "string"
}]
```

### 2. Get Obligation by ID

**Endpoint:** `/api/obligations/{id}`\
**Method:** `GET`\
**Description:** Retrieves a specific obligation by its ID.

**Response:**

```json
{
    "id": "string",
    "title": "string",
    "description": "string",
    "due_date": "string",
    "status": "string"
}
```

### 3. Create New Obligation

**Endpoint:** `/api/obligations`\
**Method:** `POST`\
**Description:** Creates a new obligation.

**Request:**

```json
{
    "title": "string",
    "description": "string",
    "due_date": "string",
    "status": "string"
}
```

**Response:**

```json
{
    "id": "string",
    "title": "string",
    "description": "string",
    "due_date": "string",
    "status": "string"
}
```

### 4. Update Obligation

**Endpoint:** `/api/obligations/{id}`\
**Method:** `PUT`\
**Description:** Updates an existing obligation.

**Request:**

```json
{
    "title": "string",
    "description": "string",
    "due_date": "string",
    "status": "string"
}
```

**Response:**

```json
{
    "id": "string",
    "title": "string",
    "description": "string",
    "due_date": "string",
    "status": "string"
}
```

### 5. Delete Obligation

**Endpoint:** `/api/obligations/{id}`\
**Method:** `DELETE`\
**Description:** Deletes an obligation by its ID.

**Response:**

```json
{
    "message": "Obligation deleted successfully"
}
```

## Error Handling

All endpoints may return the following error responses:

**400 Bad Request:**

```json
{
    "error": "string"
}
```

**404 Not Found:**

```json
{
    "error": "string"
}
```

**500 Internal Server Error:**

```json
{
    "error": "string"
}
```

## Authentication

All API requests must include an `Authorization` header with a valid token:

```
Authorization: Bearer <token>
```

## Rate Limiting

The API enforces rate limiting to ensure fair usage. The current limit is 100 requests per minute.

## Contact

For any questions or issues, please contact the API support team at <support@example.com>.
