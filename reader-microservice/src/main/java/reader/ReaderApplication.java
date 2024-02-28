package reader;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import net.minidev.json.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.validation.annotation.Validated;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.TimeZone;
import java.util.concurrent.TimeoutException;

@SpringBootApplication
@Validated
@EnableScheduling
public class ReaderApplication extends SpringBootServletInitializer {

    private static final String EXCHANGE_NAME = "exchange_consumption";
    private static final String QUEUE_NAME = "queue_consumption";
    private static final String ROUTING_KEY = "key_consumption";
    private static final String CSV_PATH = "C:\\Users\\Razvan\\Desktop\\Facultate\\AN 4\\GIT\\DS2023_30644_BUMBU_RAZVAN_ASSIGNMENT_2\\reader-microservice\\src\\main\\resources\\sensor.csv";

    //USER 1
    private static final String DEVICE_ID = "13b8b201-a96f-443b-bfe9-664a5525e096";
    private static final String DEVICE_ADDRESS = "Acasa";
    private static final String USER_ID = "5dea5473-e337-4ee1-bda6-c698ab2dbb58";

    //USER 2
    //private static final String DEVICE_ID = "7ca61256-97ec-4d7b-b002-abd8a3644d8f";
    //private static final String DEVICE_ADDRESS = "Acasa";
    //private static final String USER_ID = "764f63c7-daf7-4f2c-a604-c8041693252b";
    private static final String HOST = "localhost";
    private final static int PORT = 5672;

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(ReaderApplication.class);
    }

    public static void main(String[] args) throws IOException, InterruptedException, TimeoutException {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        SpringApplication.run(ReaderApplication.class, args);

        File file = new File(CSV_PATH);
        List<String> data = Files.readAllLines(file.toPath());

        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(HOST);
        factory.setPort(PORT);
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        channel.queueDeclare(QUEUE_NAME, true, false, false, null);

        for (String value : data) {
            JSONObject jsonObject = new JSONObject();

            LocalDateTime localDateTime = LocalDateTime.now();
            long unixTimestamp = localDateTime.toEpochSecond(ZoneOffset.UTC);

            jsonObject.put("timestamp", unixTimestamp);
            jsonObject.put("device_id", DEVICE_ID);
            jsonObject.put("user_id", USER_ID);
            jsonObject.put("measurement_value", value);
            jsonObject.put("device_address", DEVICE_ADDRESS);

            channel.basicPublish(EXCHANGE_NAME, ROUTING_KEY, null, jsonObject.toString().getBytes(StandardCharsets.UTF_8));
            System.out.println("Produced: " + jsonObject);

            //localDateTime = localDateTime.plusMinutes(10);
            Thread.sleep(5000);
        }
    }
}
