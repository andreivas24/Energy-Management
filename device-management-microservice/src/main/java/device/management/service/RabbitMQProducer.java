package device.management.service;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import device.management.entity.Device;
import net.minidev.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeoutException;

@Service
public class RabbitMQProducer {
    private static final String EXCHANGE_NAME = "exchange_device";
    private static final String QUEUE_NAME = "queue_device";
    private static final String ROUTING_KEY = "key_device";
    private static final String HOST = "localhost";   // LOCAL
    //private static final String HOST = "rabbit-container";      // DOCKER
    private final static int PORT = 5672;
    private final ConnectionFactory factory;
    private final Connection connection;
    private final Channel channel;

    public RabbitMQProducer() throws IOException, TimeoutException {
        this.factory = new ConnectionFactory();
        factory.setHost(HOST);
        factory.setPort(PORT);
        this.connection = factory.newConnection();
        this.channel = connection.createChannel();
        channel.queueDeclare(QUEUE_NAME, true, false, false, null);
    }

    public void sendDevice(Device device, String operation) throws IOException {
        JSONObject jsonObject = new JSONObject();

        jsonObject.put("device_id", device.getId().toString());
        jsonObject.put("energy_consumption", String.valueOf(device.getEnergyConsumption()));
        jsonObject.put("description", device.getDescription());
        jsonObject.put("operation", operation);

        channel.basicPublish(EXCHANGE_NAME, ROUTING_KEY, null, jsonObject.toString().getBytes(StandardCharsets.UTF_8));
        System.out.println("Produced: " + jsonObject);
    }
}
