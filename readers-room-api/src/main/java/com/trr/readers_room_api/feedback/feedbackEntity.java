package com.trr.readers_room_api.feedback;

import com.trr.readers_room_api.book.bookEntity;
import com.trr.readers_room_api.common.auditEntity;
import jakarta.persistence.*;
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
public class feedbackEntity extends auditEntity {

    private Double note;
    private String comment;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private bookEntity book;

}
