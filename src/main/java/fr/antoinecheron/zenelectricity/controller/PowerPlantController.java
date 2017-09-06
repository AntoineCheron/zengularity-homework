package fr.antoinecheron.zenelectricity.controller;

import fr.antoinecheron.zenelectricity.domain.PowerPlant;
import fr.antoinecheron.zenelectricity.domain.ProductionEvent;
import fr.antoinecheron.zenelectricity.repository.ApplicationUserRepository;
import fr.antoinecheron.zenelectricity.repository.PowerPlantRepository;
import fr.antoinecheron.zenelectricity.repository.ProductionEventRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
            productionEventRepository.save(startProdEvent).subscribe();

        } else if (previous.isConsuming() != powerPlant.isConsuming() && previous.isProducing()) {
            // Switch to consumption mode
            powerPlant.startConsumption();
            // Create a new production event
            ProductionEvent startConsEvent = new ProductionEvent(false, powerPlant.getPowerPlantId());
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

        // Returns the newly created powerplant
        return new ResponseEntity<>(Mono.just(powerPlant), HttpStatus.OK);
    }
}
