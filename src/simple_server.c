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
#include <fcntl.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/sendfile.h>
#include <sys/stat.h>
#include <unistd.h>

#define PORT 8080
#define BUFFER_SIZE 1024

const char *root_directory
    = "/home/ubuntu/obligation_register/"; // Define a base root directory for
                                           // your files
int server_fd; // Declare server_fd globally to access it in the signal handler

void
sanitize_file_path (char *file_path)
{
    char *p;
    while ((p = strstr (file_path, "..")) != NULL)
        {
            if (p == file_path || *(p - 1) == '/')
                {
                    // Move the path forward to remove the ".."
                    memmove (p, p + 2, strlen (p + 2) + 1);
                }
            else
                {
                    break; // Found a ".." in a non-dangerous position
                }
        }
}

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
    if (strcmp (ext, ".csv") == 0)
        return "text/csv";

    return "application/octet-stream"; // Default MIME type
}

void
send_http_response (int client_socket, const char *file_path)
{
    int file_fd = open (file_path, O_RDONLY);
    if (file_fd == -1)
        {
            const char *not_found_response
                = "HTTP/1.1 404 Not Found\r\n"
                  "Content-Type: text/html; charset=UTF-8\r\n"
                  "Content-Length: 22\r\n"
                  "\r\n"
                  "<h1>404 Not Found</h1>";
            if (send (client_socket, not_found_response,
                      strlen (not_found_response), 0)
                == -1)
                {
                    perror ("Send failed");
                }
            return;
        }

    const char *mime_type = get_mime_type (file_path);

    char header[BUFFER_SIZE];
    snprintf (header, sizeof (header),
              "HTTP/1.1 200 OK\r\nContent-Type: %s\r\n\r\n",
              mime_type); // Use standard snprintf
    if (send (client_socket, header, strlen (header), 0) == -1)
        {
            perror ("Send failed");
            close (file_fd);
            return;
        }

    struct stat file_stat;
    if (fstat (file_fd, &file_stat) == -1)
        {
            perror ("fstat failed");
            close (file_fd);
            return;
        }
    size_t file_size = file_stat.st_size;

    off_t offset = 0;
    if (sendfile (client_socket, file_fd, &offset, file_size) == -1)
        {
            perror ("sendfile failed");
        }

    close (file_fd);
}

void
handle_signal (int signal)
{
    close (server_fd);
    exit (EXIT_SUCCESS);
}

int
main ()
{
    struct sockaddr_in server_addr, client_addr;
    socklen_t addr_len = sizeof (client_addr);
    char buffer[BUFFER_SIZE] = { 0 };

    signal (SIGINT, handle_signal);

    if ((server_fd = socket (AF_INET, SOCK_STREAM, 0)) == -1)
        {
            perror ("Socket failed");
            exit (EXIT_FAILURE);
        }

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

    if (listen (server_fd, 10) < 0)
        {
            perror ("Listen failed");
            close (server_fd);
            exit (EXIT_FAILURE);
        }

    printf ("Server listening on port %d...\n", PORT);

    while (1)
        {
            int client_socket = accept (
                server_fd, (struct sockaddr *)&client_addr, &addr_len);
            if (client_socket < 0)
                {
                    perror ("Accept failed");
                    continue;
                }

            ssize_t bytes_read = read (client_socket, buffer, BUFFER_SIZE - 1);
            if (bytes_read < 0)
                {
                    perror ("Read failed");
                    close (client_socket);
                    continue;
                }
            buffer[bytes_read] = '\0';

            char method[16], file_path[256];
            sscanf (buffer, "%15s %255s", method,
                    file_path); // Use standard sscanf

            if (file_path[0] == '/')
                memmove (file_path, file_path + 1,
                         strlen (file_path) + 1); // Use memmove without _s

            if (strlen (file_path) == 0)
                strcpy (file_path, "index.html");

            char sanitized_path[512];
            snprintf (sanitized_path, sizeof (sanitized_path), "%s%s",
                      root_directory, file_path);
            sanitize_file_path (sanitized_path);
            printf ("Requesting file: %s\n", sanitized_path); // Add debug print

            send_http_response (client_socket, sanitized_path);

            close (client_socket);
        }

    close (server_fd);
    return 0;
}
