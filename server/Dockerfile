FROM node:18-alpine

RUN apk add --no-cache git && \
    apk add --no-cache bash && \
    apk add --no-cache jq

WORKDIR /app

EXPOSE 5000

ENTRYPOINT [ "sh" , "-c"]

RUN echo "cloning the repo" 