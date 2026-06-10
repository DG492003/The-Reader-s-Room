package com.trr.readers_room_api.auth;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class authResponse {
    private String token;
}

