/**
 * Copyright (C) 2024 Enveng Group - Adrian Gallo, Rohan Lonkar and Rhett Bachoup
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

#include "../include/http.h"
#include "../include/utils.h"
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/socket.h>

#define BUFFER_SIZE 1024

/* Send an HTTP response to the client */
void
send_http_response (int client_socket, const char *file_path)
{
  int file_fd = open (file_path, O_RDONLY);
  if (file_fd == -1)
    {
      const char *not_found_response =
        "HTTP/1.1 404 Not Found\r\n"
        "Content-Type: text/html; charset=UTF-8\r\n"
        "Content-Length: 22\r\n"
        "\r\n"
        "<h1>404 Not Found</h1>";
      if (send (client_socket, not_found_response, strlen (not_found_response), 0) == -1)
        {
          perror ("Send failed");
        }
      return;
    }

  const char *mime_type = get_mime_type (file_path);
  char buffer[BUFFER_SIZE];

  char header[BUFFER_SIZE];
  snprintf (header, sizeof (header), "HTTP/1.1 200 OK\r\nContent-Type: %s\r\n\r\n", mime_type);
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

  ssize_t bytes_sent;
  while ((bytes_sent = read (file_fd, buffer, BUFFER_SIZE)) > 0)
    {
      if (write (client_socket, buffer, bytes_sent) != bytes_sent)
        {
          perror ("write failed");
          break;
        }
    }
  if (bytes_sent < 0)
    {
      perror ("read failed");
    }

  close (file_fd);
}
