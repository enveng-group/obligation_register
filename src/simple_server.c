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
#include <fcntl.h>
#include <microhttpd.h>
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
send_file_response (struct MHD_Connection *connection, const char *path)
{
    int fd;
    struct stat sb;
    char buffer[4096];
    ssize_t bytes_read;
    struct MHD_Response *response;
    int ret;

    fd = open (path, O_RDONLY);
    if (fd == -1)
        return MHD_NO;
    if (fstat (fd, &sb) == -1)
        {
            close (fd);
            return MHD_NO;
        }

    const char *content_type = get_content_type (path);
    response = MHD_create_response_from_fd_at_offset (sb.st_size, fd, 0);
    if (!response)
        {
            close (fd);
            return MHD_NO;
        }

    MHD_add_response_header (response, "Content-Type", content_type);
    ret = MHD_queue_response (connection, MHD_HTTP_OK, response);
    MHD_destroy_response (response);
    close (fd);
    return ret;
}

int
answer_to_connection (void *cls, struct MHD_Connection *connection,
                      const char *url, const char *method, const char *version,
                      const char *upload_data, size_t *upload_data_size,
                      void **con_cls)
{
    char filepath[256];
    snprintf (filepath, sizeof (filepath), "/home/ubuntu/obligation_register%s",
              url);
    return send_file_response (connection, filepath);
}

int
main ()
{
    SSL_CTX *ctx;
    SSL *ssl;
    struct MHD_Daemon *daemon;

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

    daemon = MHD_start_daemon (
        MHD_USE_SSL, PORT, NULL, NULL, &answer_to_connection, NULL,
        MHD_OPTION_HTTPS_MEM_KEY, key_pem, MHD_OPTION_HTTPS_MEM_CERT, cert_pem,
        MHD_OPTION_END);
    if (NULL == daemon)
        {
            fprintf (stderr, "Failed to initialize server\n");
            return 1;
        }

    printf ("Server running on port %d\n", PORT);
    getchar (); // Keep the server running until a key is pressed

    MHD_stop_daemon (daemon);
    SSL_CTX_free (ctx);
    EVP_cleanup ();

    return 0;
}
