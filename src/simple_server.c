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

#include <microhttpd.h>
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include "simple_server.h"


#define PORT 443

static const char *get_content_type(const char *path) {
    if (strstr(path, ".html")) return "text/html";
    if (strstr(path, ".js")) return "application/javascript";
    if (strstr(path, ".wasm")) return "application/wasm";
    return "text/plain";
}

static int send_file_response(struct MHD_Connection *connection, const char *path) {
    int fd;
    struct stat sb;
    struct MHD_Response *response;
    int ret;

    fd = open(path, O_RDONLY);
    if (fd == -1) return MHD_NO;
    if (fstat(fd, &sb) == -1) {
        close(fd);
        return MHD_NO;
    }

    const char *content_type = get_content_type(path);
    response = MHD_create_response_from_fd(sb.st_size, fd);
    if (!response) {
        close(fd);
        return MHD_NO;
    }

    MHD_add_response_header(response, MHD_HTTP_HEADER_CONTENT_TYPE, content_type);
    ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
    MHD_destroy_response(response);
    return ret;
}

static int answer_to_connection(void *cls, struct MHD_Connection *connection,
                                const char *url, const char *method, const char *version,
                                const char *upload_data, size_t *upload_data_size, void **con_cls) {
    char filepath[256];
    snprintf(filepath, sizeof(filepath), "/home/ubuntu/obligation_register%s", url);
    return send_file_response(connection, filepath);
}

int main() {
    struct MHD_Daemon *daemon;
    const char *key_pem = "/home/ubuntu/obligation_register/certs/enssol.com.au.key.pem";
    const char *cert_pem = "/home/ubuntu/obligation_register/certs/enssol.com.au.pem";
    const char *ca_pem = "/usr/share/ca-certificates/Cloudflare_CA.crt";

    daemon = MHD_start_daemon(MHD_USE_SELECT_INTERNALLY | MHD_USE_SSL, PORT, NULL, NULL,
                              &answer_to_connection, NULL, MHD_OPTION_HTTPS_MEM_KEY, key_pem,
                              MHD_OPTION_HTTPS_MEM_CERT, cert_pem, MHD_OPTION_HTTPS_MEM_TRUST, ca_pem,
                              MHD_OPTION_END);
    if (NULL == daemon) return 1;

    printf("Server running on port %d\n", PORT);
    getchar(); // Wait to terminate
    MHD_stop_daemon(daemon);
    return 0;
}
