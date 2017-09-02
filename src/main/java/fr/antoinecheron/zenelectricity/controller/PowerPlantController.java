package fr.antoinecheron.zenelectricity.controller;

import fr.antoinecheron.zenelectricity.domain.PowerPlant;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * Created by antoine on 31/08/2017.
 */

@RestController
@RequestMapping(value="/API")
public class PowerPlantController {

    @RequestMapping(method = GET, value = "/powerplant")
    @PreAuthorize("hasAuthority('ADMIN_USER') or hasAuthority('STANDARD_USER')")
    public PowerPlant powerPlant () {
        return new PowerPlant(1, "power plant 1", "nuclear", 78000);
    }
}
