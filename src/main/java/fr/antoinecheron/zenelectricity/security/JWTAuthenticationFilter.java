package fr.antoinecheron.zenelectricity.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import fr.antoinecheron.zenelectricity.domain.ApplicationUser;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import static fr.antoinecheron.zenelectricity.security.SecurityConstants.HEADER_STRING;
import static fr.antoinecheron.zenelectricity.security.SecurityConstants.TOKEN_PREFIX;
import static fr.antoinecheron.zenelectricity.security.SecurityConstants.SECRET;
import static fr.antoinecheron.zenelectricity.security.SecurityConstants.EXPIRATION_TIME;

/**
 * Created by antoine on 02/09/2017.
 */
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private AuthenticationManager authenticationManager;

    public JWTAuthenticationFilter (AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req,
                                                HttpServletResponse res) throws AuthenticationException {
        try {
            ApplicationUser creds = new ObjectMapper()
                    .readValue(req.getInputStream(), ApplicationUser.class);

            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getUsername(),
                            creds.getPassword(),
                            new ArrayList<>())
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication (HttpServletRequest req,
                                             HttpServletResponse resp,
                                             FilterChain chain,
                                             Authentication auth) throws IOException, ServletException {
        String token = Jwts.builder()
                            .setSubject(((User) auth.getPrincipal()).getUsername())
                            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                            .signWith(SignatureAlgorithm.HS512, SECRET)
                            .compact();
        resp.addHeader(HEADER_STRING, TOKEN_PREFIX + token);
    }

}
