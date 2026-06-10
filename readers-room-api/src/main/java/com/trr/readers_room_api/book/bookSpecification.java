package com.trr.readers_room_api.book;

import org.springframework.data.jpa.domain.Specification;

public class bookSpecification {

    public static Specification<bookEntity> withOwnerId(Integer ownerId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("owner").get("id"), ownerId);
    }
}
