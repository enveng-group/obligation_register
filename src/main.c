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

#include "../include/server.h"
#include "../include/utils.h"
#include "../include/http.h"
#include "../include/signal_handler.h"

const char *root_directory = "/Users/adriangallo/obligation_register/"; // "/home/ubuntu/obligation_register/";
int server_fd;

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

  if (bind (server_fd, (struct sockaddr *)&server_addr, sizeof (server_addr)) < 0)
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
      int client_socket = accept (server_fd, (struct sockaddr *)&client_addr, &addr_len);
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
      sscanf (buffer, "%15s %255s", method, file_path);

      if (file_path[0] == '/')
        memmove (file_path, file_path + 1, strlen (file_path) + 1);
      file_path[sizeof(file_path) - 1] = '\0'; // Ensure null termination
      if (strlen (file_path) == 0)
        strcpy (file_path, "index.html");

      char sanitized_path[512];
      snprintf (sanitized_path, sizeof (sanitized_path) - 1, "%s%s", root_directory, file_path);
      sanitized_path[sizeof(sanitized_path) - 1] = '\0'; // Ensure null termination
      sanitize_file_path (sanitized_path);
      printf ("Requesting file: %s\n", sanitized_path);

      send_http_response (client_socket, sanitized_path);

      close (client_socket);
    }

  close (server_fd);
  return 0;
}
