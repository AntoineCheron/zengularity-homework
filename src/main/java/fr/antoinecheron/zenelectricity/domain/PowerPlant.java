package fr.antoinecheron.zenelectricity.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.hateoas.ResourceSupport;

import java.util.ArrayList;
import java.util.UUID;

/**
 * Created by antoine on 31/08/2017.
 */
public class PowerPlant extends ResourceSupport {

    // Attributes
    @Id
    private final String id;
    private String name;
    private PowerPlantType type;
    private int capacity;
    private boolean producing;
    private ArrayList<ProductionEvent> events;

    // Constructor
    @JsonCreator
    public PowerPlant (@JsonProperty("name") String name,
                       @JsonProperty("type") String type,
                       @JsonProperty("capacity") int capacity) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.capacity = capacity;
        this.events = new ArrayList<>();

        // The power plant start producing on creation
        this.producing = true;
        this.events.add(new ProductionEvent(true));


        switch (type) {
            case "hydroelectric":
                this.type = PowerPlantType.HYDROELECTRIC;
                break;
            case "nuclear":
                this.type = PowerPlantType.NUCLEAR;
                break;
            case "gas":
                this.type = PowerPlantType.GAS;
                break;
            case "solar":
                this.type = PowerPlantType.SOLAR;
                break;
            case "biomass":
                this.type = PowerPlantType.BIOMASS;
                break;
            case "windmill":
                this.type = PowerPlantType.WINDMILL;
                break;
        }
    }

    // Accessors

    public String getName () {
        return this.name;
    }

    public String getType () {
        return this.type.name();
    }

    public int getCapacity () {
        return this.capacity;
    }

    public boolean isProducing () {
        return this.producing;
    }

    public boolean isConsuming () {
        return !this.isProducing();
    }


    // Control methods

    public void startProduction () {
        if (!this.producing) {
            this.producing = true;
            this.events.add(new ProductionEvent(true));
        }
    }

    public void startConsumption () {
        if (this.producing) {
            this.producing = false;
            this.events.add(new ProductionEvent(false));
        }
    }
}
