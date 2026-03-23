package com.duyduciu.workout_tracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WorkoutTrackingApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkoutTrackingApplication.class, args);
	}

}
