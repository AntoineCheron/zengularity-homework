package fr.antoinecheron.zenelectricity.repository;

import fr.antoinecheron.zenelectricity.domain.PowerPlant;
import fr.antoinecheron.zenelectricity.domain.PowerPlantType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Created by antoine on 02/09/2017.
 */
public interface PowerPlantRepository extends MongoRepository<PowerPlant, String> {

    public PowerPlant findByName (String name);
    public List<PowerPlant> findByType (PowerPlantType type);
}
