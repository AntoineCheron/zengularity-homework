package fr.antoinecheron.zenelectricity.security;

/**
 * Created by antoine on 02/09/2017.
 */
public class SecurityConstants {
    public static final String SECRET = "ZenelectricityApp-HopeYou'llLoveIt";
    public static final long EXPIRATION_TIME = 864_000_000; // 10 days
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/users/sign-up";
}
