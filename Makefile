CC = gcc
CFLAGS = -Wall -O2 -march=armv8-a -mtune=native -Iinclude
LIBS = -pthread -lmicrohttpd

SRC = src/simple_server.c
OBJ = simple_server.o

TARGET = simple_server

$(TARGET): $(OBJ)
	$(CC) -o $(TARGET) $(OBJ) $(LIBS)

$(OBJ): $(SRC)
	$(CC) -c $(SRC) $(CFLAGS)

all: $(TARGET)

clean:
	rm -f $(OBJ) $(TARGET)
