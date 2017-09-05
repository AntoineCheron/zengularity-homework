package fr.antoinecheron.zenelectricity.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.hateoas.ResourceSupport;

/**
 * Created by antoine on 31/08/2017.
 */
@Document
public class PowerPlant extends ResourceSupport {

    // Attributes
    @Id
    private String id;
    private String name;
    private String type;
    private int capacity;
    private boolean producing;
    private final String owner;

    // Constructor
    @JsonCreator
    public PowerPlant (@JsonProperty(value="name") String name,
                       @JsonProperty(value="type") String type,
                       @JsonProperty(value="capacity") int capacity,
                       @JsonProperty(value="owner") String owner) {
        this.name = name;
        this.capacity = capacity;
        this.owner = owner;
        // Makes sure the type corresponds to a PowerPlantType
        this.type = PowerPlantType.valueOf(type.toUpperCase()).toString();

        // The power plant start producing on creation
        this.producing = true;
    }

    // Accessors

    public String getPowerPlantId () {
        return this.id;
    }

    public void setId (String id) {
        this.id = id;
    }

    public String getName () {
        return this.name;
    }

    public String getType () {
        return this.type;
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

    public String getOwner () { return this.owner; }


    // Control methods

    public void startProduction () {
        if (!this.producing) {
            this.producing = true;
        }
    }

    public void startConsumption () {
        if (this.producing) {
            this.producing = false;
        }
    }
}
