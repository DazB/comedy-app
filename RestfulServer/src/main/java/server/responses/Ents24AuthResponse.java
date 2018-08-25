package server.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * JSON response from Ents24 client authentication.
 * This POJO represents the structure of the JSON and contains the details we extract from it.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Ents24AuthResponse {

    private String access_token;
    private String token_type;
    private int expires;
    private int expires_in;

    public Ents24AuthResponse() {
    }

    public String getAccess_token() {
        return access_token;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public String getToken_type() {
        return token_type;
    }

    public void setToken_type(String token_type) {
        this.token_type = token_type;
    }

    public Integer getExpires() {
        return expires;
    }

    public void setExpires(Integer expires) {
        this.expires = expires;
    }

    public Integer getExpires_in() {
        return expires_in;
    }

    public void setExpires_in(Integer expires_in) {
        this.expires_in = expires_in;
    }
}
