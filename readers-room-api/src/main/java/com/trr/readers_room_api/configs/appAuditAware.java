package com.trr.readers_room_api.configs;

import com.trr.readers_room_api.users.userEntity;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class appAuditAware implements AuditorAware<Integer> {


    @Override
    public Optional<Integer> getCurrentAuditor() {
        @Nullable Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken){
            return Optional.empty();
        }

        userEntity userPrincipal = (userEntity) auth.getPrincipal();
        return Optional.ofNullable((userPrincipal.getId()));
    }
}
