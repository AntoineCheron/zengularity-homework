package fr.antoinecheron.zenelectricity.domain;


import org.springframework.data.annotation.Id;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

/**
 * Created by antoine on 02/09/2017.
 */
@Entity
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String username;
    private String password;

    public long getId () {
        return this.id;
    }

    public String getUsername () {
        return this.username;
    }

    public void setUsername (String username) {
        this.username = username;
    }

    public String getPassword () {
        return this.password;
    }

    public void setPassword (String password) {
        this.password = password;
    }
}
