FROM gcc:latest
WORKDIR /app
COPY code.c .
RUN gcc -o code code.c
CMD ["./code"]