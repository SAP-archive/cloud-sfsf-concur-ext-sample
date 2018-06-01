#
# Run this from Docker:
#
# docker build -t service-image . && docker run -p 3000:3000 --name delorean-service service-image
#
#
FROM httpd:alpine

# Create app directory
WORKDIR /usr/local/apache2/htdocs/webapp
COPY webapp ./

EXPOSE 80
