package user.management.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import user.management.dto.validator.annotation.FieldLengthLimit;
import user.management.entity.Role;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserContactDto {
    private UUID id;

    @NotNull
    @FieldLengthLimit
    private String name;

    @NotNull
    private Role role;
}
