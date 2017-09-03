package fr.antoinecheron.zenelectricity.config;

import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import fr.antoinecheron.zenelectricity.repository.ApplicationUserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

/**
 * Created by antoine on 03/09/2017.
 */
@Configuration
@EnableReactiveMongoRepositories(basePackageClasses = ApplicationUserRepository.class)
public class MongoConfig extends AbstractReactiveMongoConfiguration {

    @Bean
    public MongoClient mongoClient () {
        return MongoClients.create();
    }

    @Override
    protected String getDatabaseName () {
        return "zenelectricity-dev";
    }

    @Bean
    public ReactiveMongoTemplate reactiveMongoTemplate () {
        return new ReactiveMongoTemplate(mongoClient(), getDatabaseName());
    }

}
