package fr.antoinecheron.zenelectricity.services;

import fr.antoinecheron.zenelectricity.domain.ApplicationUser;
import fr.antoinecheron.zenelectricity.repository.ApplicationUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Created by antoine on 05/09/2017.
 */
@Service
public class AuthenticatedUserService {

    private ApplicationUserRepository applicationUserRepository;

    public AuthenticatedUserService (ApplicationUserRepository applicationUserRepository) {
        this.applicationUserRepository = applicationUserRepository;
    }

    public String getAuthenticatedUserId () {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ApplicationUser applicationUser = applicationUserRepository.findByUsername(auth.getPrincipal().toString()).block();
        return applicationUser.getUsersId();
    }
}
