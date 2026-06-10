package com.trr.readers_room_api.feedback;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class feedbackResponse {

    private Double note;
    private String comment;
    private boolean ownFeedback;
}
