package fit.smart.smartfitapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
//        we'll place here our frontend, localhost, fast api service and deployment server's ip address
        config.setAllowedOrigins(List.of(
                "http://localhost:8081",
                "http://localhost:4200",
                "http://3.236.208.61:4200",
                "http://10.0.2.2:8080",
                "http://192.168.137.138:8080",
                "http://54.221.13.194",        // IP Frontend
                "http://54.221.13.194:8080",
                "http://192.168.1.19:8081",
                "http://34.203.224.177",
                "http://34.203.224.177:8081",
                "http://34.203.224.177:4200"

        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
