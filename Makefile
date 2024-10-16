CC = gcc
CFLAGS = -Wall -O2 -march=armv8-a -mtune=native
LIBS = -lssl -lcrypto -pthread -lmicrohttpd

EMCC = emcc
EMCC_FLAGS = -O3 --closure 1 -s EXPORTED_FUNCTIONS="['_hello_world']" -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" -msimd128 -flto

SRC = src/simple_server.c
OBJ = simple_server.o
WASM_SRC = src/main.c
WASM_TARGET = wasm/main.js

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
