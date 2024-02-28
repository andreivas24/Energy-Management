package consumption.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "consumptions")
public class Consumption {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;

    @Column(name = "userId", nullable = false)
    private UUID userId;

    @Column(name = "deviceId", nullable = false)
    private UUID deviceId;

    @Column(name = "consumption", nullable = false)
    private double energyConsumption;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "timestamp", nullable = false)
    private long timestamp;
}
