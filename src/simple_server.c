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

#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define PORT 8080
#define BUFFER_SIZE 1024

const char *
get_mime_type (const char *file_path)
{
    const char *ext = strrchr (file_path, '.');
    if (!ext)
        return "application/octet-stream"; // Default MIME type

    if (strcmp (ext, ".html") == 0)
        return "text/html";
    if (strcmp (ext, ".css") == 0)
        return "text/css";
    if (strcmp (ext, ".js") == 0)
        return "application/javascript";
    if (strcmp (ext, ".png") == 0)
        return "image/png";
    if (strcmp (ext, ".jpg") == 0 || strcmp (ext, ".jpeg") == 0)
        return "image/jpeg";
    if (strcmp (ext, ".gif") == 0)
        return "image/gif";

    return "application/octet-stream"; // Default MIME type
}

void
send_http_response (int client_socket, const char *file_path)
{
    FILE *file = fopen (file_path, "rb");
    if (file == NULL)
        {
            char *not_found_response
                = "HTTP/1.1 404 Not Found\r\n"
                  "Content-Type: text/html; charset=UTF-8\r\n"
                  "Content-Length: 22\r\n"
                  "\r\n"
                  "<h1>404 Not Found</h1>";
            send (client_socket, not_found_response,
                  strlen (not_found_response), 0);
            return;
        }

    // Determine the MIME type
    const char *mime_type = get_mime_type (file_path);

    // Send HTTP headers with the correct MIME type
    char header[BUFFER_SIZE];
    snprintf (header, sizeof (header),
              "HTTP/1.1 200 OK\r\n"
              "Content-Type: %s\r\n\r\n",
              mime_type);
    send (client_socket, header, strlen (header), 0);

    // Send the content of the file
    char buffer[BUFFER_SIZE];
    size_t bytes_read;
    while ((bytes_read = fread (buffer, 1, BUFFER_SIZE, file)) > 0)
        {
            send (client_socket, buffer, bytes_read, 0);
        }

    fclose (file);
}

int
main ()
{
    int server_fd, client_socket;
    struct sockaddr_in server_addr, client_addr;
    socklen_t addr_len = sizeof (client_addr);
    char buffer[BUFFER_SIZE] = { 0 };

    // Create a socket
    if ((server_fd = socket (AF_INET, SOCK_STREAM, 0)) == -1)
        {
            perror ("Socket failed");
            exit (EXIT_FAILURE);
        }

    // Bind the socket to port 8080
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons (PORT);

    if (bind (server_fd, (struct sockaddr *)&server_addr, sizeof (server_addr))
        < 0)
        {
            perror ("Bind failed");
            close (server_fd);
            exit (EXIT_FAILURE);
        }

    // Listen for incoming connections
    if (listen (server_fd, 10) < 0)
        {
            perror ("Listen failed");
            close (server_fd);
            exit (EXIT_FAILURE);
        }

    printf ("Server listening on port %d...\n", PORT);

    while (1)
        {
            // Accept an incoming connection
            client_socket = accept (server_fd, (struct sockaddr *)&client_addr,
                                    &addr_len);
            if (client_socket < 0)
                {
                    perror ("Accept failed");
                    continue;
                }

            // Read the request from the client
            read (client_socket, buffer, BUFFER_SIZE);

            // Parse the requested file path from the HTTP request
            char method[16], file_path[256];
            sscanf (buffer, "%s %s", method, file_path);

            // Remove the leading '/' from the file path
            if (file_path[0] == '/')
                memmove (file_path, file_path + 1, strlen (file_path));

            // Serve the requested file, default to "index.html" if no file is specified
            if (strlen (file_path) == 0)
                strcpy (file_path, "index.html");

            // Prepend "img/" to the file path if it starts with "img/"
            if (strncmp (file_path, "img/", 4) == 0)
                {
                    char img_path[256] = "img/";
                    strcat (img_path, file_path + 4);
                    send_http_response (client_socket, img_path);
                }
            else
                {
                    send_http_response (client_socket, file_path);
                }

            // Close the connection
            close (client_socket);
        }

    return 0;
}
