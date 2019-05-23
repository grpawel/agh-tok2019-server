package pl.edu.agh.toik.infun.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import pl.edu.agh.toik.infun.model.requests.ParameterConfig;

import java.util.List;

@Data
public class ConfigDTO {
    private List<ParameterConfig> config;
    @JsonProperty("group")
    private String room;
    private String nick;
    private int age;
}
