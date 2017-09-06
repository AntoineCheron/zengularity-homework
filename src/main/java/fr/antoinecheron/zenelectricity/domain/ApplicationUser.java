package fr.antoinecheron.zenelectricity.domain;


import org.springframework.data.annotation.Id;
import org.springframework.hateoas.ResourceSupport;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

/**
 * Created by antoine on 02/09/2017.
 */
public class ApplicationUser extends ResourceSupport {

    @Id
    private final String id;
    private final String username;
    private String email;
    private String password;

    @JsonCreator
    public ApplicationUser (@JsonProperty("username") String username, @JsonProperty("email") String email) {
        this.username = username;
        this.email = email;
        this.id = UUID.randomUUID().toString();
    }

    public String getUsersId () {
        return this.id;
    }

    public String getUsername () {
        return this.username;
    }

    public String getPassword () {
        return this.password;
    }

    public void setPassword (String password) {
        this.password = password;
    }

    public String getEmail () {
        return this.email;
    }

    public void setEmail (String email) {
        this.email = email;
    }
}
