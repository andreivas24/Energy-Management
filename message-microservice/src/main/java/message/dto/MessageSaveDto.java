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
public class MessageSaveDto {
    @NotNull
    private UUID senderId;

    @NotNull
    private UUID receiverId;

    @NotEmpty
    private String senderName;

    @NotEmpty
    private String receiverName;

    @NotEmpty
    private String content;
}
