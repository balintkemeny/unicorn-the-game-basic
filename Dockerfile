FROM ubuntu:latest
WORKDIR /usr/src/app
COPY . .
EXPOSE 3000
CMD [ "chmod", "+x", "main" ]
CMD [ "./main" ]
