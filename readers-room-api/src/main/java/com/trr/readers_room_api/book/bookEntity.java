package com.trr.readers_room_api.book;


import com.trr.readers_room_api.common.auditEntity;
import com.trr.readers_room_api.feedback.feedbackEntity;
import com.trr.readers_room_api.history.bookTransHistoryEntity;
import com.trr.readers_room_api.users.userEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class bookEntity extends auditEntity {

    private String title;
    private String authorName;
    private String isbn;
    private String synopsis;
    private String bookCover;
    private boolean archived;
    private boolean shareable;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private userEntity owner;

    @OneToMany(mappedBy = "book")
    private List<feedbackEntity> feedbacks;

    @OneToMany(mappedBy = "book")
    private List<bookTransHistoryEntity> histories;

    @Transient
    public double getRate() {
        if (feedbacks == null || feedbacks.isEmpty()) {
            return 0.0;
        }
        var rate = this.feedbacks.stream()
                .mapToDouble(feedbackEntity::getNote)
                .average()
                .orElse(0.0);
        double roundedRate = Math.round(rate * 10.0) / 10.0;
        return roundedRate;
    }
}

