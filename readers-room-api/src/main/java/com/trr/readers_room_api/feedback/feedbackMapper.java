package com.trr.readers_room_api.feedback;

import com.trr.readers_room_api.book.bookEntity;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class feedbackMapper {

    public feedbackEntity toFeedback(feedbackRequest request) {
        return feedbackEntity.builder()
                .note(request.note())
                .comment(request.comment())
                .book(new bookEntity().builder()
                        .id(request.bookId())
                        .shareable(false) // Not required and has no impact :: just to satisfy lombok
                        .archived(false) // Not required and has no impact :: just to satisfy lombok
                        .build()
                )
                .build();
    }

    public feedbackResponse toFeedbackResponse(feedbackEntity feedback, Integer id) {
        return feedbackResponse.builder()
                .note(feedback.getNote())
                .comment(feedback.getComment())
                .ownFeedback(Objects.equals(feedback.getCreatedBy(), id))
                .build();
    }
}
