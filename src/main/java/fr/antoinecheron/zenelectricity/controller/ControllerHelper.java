package fr.antoinecheron.zenelectricity.controller;

import fr.antoinecheron.zenelectricity.domain.ApplicationUser;
import fr.antoinecheron.zenelectricity.repository.ApplicationUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * Created by antoine on 06/09/2017.
 */
abstract class ControllerHelper {

    private ApplicationUserRepository applicationUserRepository;

    ControllerHelper (ApplicationUserRepository applicationUserRepository) {
        this.applicationUserRepository = applicationUserRepository;
    }

    /**
     * Returns the id of the user making the request
     *
     * @return {String} the id
     */
    String getAuthenticatedUsersId () {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ApplicationUser applicationUser = applicationUserRepository.findByUsername(auth.getPrincipal().toString()).block();

        if (applicationUser == null) {
            throw new UsernameNotFoundException(auth.getPrincipal().toString());
        }
        return applicationUser.getUsersId();
    }


}
