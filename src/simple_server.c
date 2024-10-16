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
#include <microhttpd.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

#define PORT 80 // Change the port to 80 for HTTP

int
send_response (struct MHD_Connection *connection, const char *message,
               const char *content_type)
{
    struct MHD_Response *response;
    int ret;

    response = MHD_create_response_from_buffer (
        strlen (message), (void *)message, MHD_RESPMEM_PERSISTENT);
    if (!response)
        {
            perror ("Failed to create response");
            return MHD_NO;
        }

    MHD_add_response_header (response, "Content-Type", content_type);
    ret = MHD_queue_response (connection, MHD_HTTP_OK, response);
    MHD_destroy_response (response);
    return ret;
}

int
answer_to_connection (void *cls, struct MHD_Connection *connection,
                      const char *url, const char *method, const char *version,
                      const char *upload_data, size_t *upload_data_size,
                      void **con_cls)
{
    if (strcmp (url, "/") == 0)
        {
            return send_response (connection, "Hello, World!", "text/plain");
        }
    else
        {
            return send_response (connection, "Not Found", "text/plain");
        }
}

int
main ()
{
    struct MHD_Daemon *daemon;

    daemon = MHD_start_daemon (MHD_USE_SELECT_INTERNALLY, PORT, NULL, NULL,
                               &answer_to_connection, NULL, MHD_OPTION_END);
    if (NULL == daemon)
        {
            fprintf (stderr, "Failed to initialize server\n");
            return 1;
        }

    printf ("Server running on port %d\n", PORT);
    getchar (); // Keep the server running until a key is pressed

    MHD_stop_daemon (daemon);

    return 0;
}
