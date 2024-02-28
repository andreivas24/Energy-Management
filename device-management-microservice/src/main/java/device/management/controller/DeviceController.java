package device.management.controller;

import device.management.dto.ClientDeviceDTO;
import device.management.dto.DeviceDTO;
import device.management.dto.UserDeviceDTO;
import device.management.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @PostMapping("/admin/devices")
    public ResponseEntity saveDevice(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody DeviceDTO dto) throws IOException {
        deviceService.saveDevice(authHeader, dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/admin/devices")
    public ResponseEntity<List<DeviceDTO>> getAllDevices(@RequestHeader("Authorization") String authHeader) {
        List<DeviceDTO> deviceDTOList = deviceService.getAllDevices(authHeader);
        return new ResponseEntity<>(deviceDTOList, HttpStatus.OK);
    }

    @GetMapping("/admin/devices/{id}")
    public ResponseEntity<DeviceDTO> getDeviceById(@RequestHeader("Authorization") String authHeader, @PathVariable("id") UUID id) {
        DeviceDTO deviceDTO = deviceService.getDeviceById(authHeader, id);
        return new ResponseEntity<>(deviceDTO, HttpStatus.OK);
    }

    @DeleteMapping("/admin/devices/{id}")
    public ResponseEntity deleteDeviceById(@RequestHeader("Authorization") String authHeader, @PathVariable("id") UUID id) throws IOException {
        deviceService.deleteDeviceById(authHeader, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/admin/devices/{id}")
    public ResponseEntity updateDevice(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody DeviceDTO dto, @PathVariable("id") UUID id) throws IOException {
        deviceService.updateDevice(authHeader, id, dto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/admin/mappings")
    public ResponseEntity<List<UserDeviceDTO>> getAllUserDevices(@RequestHeader("Authorization") String authHeader) {
        List<UserDeviceDTO> userDeviceDTOList = deviceService.getAllUserDevices(authHeader);
        return new ResponseEntity<>(userDeviceDTOList, HttpStatus.OK);
    }

    @GetMapping("/client/devices/{id}")
    public ResponseEntity<List<ClientDeviceDTO>> getAllDevicesByUserId(@RequestHeader("Authorization") String authHeader, @PathVariable("id") UUID userId) {
        List<ClientDeviceDTO> deviceDTOList = deviceService.getAllDevicesByUserId(authHeader, userId);
        return new ResponseEntity<>(deviceDTOList, HttpStatus.OK);
    }

    @PostMapping("/admin/mappings")
    public ResponseEntity assignDeviceToUser(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody UserDeviceDTO dto) {
        deviceService.assignDeviceToUser(authHeader, dto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity deleteAllDevicesByUserId(@PathVariable("id") UUID id) {
        deviceService.deleteAllDevicesByUserId(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/admin/mappings")
    public ResponseEntity deleteUserDevice(@RequestHeader("Authorization") String authHeader, @RequestParam(name = "id") UUID id) {
        deviceService.deleteUserDevice(authHeader, id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/admin/mappings/{id}")
    public ResponseEntity updateUserName(@PathVariable("id") UUID id, @RequestParam(name = "name") String name) {
        deviceService.updateUserName(id, name);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PostMapping("/register")
    public ResponseEntity registerDevice(@Valid @RequestBody DeviceDTO dto) {
        deviceService.registerDevice(dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
