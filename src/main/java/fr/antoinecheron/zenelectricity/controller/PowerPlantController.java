package fr.antoinecheron.zenelectricity.controller;

import fr.antoinecheron.zenelectricity.domain.PowerPlant;
import fr.antoinecheron.zenelectricity.domain.PowerPlantType;
import fr.antoinecheron.zenelectricity.domain.ProductionEvent;
import fr.antoinecheron.zenelectricity.repository.ApplicationUserRepository;
import fr.antoinecheron.zenelectricity.repository.PowerPlantRepository;
import fr.antoinecheron.zenelectricity.repository.ProductionEventRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.*;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

/**
 * Created by antoine on 31/08/2017.
 */

@RestController
@CrossOrigin
@RequestMapping(value="/API/powerplants")
public class PowerPlantController extends ControllerHelper {

    // Attributes
    private PowerPlantRepository powerPlantRepository;
    private ProductionEventRepository productionEventRepository;

    public PowerPlantController (PowerPlantRepository powerPlantRepository,
                                 ProductionEventRepository productionEventRepository,
                                 ApplicationUserRepository applicationUserRepository) {

        super(applicationUserRepository);
        this.powerPlantRepository = powerPlantRepository;
        this.productionEventRepository = productionEventRepository;
    }


    @RequestMapping(method = GET, value = "/{powerPlantId}")
    public HttpEntity<Mono<PowerPlant>> getPowerPlant (@PathVariable String powerPlantId) {
        PowerPlant powerPlant = powerPlantRepository
                .findByIdAndOwner(powerPlantId, this.getAuthenticatedUsersId())
                .block();

        if (powerPlant != null) {
            powerPlant.add(linkTo(methodOn(PowerPlantController.class).getPowerPlant(powerPlant.getPowerPlantId())).withSelfRel());
            powerPlant.add(linkTo(methodOn(ProductionEventController.class).getPowerPlantsEvents(powerPlant.getPowerPlantId())).withRel("events"));

            return new ResponseEntity<>(Mono.just(powerPlant), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(Mono.empty(), HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(method = POST, value = "/{powerPlantId}")
    public void updatePowerPlant(@PathVariable String powerPlantId, @RequestBody PowerPlant powerPlant) {
        // Retrieve the previous version of the powerplant to perform computations
        PowerPlant previous = powerPlantRepository.findByIdAndOwner(powerPlantId, this.getAuthenticatedUsersId()).block();

        if (previous == null) { return; }

        powerPlant.setId(powerPlantId);

        // Perform a few computations
        if (previous.isConsuming() != powerPlant.isConsuming() && previous.isConsuming()) {
            // Switch to producing mode
            powerPlant.startProduction();
            // Create a new production event
            ProductionEvent startProdEvent = new ProductionEvent(true, powerPlant.getPowerPlantId());
            // Set its charge value
            startProdEvent.setPowerPlantCharge(computePowerPlantCharge(previous));
            // Store it into the db
            productionEventRepository.save(startProdEvent).subscribe();
        } else if (previous.isConsuming() != powerPlant.isConsuming() && previous.isProducing()) {
            // Switch to consumption mode
            powerPlant.startConsumption();
            // Create a new production event
            ProductionEvent startConsEvent = new ProductionEvent(false, powerPlant.getPowerPlantId());
            // Set its charge value
            startConsEvent.setPowerPlantCharge(computePowerPlantCharge(previous));
            productionEventRepository.save(startConsEvent).subscribe();
        }

        powerPlantRepository.save(powerPlant).subscribe();
    }

    @RequestMapping(method = DELETE, value = "/{powerPlantId}")
    public void deletePowerPlant(@PathVariable String powerPlantId) {
        // Retrieve the powerplant
        PowerPlant powerPlant = powerPlantRepository.findByIdAndOwner(powerPlantId, this.getAuthenticatedUsersId()).block();

        // Makes sure the powerplant is owned by the currently connected user
        if (powerPlant != null) {
            powerPlantRepository.delete(powerPlant).subscribe();
        }
    }


    @RequestMapping(method = GET)
    public HttpEntity<Flux<PowerPlant>> powerPlant () {

        // Retrieve all the powerplants owned by the currently connected user
        Iterable<PowerPlant> dlPowerPlants = powerPlantRepository.findByOwner(this.getAuthenticatedUsersId())
                                                .toIterable();
        List<PowerPlant> powerPlants = new ArrayList<>();

        // Add hyperlinks to the powerplants
        for (PowerPlant powerPlant: dlPowerPlants) {
            powerPlant.add(linkTo(methodOn(PowerPlantController.class).getPowerPlant(powerPlant.getPowerPlantId()))
                    .withSelfRel());

            powerPlant.add(linkTo(methodOn(PowerPlantTypesController.class).getAllTypes()).withRel("types"));
            powerPlant.add(linkTo(methodOn(ProductionEventController.class)
                    .getPowerPlantsEvents(powerPlant.getPowerPlantId())).withRel("events"));

            powerPlants.add(powerPlant);
        }

        // Send the data as the response
        return new ResponseEntity<>(Flux.fromIterable(powerPlants), HttpStatus.OK);
    }

    @RequestMapping(method = PUT)
    public HttpEntity<Mono<PowerPlant>> createPowerPlant(@RequestBody PowerPlant powerPlant) {
        // Store the authenticated user's id as the powerplant's owner field
        powerPlant.setOwner(this.getAuthenticatedUsersId());

        // Save the newly created powerplant
        powerPlantRepository.save(powerPlant).subscribe();

        // Retrieve it to get its id
        PowerPlant p = powerPlantRepository.findByOwnerAndName(powerPlant.getOwner(), powerPlant.getName()).block();

        if (p != null) {
            // Create the first production event
            ProductionEvent firstEvent = new ProductionEvent(true, p.getPowerPlantId());
            firstEvent.setPowerPlantCharge(0);

            // Store this event into the db
            productionEventRepository.save(firstEvent).subscribe();

            // Returns the newly created powerplant
            return new ResponseEntity<>(Mono.just(p), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(Mono.empty(), HttpStatus.BAD_REQUEST);
        }
    }

    /* -----------------------------------------------------------------------------------------------------------------
                                    PRIVATE METHODS
     ---------------------------------------------------------------------------------------------------------------- */

    /**
     * Compute the charge of the given PowerPlant. Also create a out-of-bound event if needed.
     *
     * A out-of-bound event is an event with its powerPlantCharge set to 0 or 100 and the timestamp set to the moment
     * when the powerplant's charge dropped to 0 or 100 depending on the production state. It is used in order to store
     * a realistic representation of the history of the powerplant's charge level.
     *
     * @param oldPowerPlant {PowerPlant} the powerplant to compute the charge from
     * @return {int} the powerplant's charge
     */
    private int computePowerPlantCharge (PowerPlant oldPowerPlant) {
        // Retrieve the last event of the powerplant
        ProductionEvent previous = productionEventRepository
                .findFirstByOwningPowerPlantOrderByTimestampDesc(oldPowerPlant.getPowerPlantId()).block();

        // Retrieve other data needed for the computation
        long currentTimestamp = System.currentTimeMillis() / 1000L;
        PowerPlantType type = PowerPlantType.valueOf(oldPowerPlant.getType().toUpperCase());

        // Pre-computation, timestamps are seconds
        long seconds = currentTimestamp - previous.getTimestamp();

        // Compute the current charge
        if (previous.isProducing()) {
            return computeChargeAfterProduction(previous, type.getPercentageProducedPerHour(), seconds, oldPowerPlant);
        } else {
            return computeChargeAfterConsumption(previous, type.getPercentageConsumedPerHour(), seconds, oldPowerPlant);
        }
    }

    private int computeChargeAfterProduction (ProductionEvent previous, double productionRatePerHour, long seconds,
                                              PowerPlant srcPowerPlant) {
        return computeCharge(true, previous, productionRatePerHour, seconds, srcPowerPlant);
    }

    private int computeChargeAfterConsumption (ProductionEvent previous, double consumptionRatePerHour, long seconds,
                                               PowerPlant srcPowerPlant) {


        return computeCharge(false, previous, consumptionRatePerHour, seconds, srcPowerPlant);
    }

    private int computeCharge (boolean isProductionCharge, ProductionEvent previous,
                               double ratePerHour, long seconds, PowerPlant srcPowerPlant) {

        // Compute the charge
        Double chargeAsDouble;
        if (isProductionCharge) {
            chargeAsDouble = previous.getPowerPlantCharge() + (seconds * (ratePerHour / 3600));
        } else {
            chargeAsDouble = previous.getPowerPlantCharge() - (seconds * (ratePerHour / 3600));
        }

        int charge = chargeAsDouble.intValue();

        // Then verify that it is not over 100 or 0, depending on the production state represented by the boolean
        // isProductionChrge
        boolean condition;
        int value;

        // Compute the condition to determine whether the charge level is out of bound.
        if (isProductionCharge) {
            value = 100;
            condition = charge > value;
        } else {
            value = 0;
            condition = charge < value;
        }

        // If the charge level is out of bound, create the zero event, or hundred event.
        if (condition) {
            createOutofboundEvent(previous, ratePerHour,
                    srcPowerPlant.isProducing(), srcPowerPlant.getPowerPlantId());

            return value;
        } else {
            return charge;
        }

    }

    private void createOutofboundEvent (ProductionEvent previous, double rate, boolean isPowerPlantProducing,
                                        String powerPlantId) {
        // First we compute the time the charge raised 1000
        Double timestampDouble;
        if (isPowerPlantProducing) {
            timestampDouble = previous.getTimestamp() + (((100 - previous.getPowerPlantCharge()) / rate) * 3600);
        } else {
            timestampDouble = previous.getTimestamp() + ((previous.getPowerPlantCharge() / rate) * 3600);
        }
        long timestamp = timestampDouble.longValue();

        // Create the new event
        ProductionEvent event = new ProductionEvent(isPowerPlantProducing, powerPlantId);
        event.setTimetstamp(timestamp);
        if (isPowerPlantProducing) {
            event.setPowerPlantCharge(100);
        } else {
            event.setPowerPlantCharge(0);
        }

        // Store it into the DB
        productionEventRepository.save(event).subscribe();
    }
}
