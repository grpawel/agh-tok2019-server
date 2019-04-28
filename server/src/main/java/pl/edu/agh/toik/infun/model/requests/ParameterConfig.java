package pl.edu.agh.toik.infun.model.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParameterConfig {
    public String value;
    public String name;
    public boolean required;

}