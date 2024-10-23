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
INCLUDE_DIR = /usr/include
LIB_DIR = /usr/lib /usr/lib/x86_64-linux-gnu

# Compiler and flags
CC = gcc
CFLAGS += -I$(INCLUDE_DIR) -MMD -MF $(DEPS_DIR)/$*.d -O3 -march=native
LDFLAGS += $(addprefix -L, $(LIB_DIR)) -lgcrypt -Wl,-rpath,/usr/lib/x86_64-linux-gnu

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
		rm -f $(OBJ_DIR)/*.o
		rm -f $(DEPS_DIR)/*.d
		rm -rf $(TARGET)

.PHONY: all clean
