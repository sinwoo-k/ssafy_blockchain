package com.c109.chaintoon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@ConfigurationPropertiesScan
public class ChaintoonApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChaintoonApplication.class, args);
	}

}
