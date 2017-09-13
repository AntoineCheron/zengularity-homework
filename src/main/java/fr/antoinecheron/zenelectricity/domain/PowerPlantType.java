package fr.antoinecheron.zenelectricity.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Created by antoine on 31/08/2017.
 */
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum PowerPlantType {

    // Possible types
    HYDROELECTRIC(20, 60),
    SOLAR(20, 10),
    WINDMILL(30,30),
    NUCLEAR(50,50),
    GAS(50,20),
    BIOMASS(10, 80);

    private final double percentageConsumedPerHour;
    private final double percentageProducedPerHour;

    // Constructor

    PowerPlantType (double consumption, double production) {
        this.percentageConsumedPerHour = consumption;
        this.percentageProducedPerHour = production;
    }

    // GETTERS

    public String getName () {
        return this.name().toLowerCase();
    }

    public double getPercentageConsumedPerHour () {
        return this.percentageConsumedPerHour;
    }

    public double getPercentageProducedPerHour () {
        return this.percentageProducedPerHour;
    }

    @Override
    public String toString () {
        return this.name().toLowerCase();
    }
}
