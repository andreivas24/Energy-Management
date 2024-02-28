package user.management.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtUtilService {
    @Value("${security.secret-key}")
    private String SECRET_KEY;

    @Value("${security.expiration-time}")
    private String EXPIRATION_TIME;

    public String generateToken(Map<String, Object> extraClaims, String role){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(role)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + Long.parseLong(EXPIRATION_TIME)))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(String role){
        return generateToken(new HashMap<>(), role);
    }

    public String extractRole(String jwtToken) {
        return extractClaim(jwtToken, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey(){
        byte[] keyByte = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyByte);
    }

    public boolean isAdminTokenValid(String authHeader){
        String token = authHeader.substring(7);
        String role = extractRole(token);
        return (role.equals("ADMIN") && !isTokenExpired(token));
    }

    public boolean isClientTokenValid(String authHeader){
        String token = authHeader.substring(7);
        String role = extractRole(token);
        return (role.equals("CLIENT") && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
