package consumption.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import consumption.entity.Consumption;
import consumption.entity.Device;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Service
public class RabbitMQConsumer {
    private final ConsumptionService consumptionService;
    private final DeviceService deviceService;

    public RabbitMQConsumer(ConsumptionService consumptionService, DeviceService deviceService) {
        this.consumptionService = consumptionService;
        this.deviceService = deviceService;
    }

    @RabbitListener(queues = {"${rabbitmq.queue.consumption}"})
    public void consumeFromConsumptionQueue(String message) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        double measurementValue = Double.parseDouble(jsonNode.get("measurement_value").asText());
        UUID deviceId = UUID.fromString(jsonNode.get("device_id").asText());
        UUID userId = UUID.fromString(jsonNode.get("user_id").asText());
        String address = jsonNode.get("device_address").asText();
        long timestamp = jsonNode.get("timestamp").asLong();

        System.out.println();
        System.out.println("Measurement Value: " + measurementValue);
        System.out.println("Device ID: " + deviceId);
        System.out.println("User ID: " + userId);
        System.out.println("Address: " + address);
        System.out.println("Timestamp: " + timestamp);

        Consumption consumption = new Consumption();
        consumption.setEnergyConsumption(measurementValue);
        consumption.setDeviceId(deviceId);
        consumption.setUserId(userId);
        consumption.setAddress(address);
        consumption.setTimestamp(timestamp);

        consumptionService.saveConsumption(consumption);
    }

    @RabbitListener(queues = {"${rabbitmq.queue.device}"})
    public void consumeFromDeviceQueue(String message) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        UUID id = UUID.fromString(jsonNode.get("device_id").asText());
        double energyConsumption = Double.parseDouble(jsonNode.get("energy_consumption").asText());
        String description = jsonNode.get("description").asText();
        String operation = jsonNode.get("operation").asText();

        System.out.println();
        System.out.println("Device ID: " + id);
        System.out.println("Energy Consumption: " + energyConsumption);
        System.out.println("Description: " + description);
        System.out.println("Operation: " + operation);
        Device device = new Device(id, description, energyConsumption);

        if (operation.equals("create") ) {
            deviceService.saveDevice(device);
        }
        else if (operation.equals("update")) {
            deviceService.updateDevice(device);
        }
        else if (operation.equals("delete")) {
            deviceService.deleteDevice(device);
        }
    }
}
