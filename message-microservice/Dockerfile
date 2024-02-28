FROM openjdk:11-jdk-slim
WORKDIR /app
COPY target/message-1.0-SNAPSHOT.jar .
EXPOSE 8040
ENTRYPOINT ["java","-jar","message-1.0-SNAPSHOT.jar"]