package com.trr.readers_room_api;

import java.util.TimeZone;

import com.trr.readers_room_api.roles.roleRepository;
import com.trr.readers_room_api.roles.roleEntity;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class ReadersRoomApiApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(ReadersRoomApiApplication.class, args);
    }

    @Bean
	public CommandLineRunner runner(roleRepository roleRepository) {
		return args -> {
			if (roleRepository.findByName("USER").isEmpty()) {
				roleRepository.save(roleEntity.builder().name("USER").build());
			}
		};
	}

}
