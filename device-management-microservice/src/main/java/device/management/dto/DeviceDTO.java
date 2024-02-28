package device.management.dto;

import device.management.dto.validator.annotation.FieldLengthLimit;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeviceDTO {
    private UUID id;

    @NotNull
    @FieldLengthLimit
    private String description;

    @NotNull
    private int energyConsumption;
}
