package fr.antoinecheron.zenelectricity.repository;

import fr.antoinecheron.zenelectricity.domain.PowerPlant;
import fr.antoinecheron.zenelectricity.domain.PowerPlantType;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Created by antoine on 02/09/2017.
 */
public interface PowerPlantRepository extends ReactiveMongoRepository<PowerPlant, String> {

    Flux<PowerPlant> findByOwner (String owner);
    Mono<PowerPlant> findByIdAndOwner (String id, String owner);
    Mono<PowerPlant> findByOwnerAndName (String owner, String name);
}
