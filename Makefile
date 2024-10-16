CC = gcc
CFLAGS = -Wall
LIBS = -lmicrohttpd

EMCC = emcc
EMCC_FLAGS = -s EXPORTED_FUNCTIONS="['_add']" -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"

SRC = src/simple_server.c
OBJ = simple_server.o
WASM_SRC = src/main.c
WASM_TARGET = wasm/index.html

TARGET = simple_server

$(TARGET): $(OBJ)
    $(CC) -o $(TARGET) $(OBJ) $(LIBS)

$(OBJ): $(SRC)
    $(CC) -c $(SRC) $(CFLAGS)

$(WASM_TARGET): $(WASM_SRC)
    $(EMCC) $(WASM_SRC) -o $(WASM_TARGET) $(EMCC_FLAGS)

all: $(TARGET) $(WASM_TARGET)

clean:
    rm -f $(OBJ) $(TARGET) $(WASM_TARGET)
