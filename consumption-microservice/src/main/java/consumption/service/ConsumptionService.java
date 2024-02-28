package consumption.service;

import consumption.config.JwtUtilService;
import consumption.controller.exception.AuthException;
import consumption.dto.ConsumptionDto;
import consumption.entity.Consumption;
import consumption.entity.Device;
import consumption.repository.ConsumptionRepository;
import consumption.repository.DeviceRepository;
import org.apache.catalina.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConsumptionService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final ConsumptionRepository consumptionRepository;
    private final DeviceRepository deviceRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtUtilService jwtUtilService;

    public ConsumptionService(ConsumptionRepository consumptionRepository, DeviceRepository deviceRepository, SimpMessagingTemplate messagingTemplate, JwtUtilService jwtUtilService) {
        this.consumptionRepository = consumptionRepository;
        this.deviceRepository = deviceRepository;
        this.messagingTemplate = messagingTemplate;
        this.jwtUtilService = jwtUtilService;
    }

    public void saveConsumption(Consumption consumption) {
        consumptionRepository.save(consumption);
        sendNotification(consumption);
    }

    public void sendNotification(Consumption consumption) {
        List<Consumption> consumptionList = consumptionRepository
                .findAllInLastHour(consumption.getUserId(), consumption.getDeviceId(), consumption.getTimestamp() - 3600, consumption.getTimestamp());

        double lastHourConsumption = consumption.getEnergyConsumption() - consumptionList.get(0).getEnergyConsumption() > 0 ?
                consumption.getEnergyConsumption() - consumptionList.get(0).getEnergyConsumption() : 0.0;
        System.out.println("Last hour consumption: " + lastHourConsumption);

        Optional<Device> device = deviceRepository.findById(consumption.getDeviceId());
        if (device.isPresent()) {
            if (device.get().getMaxEnergyConsumption() < lastHourConsumption) {
                String url = "/topic/" + consumption.getUserId().toString() + "/notification";
                String notification = device.get().getDescription() + " from address " + consumption.getAddress() + " has exceeded the maximum consumption limit!";
                messagingTemplate.convertAndSend(url, notification);
            }
        }
    }

    public List<ConsumptionDto> getConsumptionByUserAndTimestamp(String authHeader, UUID userId, long timestamp){
        if (!jwtUtilService.isClientTokenValid(authHeader)){
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }

        List<Consumption> consumptions = consumptionRepository.findAllByUserAndTimestamp(userId, timestamp, timestamp + 3600 * 24 - 1);
        List<ConsumptionDto> consumptionDtos = new ArrayList<>();

        for (int i = 0; i < 24; i++){
            double currentConsumption = 0;
            for (Consumption consumption : consumptions){
                if (consumption.getTimestamp() >= timestamp + i * 3600 &&  consumption.getTimestamp() < timestamp + (i + 1) * 3600) {
                    currentConsumption += consumption.getEnergyConsumption();
                }
            }
            ConsumptionDto consumptionDto = new ConsumptionDto(i, currentConsumption );
            consumptionDtos.add(consumptionDto);
        }

        return consumptionDtos;
    }
}
