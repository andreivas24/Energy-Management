package consumption.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "devices")
public class Device {
    @Id
    private UUID id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "maxConsumption", nullable = false)
    private double maxEnergyConsumption;

    public Device(UUID id, String description, double maxEnergyConsumption) {
        this.description = description;
        this.id = id;
        this.maxEnergyConsumption = maxEnergyConsumption;
    }
}
