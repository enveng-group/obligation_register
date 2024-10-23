# obligation_register

gcc -o server src/main.c src/utils.c src/http.c src/signal_handler.c -Iinclude -Wall -Wextra

## MacOS

```bash
gcc -c -o obj/http.o src/http.c -O2 -Wall -I/opt/homebrew/opt/libgcrypt/include -I/opt/homebrew/opt/libgpg-error/include -O3 -march=native -DDEBUG -DVERSION=1.0
gcc -c -o obj/main.o src/main.c -O2 -Wall -I/opt/homebrew/opt/libgcrypt/include -I/opt/homebrew/opt/libgpg-error/include -O3 -march=native -DDEBUG -DVERSION=1.0
gcc -c -o obj/signal_handler.o src/signal_handler.c -O2 -Wall -I/opt/homebrew/opt/libgcrypt/include -I/opt/homebrew/opt/libgpg-error/include -O3 -march=native -DDEBUG -DVERSION=1.0
gcc -c -o obj/utils.o src/utils.c -O2 -Wall -I/opt/homebrew/opt/libgcrypt/include -I/opt/homebrew/opt/libgpg-error/include -O3 -march=native -DDEBUG -DVERSION=1.0
gcc -o server obj/http.o obj/main.o obj/signal_handler.o obj/utils.o -L/opt/homebrew/opt/libgcrypt/lib -lgcrypt -L/opt/homebrew/opt/libgpg-error/lib -lgpg-error
./server
```
