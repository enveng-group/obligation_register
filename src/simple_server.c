/**
 * Copyright (C) 2024 Enveng Group - Adrian Gallo, Rohan Lonkar and Rhett
 * Bachoup
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

#include "simple_server.h"
#include "stb_http.h"
#include <fcntl.h>
#include <openssl/err.h>
#include <openssl/ssl.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

#define PORT 443

const char *
get_content_type (const char *path)
{
    if (strstr (path, ".html"))
        return "text/html";
    if (strstr (path, ".js"))
        return "application/javascript";
    if (strstr (path, ".wasm"))
        return "application/wasm";
    return "text/plain";
}

int
send_file_response (struct http_request *request, const char *path)
{
    int fd;
    struct stat sb;
    char buffer[4096];
    ssize_t bytes_read;

    fd = open (path, O_RDONLY);
    if (fd == -1)
        return -1;
    if (fstat (fd, &sb) == -1)
        {
            close (fd);
            return -1;
        }

    const char *content_type = get_content_type (path);
    http_response_status (request, 200);
    http_response_header (request, "Content-Type", content_type);

    while ((bytes_read = read (fd, buffer, sizeof (buffer))) > 0)
        {
            http_response_body (request, buffer, bytes_read);
        }

    close (fd);
    return 0;
}

void
answer_to_connection (struct http_request *request)
{
    char filepath[256];
    snprintf (filepath, sizeof (filepath), "/home/ubuntu/obligation_register%s",
              request->path);
    send_file_response (request, filepath);
}

int
main ()
{
    SSL_CTX *ctx;
    SSL *ssl;
    struct http_server server;

    // Initialize OpenSSL
    SSL_load_error_strings ();
    OpenSSL_add_ssl_algorithms ();

    ctx = SSL_CTX_new (TLS_server_method ());
    if (!ctx)
        {
            fprintf (stderr, "Failed to create SSL context\n");
            return 1;
        }

    // Load certificates
    const char *key_pem
        = "/home/ubuntu/obligation_register/certs/enssol.com.au.key.pem";
    const char *cert_pem
        = "/home/ubuntu/obligation_register/certs/enssol.com.au.pem";
    const char *ca_pem = "/usr/share/ca-certificates/Cloudflare_CA.crt";

    if (SSL_CTX_use_certificate_file (ctx, cert_pem, SSL_FILETYPE_PEM) <= 0)
        {
            ERR_print_errors_fp (stderr);
            return 1;
        }

    if (SSL_CTX_use_PrivateKey_file (ctx, key_pem, SSL_FILETYPE_PEM) <= 0)
        {
            ERR_print_errors_fp (stderr);
            return 1;
        }

    if (!SSL_CTX_load_verify_locations (ctx, ca_pem, NULL))
        {
            ERR_print_errors_fp (stderr);
            return 1;
        }

    if (http_server_init (&server, PORT, answer_to_connection) != 0)
        {
            fprintf (stderr, "Failed to initialize server\n");
            return 1;
        }

    printf ("Server running on port %d\n", PORT);
    http_server_run (&server);
    http_server_cleanup (&server);

    SSL_CTX_free (ctx);
    EVP_cleanup ();

    return 0;
}
