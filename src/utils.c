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

#include "../include/utils.h"
#include <string.h>

/* Sanitize the file path to prevent directory traversal attacks */
void
sanitize_file_path (char *file_path)
{
  char *p;
  while ((p = strstr (file_path, "..")) != NULL)
    {
      if (p == file_path || *(p - 1) == '/')
        {
          memmove (p, p + 2, strlen (p + 2) + 1);
        }
      else
        {
          break;
        }
    }
}

/* Get the MIME type based on the file extension */
const char *
get_mime_type (const char *file_path)
{
  const char *ext = strrchr (file_path, '.');
  if (!ext)
    return "application/octet-stream";

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
  if (strcmp (ext, ".svg") == 0)
    return "image/svg+xml";
  if (strcmp (ext, ".pdf") == 0)
    return "application/pdf";
  if (strcmp (ext, ".mp4") == 0)
    return "video/mp4";
  if (strcmp (ext, ".mp3") == 0)
    return "audio/mpeg";
  if (strcmp (ext, ".zip") == 0)
    return "application/zip";

  return "application/octet-stream";
}
