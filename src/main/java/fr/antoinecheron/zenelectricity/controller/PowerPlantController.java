package fr.antoinecheron.zenelectricity.controller;

import fr.antoinecheron.zenelectricity.domain.PowerPlant;
import fr.antoinecheron.zenelectricity.repository.PowerPlantRepository;
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
@RequestMapping(value="/powerplants")
public class PowerPlantController {

    // Attributes
    private PowerPlantRepository powerPlantRepository;

    public PowerPlantController (PowerPlantRepository powerPlantRepository) {
        this.powerPlantRepository = powerPlantRepository;
    }

    /* -----------------------------------------------------------------------------------------------------------------
                                    QUERIES ON ONE SPECIFIC POWER PLANT
     ---------------------------------------------------------------------------------------------------------------- */

    @RequestMapping(method = GET, value = "/{powerPlantId}")
    public HttpEntity<Mono<PowerPlant>> getPowerPlant (@PathVariable String powerPlantId) {
        PowerPlant powerPlant = powerPlantRepository.findById(powerPlantId).block();
        if (powerPlant != null) {
            powerPlant.add(linkTo(methodOn(PowerPlantController.class).getPowerPlant(powerPlant.getPowerPlantId())).withSelfRel());
            // powerPlant.add(linkTo(methodOn(ProductionEventController.class).getPowerPlantsEvents(powerPlant.getPowerPlantId())).withRel("events"));

            return new ResponseEntity<>(Mono.just(powerPlant), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(Mono.empty(), HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(method = POST, value = "/{powerPlantId}")
    public void updatePowerPlant(@PathVariable String powerPlantId, @RequestBody PowerPlant powerPlant) {
        powerPlant.setId(powerPlantId);
        powerPlantRepository.save(powerPlant).subscribe();
    }

    @RequestMapping(method = DELETE, value = "/{powerPlantId}")
    public void deletePowerPlant(@PathVariable String powerPlantId) {
        PowerPlant powerPlant = powerPlantRepository.findById(powerPlantId).block();
        powerPlantRepository.delete(powerPlant).subscribe();
    }


    /* -----------------------------------------------------------------------------------------------------------------
                                    QUERIES ON ALL POWER PLANTS
     ---------------------------------------------------------------------------------------------------------------- */

    @RequestMapping(method = GET)
    public HttpEntity<Flux<PowerPlant>> powerPlant () {

        Iterable<PowerPlant> dlPowerPlants = powerPlantRepository.findAll().toIterable();
        List<PowerPlant> powerPlants = new ArrayList<>();

        for (PowerPlant powerPlant: dlPowerPlants) {
            powerPlant.add(linkTo(methodOn(PowerPlantController.class).getPowerPlant(powerPlant.getPowerPlantId())).withSelfRel());
            // powerPlant.add(linkTo(methodOn(ProductionEventController.class).getPowerPlantsEvents(powerPlant.getPowerPlantId())).withRel("events"));

            powerPlants.add(powerPlant);
        }

        return new ResponseEntity<>(Flux.fromIterable(powerPlants), HttpStatus.OK);
    }

    @RequestMapping(method = PUT)
    public HttpEntity<Mono<PowerPlant>> createPowerPlant(@RequestBody PowerPlant powerPlant) {
        powerPlantRepository.save(powerPlant).subscribe();

        return new ResponseEntity<>(Mono.just(powerPlant), HttpStatus.OK);
    }
}
