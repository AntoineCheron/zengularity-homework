package fr.antoinecheron.zenelectricity.controller;

import fr.antoinecheron.zenelectricity.domain.PowerPlant;
import fr.antoinecheron.zenelectricity.domain.ProductionEvent;
import fr.antoinecheron.zenelectricity.repository.ApplicationUserRepository;
import fr.antoinecheron.zenelectricity.repository.PowerPlantRepository;
import fr.antoinecheron.zenelectricity.repository.ProductionEventRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by antoine on 05/09/2017.
 */
@RestController
@CrossOrigin
@RequestMapping("/API/powerplants/events")
public class ProductionEventController extends ControllerHelper {

    private final ProductionEventRepository productionEventRepository;
    private final PowerPlantRepository powerPlantRepository;

    public ProductionEventController (ProductionEventRepository productionEventRepository,
                                      PowerPlantRepository powerPlantRepository,
                                      ApplicationUserRepository applicationUserRepository) {

        super(applicationUserRepository);
        this.productionEventRepository = productionEventRepository;
        this.powerPlantRepository = powerPlantRepository;
    }

    @RequestMapping(method=GET)
    public HttpEntity<Flux<ProductionEvent>> getUsersEvents () {
        // Create a new variable that will contain all the events for the user
        List<ProductionEvent> events = new ArrayList<>();

        // Retrieve the list of power plants the user own
        Iterable<PowerPlant> powerPlants = powerPlantRepository
                .findByOwner(getAuthenticatedUsersId())
                .toIterable();

        // Retrieve all the events for each powerplant
        for (PowerPlant p : powerPlants) {
            Iterable<ProductionEvent> dlEvents = productionEventRepository
                    .findByOwningPowerPlant(p.getPowerPlantId())
                    .toIterable();

            for (ProductionEvent e : dlEvents) {
                e.add(linkTo(methodOn(ProductionEventController.class).getEvent(p.getPowerPlantId(), e.getproductionEventId())).withSelfRel());
                events.add(e);
            }
        }

        // Re-order them, the latest being the first in the list
        Collections.sort(events);

        // Return the result
        return new ResponseEntity<>(Flux.fromIterable(events), HttpStatus.OK);

    }

    @RequestMapping(method=GET, value="/{powerPlantId}")
    public HttpEntity<Flux<ProductionEvent>> getPowerPlantsEvents (@PathVariable String powerPlantId) {
        if (authUserIsOwnerOfPowerplant(powerPlantId)) {
            Iterable<ProductionEvent> dlEvents = productionEventRepository.findByOwningPowerPlant(powerPlantId).toIterable();
            List<ProductionEvent> events = new ArrayList<>();

            for (ProductionEvent ev : dlEvents) {
                ev.add(linkTo(methodOn(ProductionEventController.class).getEvent(powerPlantId, ev.getproductionEventId())).withSelfRel());
                events.add(ev);
            }

            return new ResponseEntity<>(Flux.fromIterable(events), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(Flux.error(new Exception("Auth user doesn't own the given powerplant")), HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @RequestMapping(method=GET, value="/{powerPlantId}/event/{eventId}")
    public HttpEntity<Mono<ProductionEvent>> getEvent(@PathVariable String powerPlantId, @PathVariable String eventId) {
        if (authUserIsOwnerOfPowerplant(powerPlantId)) {
            ProductionEvent dlEvent = productionEventRepository.findById(eventId).block();

            dlEvent.add(linkTo(methodOn(ProductionEventController.class).getEvent(eventId, getAuthenticatedUsersId())).withSelfRel());

            return new ResponseEntity<>(Mono.just(dlEvent), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(Mono.error(new Exception("Auth user doesn't own the given powerplant")), HttpStatus.NOT_ACCEPTABLE);
        }
    }

    /* -----------------------------------------------------------------------------------------------------------------
                                    PRIVATE METHODS
     ---------------------------------------------------------------------------------------------------------------- */

    private boolean authUserIsOwnerOfPowerplant (String powerPlantId) {
        return powerPlantRepository.findByIdAndOwner(powerPlantId, this.getAuthenticatedUsersId()).block() != null;
    }
}
