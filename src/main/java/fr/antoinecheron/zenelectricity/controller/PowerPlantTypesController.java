package fr.antoinecheron.zenelectricity.controller;

import fr.antoinecheron.zenelectricity.domain.PowerPlantType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by antoine on 05/09/2017.
 */
@RestController
@RequestMapping("/API/powerplants/types")
public class PowerPlantTypesController {

    @RequestMapping(method = GET)
    public HttpEntity<Flux<PowerPlantType>> getAllTypes () {
        Flux<PowerPlantType> types = Flux.just(PowerPlantType.values());

        return new ResponseEntity<>(types, HttpStatus.OK);
    }

}
