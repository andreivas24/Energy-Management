package device.management.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "usersDevices")
public class UserDevice {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "device_id", nullable = false)
    private UUID deviceId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "device_description", nullable = false)
    private String deviceDescription;

    @Column(name = "address", nullable = false)
    private String address;

    public UserDevice(UUID userId, UUID deviceId, String userName, String deviceDescription, String address) {
        this.userId = userId;
        this.deviceId = deviceId;
        this.userName = userName;
        this.deviceDescription = deviceDescription;
        this.address = address;
    }
}
