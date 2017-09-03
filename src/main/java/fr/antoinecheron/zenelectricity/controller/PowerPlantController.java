package fr.antoinecheron.zenelectricity.controller;

import fr.antoinecheron.zenelectricity.domain.PowerPlant;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * Created by antoine on 31/08/2017.
 */

@RestController
@RequestMapping(value="/API")
public class PowerPlantController {

    @RequestMapping(method = GET, value = "/powerplant")
    public Mono<PowerPlant> powerPlant () {
        return Mono.just(new PowerPlant(1, "power plant 1", "nuclear", 78000));
    }
}
