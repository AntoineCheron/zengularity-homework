package fr.antoinecheron.zenelectricity.controller;

import fr.antoinecheron.zenelectricity.domain.PowerPlant;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import static org.springframework.web.bind.annotation.RequestMethod.*;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;

/**
 * Created by antoine on 31/08/2017.
 */

@RestController
@RequestMapping(value="/API")
public class PowerPlantController {

    @RequestMapping(method = GET, value = "/powerplant")
    public HttpEntity<Mono<PowerPlant>> powerPlant () {

        PowerPlant powerplant = new PowerPlant("power plant 1", "nuclear", 78000);
        powerplant.add(linkTo(methodOn(PowerPlantController.class).powerPlant()).withSelfRel());

        return new ResponseEntity<>(Mono.just(powerplant), HttpStatus.OK);
    }
}
