package message.repository;

import message.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    List<GroupMember> findAllByUserId(UUID userId);
    List<GroupMember> findAllByGroupId(UUID groupId);
}
