package message.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupMessageDto {
    @NotNull
    private UUID senderId;

    @NotEmpty
    private String senderName;

    @NotNull
    private UUID groupId;

    @NotEmpty
    private String content;

    @NotNull
    private Long timestamp;
}
