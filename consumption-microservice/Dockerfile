FROM openjdk:11-jdk-slim
WORKDIR /app
COPY target/consumption-1.0-SNAPSHOT.jar .
EXPOSE 8030
ENTRYPOINT ["java","-jar","consumption-1.0-SNAPSHOT.jar"]