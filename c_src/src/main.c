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

// c_src/src/main.c

#include <stdio.h>
#include "encryption.h"

int main() {
    uint8_t data[] = {1, 2, 3, 4, 5};
    uint8_t key = 42;
    uint32_t length = sizeof(data) / sizeof(data[0]);

    printf("Original data: ");
    for (uint32_t i = 0; i < length; i++) {
        printf("%d ", data[i]);
    }
    printf("\n");

    xor_encrypt(data, key, length);

    printf("Encrypted data: ");
    for (uint32_t i = 0; i < length; i++) {
        printf("%d ", data[i]);
    }
    printf("\n");

    xor_encrypt(data, key, length); // Decrypting by applying XOR again

    printf("Decrypted data: ");
    for (uint32_t i = 0; i < length; i++) {
        printf("%d ", data[i]);
    }
    printf("\n");

    return 0;
}
