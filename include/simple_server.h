// Copyright (C) 2024 Enveng Group - Adrian Gallo, Rohan Lonkar and Rhett
// Bachoup
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

#ifndef SIMPLE_SERVER_H
#define SIMPLE_SERVER_H

#include <microhttpd.h>

// Function to get the content type based on the file extension
const char *get_content_type (const char *path);

// Function to send a file response
int send_file_response (struct MHD_Connection *connection, const char *path);

// Function to handle incoming connections
int answer_to_connection (void *cls, struct MHD_Connection *connection,
                          const char *url, const char *method,
                          const char *version, const char *upload_data,
                          size_t *upload_data_size, void **con_cls);

#endif // SIMPLE_SERVER_H
