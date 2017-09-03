package fr.antoinecheron.zenelectricity.domain;


import org.springframework.data.annotation.Id;

/**
 * Created by antoine on 02/09/2017.
 */
public class ApplicationUser {

    @Id
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
