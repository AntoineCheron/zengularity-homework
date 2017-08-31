package fr.antoinecheron.zenelectricity.services.powerplant;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * Created by antoine on 31/08/2017.
 */

@RestController
@RequestMapping(value="/powerplant")
public class PowerPlantController {

    @RequestMapping(method = GET)
    public PowerPlant powerPlant () {
        return new PowerPlant(1, "power plant 1", "nuclear", 78000);
    }
}
