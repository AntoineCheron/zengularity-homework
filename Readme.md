# Zenelectricity

A webapp to take control over your energy production. The app is cloud-ready, scalable and uses reactive technologies.

This is the homework given by Zengularity for its recruitment process.

## Run the app locally

#### Dependencies
* maven
* nodejs and npm
* java 8 and its jdk
* mongodb

#### Installation steps
* Open a terminal and go to the installation folder
* `git clone https://github.com/antoinecheron/zengularity-homework.git && cd zengularity-homework`
* Install npm dependencies : `cd src/main/resources/webapp && npm install && npm run build && cd ../../../../`
* Build the app : `mvn package`

You're done.

#### Running steps
* Start your mongo database `mongod`
* Go to the zengularity-homework in your terminal
* Start the app : `java -jar target/zenelectricity-0.0.1-SNAPSHOT.jar`
* Open your favorite web browser and go to `http://localhost:8888`

Create a new account and you'll be all set.

To close the server, go back to the terminal and type `CTRL + C` in both the Zenelectricity tab and the mongodb tab.

## Run the app with docker (preferred way)

#### Dependencies
* docker and docker-compose

#### Installation steps
* Open a terminal and go to the installation folder
* `curl -o docker-compose.yml https://raw.githubusercontent.com/antoinecheron/zengularity-homework/master/docker-compose.yml`

You're all set

#### Running steps
* Go back to the folder where you installed Zenelectricity
* `docker-compose up`
* Open your favorite web browser and go to `http://localhost`

To close it, in the same terminal you can do `CTRL + C` or in another terminal, opened in the zenelectricity folder, 
`docker-compose down`