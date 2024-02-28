package device.management.dto.mapper;

import device.management.dto.UserDeviceDTO;
import device.management.entity.UserDevice;

public class UserDeviceMapper {
    public static UserDevice mapToEntity(UserDeviceDTO dto) {
        return new UserDevice(dto.getUserId(), dto.getDeviceId(), dto.getUserName(), dto.getDeviceDescription(), dto.getAddress());
    }

    public static UserDeviceDTO mapToDTO(UserDevice userDevice) {
        return new UserDeviceDTO(userDevice.getId(), userDevice.getUserId(), userDevice.getDeviceId(),
                userDevice.getUserName(), userDevice.getDeviceDescription(), userDevice.getAddress());
    }
}
