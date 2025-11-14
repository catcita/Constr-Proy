package com.example.adoptions_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOriginPatterns(
            "http://localhost:3000", 
            "http://localhost:3001", 
            "http://192.168.1.6:3000", 
            "https://localhost", 
            "https://localhost:443",
            "https://petscloud.cl",
            "http://petscloud.cl",
            "https://*.petscloud.cl",
            "*"
        )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
