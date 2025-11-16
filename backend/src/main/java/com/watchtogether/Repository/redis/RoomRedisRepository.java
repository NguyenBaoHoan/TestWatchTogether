package com.watchtogether.Repository.redis;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.watchtogether.Entity.redis.Room;

@Repository
// Kế thừa JpaRepository để có các hàm cơ bản như save(), findById(), delete().
// Spring Data sẽ tự động nhận diện đây là repository cho Redis vì model Room có annotation @RedisHash.
public interface RoomRedisRepository  extends JpaRepository<Room, String> {
}
