package device.management.service;

import device.management.config.JwtUtilService;
import device.management.controller.exception.AuthException;
import device.management.controller.exception.ResourceNotFoundException;
import device.management.dto.ClientDeviceDTO;
import device.management.dto.DeviceDTO;
import device.management.dto.UserDeviceDTO;
import device.management.dto.mapper.DeviceMapper;
import device.management.dto.mapper.UserDeviceMapper;
import device.management.entity.Device;
import device.management.entity.UserDevice;
import device.management.repository.DeviceRepository;
import device.management.repository.UserDeviceRepository;
import org.apache.catalina.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;
    private final UserDeviceRepository userDeviceRepository;
    private final JwtUtilService jwtUtilService;
    private final RabbitMQProducer rabbitMQProducer;

    public DeviceService(DeviceRepository deviceRepository, UserDeviceRepository userDeviceRepository, JwtUtilService jwtUtilService, RabbitMQProducer rabbitMQProducer) {
        this.deviceRepository = deviceRepository;
        this.userDeviceRepository = userDeviceRepository;
        this.jwtUtilService = jwtUtilService;
        this.rabbitMQProducer = rabbitMQProducer;
    }

    public void saveDevice(String authHeader, DeviceDTO deviceDTO) throws IOException {
        validateAdminRole(authHeader);
        Device device = DeviceMapper.mapToEntity(deviceDTO);
        deviceRepository.save(device);
        rabbitMQProducer.sendDevice(device, "create");
    }

    public List<DeviceDTO> getAllDevices(String authHeader) {
        validateAdminRole(authHeader);
        return deviceRepository.findAll()
                .stream()
                .map(DeviceMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    public DeviceDTO getDeviceById(String authHeader, UUID id) {
        validateAdminRole(authHeader);
        Optional<Device> device = deviceRepository.findById(id);
        if (!device.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return DeviceMapper.mapToDTO(device.get());
    }

    public void deleteDeviceById(String authHeader, UUID id) throws IOException {
        validateAdminRole(authHeader);
        Optional<Device> device = deviceRepository.findById(id);
        if (!device.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        deviceRepository.delete(device.get());
        rabbitMQProducer.sendDevice(device.get(), "delete");

        List<UserDevice> userDeviceList = userDeviceRepository.findAllByDeviceId(id);
        for (UserDevice userDevice : userDeviceList) {
            userDeviceRepository.delete(userDevice);
        }
    }

    public void updateDevice(String authHeader, UUID id, DeviceDTO deviceDTO) throws IOException {
        validateAdminRole(authHeader);
        Optional<Device> device = deviceRepository.findById(id);
        if (!device.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        if (!device.get().getDescription().equals(deviceDTO.getDescription())){
            device.get().setDescription(deviceDTO.getDescription());
            updateDeviceDescription(device.get().getId(), deviceDTO.getDescription());
        }
        device.get().setEnergyConsumption(deviceDTO.getEnergyConsumption());
        deviceRepository.save(device.get());
        rabbitMQProducer.sendDevice(device.get(), "update");
    }

    public List<UserDeviceDTO> getAllUserDevices(String authHeader) {
        validateAdminRole(authHeader);
        return userDeviceRepository.findAll()
                .stream()
                .map(UserDeviceMapper::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ClientDeviceDTO> getAllDevicesByUserId(String authHeader, UUID userId) {
        if (!jwtUtilService.isClientTokenValid(authHeader)){
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
        List<UserDevice> userDeviceList =  userDeviceRepository.findAllByUserId(userId);
        List<ClientDeviceDTO> clientDeviceDTOList = new ArrayList<>();

        for (UserDevice userDevice: userDeviceList){
            Optional<Device> device = deviceRepository.findById(userDevice.getDeviceId());
            if (device.isPresent()){
                ClientDeviceDTO dto = new ClientDeviceDTO(device.get().getDescription(), userDevice.getAddress(), device.get().getEnergyConsumption());
                clientDeviceDTOList.add(dto);
            }
        }

        return clientDeviceDTOList;
    }
    public void assignDeviceToUser(String authHeader, UserDeviceDTO dto) {
        validateAdminRole(authHeader);
        UserDevice userDevice = UserDeviceMapper.mapToEntity(dto);
        userDeviceRepository.save(userDevice);
    }

    public void deleteAllDevicesByUserId(UUID userId) {
        List<UserDevice> userDeviceList = userDeviceRepository.findAllByUserId(userId);
        for (UserDevice userDevice : userDeviceList) {
            userDeviceRepository.delete(userDevice);
        }
    }

    public void deleteUserDevice(String authHeader, UUID id) {
        validateAdminRole(authHeader);
        Optional<UserDevice> userDevice = userDeviceRepository.findById(id);
        if (!userDevice.isPresent()) {
            LOGGER.error("UserDevice with id {} was not found in db", id);
            throw new ResourceNotFoundException(UserDevice.class.getSimpleName()  + " with id: " + id + " was not found.");
        }
        userDeviceRepository.delete(userDevice.get());
    }

    public void updateUserName(UUID userId, String userName) {
        List<UserDevice> userDeviceList = userDeviceRepository.findAllByUserId(userId);
        for (UserDevice userDevice: userDeviceList){
            userDevice.setUserName(userName);
            userDeviceRepository.save(userDevice);
        }
    }

    public void updateDeviceDescription(UUID deviceId, String deviceDescription) {
        List<UserDevice> userDeviceList = userDeviceRepository.findAllByDeviceId(deviceId);
        for (UserDevice userDevice: userDeviceList){
            userDevice.setDeviceDescription(deviceDescription);
            userDeviceRepository.save(userDevice);
        }
    }

    public void validateAdminRole(String authHeader){
        if (!jwtUtilService.isAdminTokenValid(authHeader)){
            LOGGER.error("Access denied");
            throw new AuthException(User.class.getSimpleName() + " is not allowed to do this operation");
        }
    }

    public void registerDevice(DeviceDTO deviceDTO) {
        Device device = DeviceMapper.mapToEntity(deviceDTO);
        deviceRepository.save(device);
    }
}
