FROM openjdk:11-jdk-slim
WORKDIR /app
COPY target/user-1.0-SNAPSHOT.jar .
EXPOSE 8020
ENTRYPOINT ["java","-jar","user-1.0-SNAPSHOT.jar"]