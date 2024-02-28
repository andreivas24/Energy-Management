package device.management.dto.mapper;

import device.management.entity.Device;
import device.management.dto.DeviceDTO;

public class DeviceMapper {
    public static Device mapToEntity(DeviceDTO deviceDTO) {
        return new Device(deviceDTO.getDescription(), deviceDTO.getEnergyConsumption());
    }

    public static DeviceDTO mapToDTO(Device device) {
        return new DeviceDTO(device.getId(), device.getDescription(), device.getEnergyConsumption());
    }
}
