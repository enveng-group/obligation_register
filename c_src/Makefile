# c_src/Makefile

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

CC = emcc
CFLAGS = -Iinclude -Wall -Wextra -MMD -MP
SRC_DIR = src
OBJ_DIR = obj
DEPS_DIR = deps
WASM_DIR = ../public/assets/wasm

SRCS = $(wildcard $(SRC_DIR)/*.c)
OBJS = $(patsubst $(SRC_DIR)/%.c, $(OBJ_DIR)/%.o, $(SRCS))
DEPS = $(patsubst $(SRC_DIR)/%.c, $(DEPS_DIR)/%.d, $(SRCS))
TARGET = $(WASM_DIR)/encryption.wasm

all: $(TARGET)

$(TARGET): $(OBJS)
	@mkdir -p $(WASM_DIR)
	$(CC) $(CFLAGS) $(OBJS) -o $(TARGET) -s WASM=1 -s EXPORTED_FUNCTIONS='["_xor_encrypt"]' -s EXPORTED_RUNTIME_METHODS='["cwrap"]'

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(OBJ_DIR) $(DEPS_DIR)
	$(CC) $(CFLAGS) -c $< -o $@
	@mv $(OBJ_DIR)/$*.d $(DEPS_DIR)/

clean:
	rm -rf $(OBJ_DIR) $(WASM_DIR) $(DEPS_DIR)

-include $(DEPS)

.PHONY: all clean
