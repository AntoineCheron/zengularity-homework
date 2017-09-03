package fr.antoinecheron.zenelectricity.repository;

import fr.antoinecheron.zenelectricity.domain.ApplicationUser;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

/**
 * Created by antoine on 02/09/2017.
 */
public interface ApplicationUserRepository extends ReactiveMongoRepository<ApplicationUser, String> {

    Mono<ApplicationUser> findByUsername (final String username);
}
