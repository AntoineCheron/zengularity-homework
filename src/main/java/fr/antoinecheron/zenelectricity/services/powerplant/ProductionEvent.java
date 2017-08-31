package fr.antoinecheron.zenelectricity.services.powerplant;


/**
 * Created by antoine on 31/08/2017.
 */
public class ProductionEvent {

    // Attributes
    private final long timestamp;
    private final boolean producing;

    // Constructor
    ProductionEvent(boolean producing) {
        this.producing = producing;
        this.timestamp = System.currentTimeMillis() / 1000L;
    }

    // Accessors
    public long getTimestamp () {
        return this.timestamp;
    }

    public boolean isProducing () {
        return producing;
    }
}
