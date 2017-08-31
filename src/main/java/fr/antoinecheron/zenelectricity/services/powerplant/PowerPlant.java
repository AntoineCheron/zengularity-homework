package fr.antoinecheron.zenelectricity.services.powerplant;

import java.util.ArrayList;

/**
 * Created by antoine on 31/08/2017.
 */
public class PowerPlant {

    // Attributes
    private final long id;
    private String name;
    private PowerPlantType type;
    private int capacity;
    private boolean producing;
    private ArrayList<ProductionEvent> events;

    // Constructor
    public PowerPlant (long id, String name, String type, int capacity) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.events = new ArrayList();

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
    public long getId () {
        return this.id;
    }

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
