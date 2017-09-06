package fr.antoinecheron.zenelectricity.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Created by antoine on 31/08/2017.
 */
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum PowerPlantType {

    // Possible types
    HYDROELECTRIC(2, 6),
    SOLAR(2, 1),
    WINDMILL(3,3),
    NUCLEAR(5,5),
    GAS(5,2),
    BIOMASS(1, 12);

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
