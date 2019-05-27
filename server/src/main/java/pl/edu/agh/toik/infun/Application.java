package pl.edu.agh.toik.infun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@EnableCaching
@ComponentScan(basePackages = {"pl.edu.agh.toik.infun.controllers", "pl.edu.agh.toik.infun.services", "resources", "pl.edu.agh.toik.infun.model", "pl.edu.agh.toik.infun.config", "pl.edu.agh.toik.infun.handlers"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
