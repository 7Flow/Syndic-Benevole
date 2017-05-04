# Syndic-Benevole
Outil de gestion d'un syndicat de copropriété

#Server

A small express server is define on `:7777` port to makes the routing between the API and the static resources (so between the node and the nginx servers).
The node API only accepts local request, and only allows request from `:7777` port.

Authentication use a Redis database, and user, independant from it's activity, is forced to re-auth every 30 minutes.

Start the following services from root folder:

##1.Redis
Used for auth token temporary storage.
`redis-server`

##2.Node.js
Deplay a front server on `:7777` port, and the API server on `:8080` port.
`node server.js`

##3.NginX
Used to serve static resources.
Must use the `./angular2/dist/` folder as root

# Build

`gulp prod`

#warning
need Webpack 1.x version

#Disclaimer
This application need serious security tests before being used in production.
This code is shared "AS IS" without any warranties and support.
7Flow assumes no responsibility or liability for the use of this code, conveys no license or title under any patent, copyright, or mask work right to the product.

