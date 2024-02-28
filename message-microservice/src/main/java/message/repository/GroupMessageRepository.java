package message.repository;

import message.entity.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupMessageRepository extends JpaRepository<GroupMessage, UUID> {
    @Query("SELECT m FROM GroupMessage m WHERE m.groupId = :groupId ORDER BY m.timestamp DESC ")
    List<GroupMessage> findAllByGroupId(@Param("groupId") UUID groupId);
}
