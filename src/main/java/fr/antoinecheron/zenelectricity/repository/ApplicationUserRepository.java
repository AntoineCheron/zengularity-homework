package fr.antoinecheron.zenelectricity.repository;

import fr.antoinecheron.zenelectricity.domain.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by antoine on 02/09/2017.
 */
public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long> {

    ApplicationUser findByUsername (String username);
}
