package fr.antoinecheron.zenelectricity.repository;

import fr.antoinecheron.zenelectricity.domain.ApplicationUser;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by antoine on 02/09/2017.
 */
public interface ApplicationUserRepository extends MongoRepository<ApplicationUser, String> {

    ApplicationUser findByUsername (String username);
}
