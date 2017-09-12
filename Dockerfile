FROM openjdk:8-jdk-alpine
VOLUME /tmp
ADD target/zenelectricity-0.0.1-SNAPSHOT.jar app.jar
ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE=docker
EXPOSE 8888
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]