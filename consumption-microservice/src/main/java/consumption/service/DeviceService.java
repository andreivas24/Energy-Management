package consumption.service;

import consumption.entity.Consumption;
import consumption.entity.Device;
import consumption.repository.ConsumptionRepository;
import consumption.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final ConsumptionRepository consumptionRepository;

    public DeviceService(DeviceRepository deviceRepository, ConsumptionRepository consumptionRepository) {
        this.deviceRepository = deviceRepository;
        this.consumptionRepository = consumptionRepository;
    }

    public void saveDevice(Device device){
        deviceRepository.save(device);
    }

    public void updateDevice(Device device){
        Optional<Device> founded = deviceRepository.findById(device.getId());
        if (founded.isPresent()) {
            deviceRepository.save(device);
        }
    }

    public void deleteDevice(Device device){
        Optional<Device> founded = deviceRepository.findById(device.getId());
        if (!founded.isPresent()) {
            founded.get().setMaxEnergyConsumption(device.getMaxEnergyConsumption());
            deviceRepository.delete(device);

            List<Consumption> consumptionList = consumptionRepository.findAllByDeviceId(device.getId());
            for (Consumption consumption : consumptionList) {
                consumptionRepository.delete(consumption);
            }
        }
    }
}
