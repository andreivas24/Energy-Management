package consumption.repository;

import consumption.entity.Consumption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConsumptionRepository extends JpaRepository<Consumption, UUID> {
    List<Consumption> findAllByDeviceId(UUID deviceID);
    @Query("SELECT c FROM Consumption c " +
            "WHERE c.timestamp >= :startTime " +
            "AND c.timestamp <= :endTime " +
            "AND c.deviceId = :deviceId " +
            "AND c.userId = :userId " +
            "ORDER BY c.timestamp ASC")
    List<Consumption> findAllInLastHour(
            @Param("userId") UUID userId,
            @Param("deviceId") UUID deviceId,
            @Param("startTime") Long startTime,
            @Param("endTime") Long endTime
    );

    @Query("SELECT c FROM Consumption c " +
            "WHERE c.timestamp >= :startTime " +
            "AND c.timestamp <= :endTime " +
            "AND c.userId = :userId " +
            "ORDER BY c.timestamp ASC")
    List<Consumption> findAllByUserAndTimestamp(
            @Param("userId") UUID userId,
            @Param("startTime") Long startTime,
            @Param("endTime") Long endTime
    );
}
