package fr.antoinecheron.zenelectricity.config;

import com.mongodb.ConnectionString;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import fr.antoinecheron.zenelectricity.repository.ApplicationUserRepository;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${spring.data.mongodb.uri}")
    private String databaseUri;

    @Bean
    public MongoClient mongoClient () {
        return MongoClients.create(new ConnectionString(databaseUri));
    }

    @Override
    protected String getDatabaseName () {
        return "zenelectricity-dev";
    }

    @Override
    public MongoClient reactiveMongoClient() {
        return mongoClient();
    }

    @Bean
    public ReactiveMongoTemplate reactiveMongoTemplate () {
        return new ReactiveMongoTemplate(mongoClient(), getDatabaseName());
    }

}
