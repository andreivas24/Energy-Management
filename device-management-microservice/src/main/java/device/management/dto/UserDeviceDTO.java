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
public class UserDeviceDTO {
    private UUID id;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID deviceId;

    @NotNull
    @FieldLengthLimit
    private String userName;

    @NotNull
    @FieldLengthLimit
    private String deviceDescription;

    @NotNull
    @FieldLengthLimit
    private String address;
}
