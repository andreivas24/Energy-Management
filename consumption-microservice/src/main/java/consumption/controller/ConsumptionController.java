package consumption.controller;

import consumption.dto.ConsumptionDto;
import consumption.service.ConsumptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
@CrossOrigin
@RequestMapping(value = "/client")
public class ConsumptionController {
    private final ConsumptionService consumptionService;

    public ConsumptionController(ConsumptionService consumptionService) {
        this.consumptionService = consumptionService;
    }

    @GetMapping("/consumptions/{userId}/{timestamp}")
    public ResponseEntity<List<ConsumptionDto>> getConsumptionByUserAndTimestamp(@RequestHeader("Authorization") String authHeader, @PathVariable("userId") UUID userId, @PathVariable("timestamp") long timestamp) {
        List<ConsumptionDto> consumptionDtos = consumptionService.getConsumptionByUserAndTimestamp(authHeader, userId, timestamp);
        return new ResponseEntity<>(consumptionDtos, HttpStatus.OK);
    }
}
