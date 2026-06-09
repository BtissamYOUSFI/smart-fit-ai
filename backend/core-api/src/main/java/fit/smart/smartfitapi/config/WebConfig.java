package fit.smart.smartfitapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirige la racine "/" directement vers la page Swagger
        registry.addRedirectViewController("/", "/swagger-ui/index.html");
    }
}
