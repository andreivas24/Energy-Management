FROM openjdk:11-jdk-slim
WORKDIR /app
COPY target/device-1.0-SNAPSHOT.jar .
EXPOSE 8010
ENTRYPOINT ["java","-jar","device-1.0-SNAPSHOT.jar"]