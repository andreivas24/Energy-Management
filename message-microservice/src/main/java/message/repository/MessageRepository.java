package message.repository;

import message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    @Query("SELECT m FROM Message m " +
            "WHERE m.senderId = :senderId AND m.receiverId = :receiverId " +
            "OR m.senderId = :receiverId AND m.receiverId = :senderId " +
            "ORDER BY m.timestamp DESC")
    List<Message> findAllBySenderIdAndReceiverId(
            @Param("senderId") UUID senderId,
            @Param("receiverId") UUID receiverId
    );
}
