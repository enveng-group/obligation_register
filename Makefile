# Copyright (C) 2024 Enveng Group - Adrian Gallo, Rohan Lonkar and Rhett Bachoup
#
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

# Check if /etc/make.conf exists
ifneq ("$(wildcard /etc/make.conf)","")
	include /etc/make.conf
else
	CFLAGS += -O2 -Wall
	LDFLAGS +=
	CPPFLAGS += -DDEBUG -DVERSION=1.0
endif

# Directories
DEPS_DIR = deps
OBJ_DIR = obj
SRC_DIR = src
INCLUDE_DIR = /opt/homebrew/include  # Homebrew include directory
LIB_DIR = /opt/homebrew/lib          # Homebrew library directory

# Compiler and flags
CC = gcc
CFLAGS += -I$(INCLUDE_DIR) -MMD -MF $(DEPS_DIR)/$*.d -O3 -march=native
LDFLAGS += -L$(LIB_DIR) -lgcrypt -Wl,-rpath,$(LIB_DIR)

# Source files
SRCS = $(wildcard $(SRC_DIR)/*.c)

# Object files
OBJS = $(SRCS:$(SRC_DIR)/%.c=$(OBJ_DIR)/%.o)

# Dependency files
DEPS = $(SRCS:$(SRC_DIR)/%.c=$(DEPS_DIR)/%.d)

# Target executable
TARGET = server

# Default rule
all: $(TARGET)

# Link the target executable
$(TARGET): $(OBJS)
	$(CC) -o $@ $^ $(LDFLAGS)

# Compile source files into object files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(DEPS_DIR) $(OBJ_DIR)
	$(CC) -c -o $@ $< $(CFLAGS) $(CPPFLAGS)

# Create directories if they don't exist
$(DEPS_DIR):
	mkdir -p $(DEPS_DIR)

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

# Include dependency files
-include $(DEPS)

# Clean up
clean:
	rm -rf $(OBJ_DIR) $(DEPS_DIR) $(TARGET)

.PHONY: all clean
