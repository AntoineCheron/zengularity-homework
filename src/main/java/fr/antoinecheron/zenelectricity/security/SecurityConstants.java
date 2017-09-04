package fr.antoinecheron.zenelectricity.security;

/**
 * Created by antoine on 02/09/2017.
 */
class SecurityConstants {
    static final String SECRET = "ZenelectricityApp-HopeYou'llLoveIt";
    static final long EXPIRATION_TIME = 864_000_000; // 10 days
    static final String TOKEN_PREFIX = "Bearer ";
    static final String HEADER_STRING = "Authorization";
    static final String SIGN_UP_URL = "/sign-up";
}
