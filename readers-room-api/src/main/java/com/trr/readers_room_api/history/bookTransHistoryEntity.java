package com.trr.readers_room_api.history;

import com.trr.readers_room_api.book.bookEntity;
import com.trr.readers_room_api.common.auditEntity;
import com.trr.readers_room_api.users.userEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class bookTransHistoryEntity extends auditEntity {

    private boolean isReturned;
    private boolean isReturnedApproved;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private userEntity user;
    @ManyToOne
    @JoinColumn(name = "book_id")
    private bookEntity book;
}
