package fr.antoinecheron.zenelectricity.repository;

import fr.antoinecheron.zenelectricity.domain.ProductionEvent;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Created by antoine on 05/09/2017.
 */
public interface ProductionEventRepository extends ReactiveMongoRepository<ProductionEvent, String> {

    Flux<ProductionEvent> findByOwningPowerPlant (String powerPlantId);

    Mono<ProductionEvent> findFirstByOwningPowerPlantOrderByTimestampDesc (String powerPlantId);
}
