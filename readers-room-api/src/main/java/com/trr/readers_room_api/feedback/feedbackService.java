package com.trr.readers_room_api.feedback;

import com.trr.readers_room_api.book.bookEntity;
import com.trr.readers_room_api.book.bookRepository;
import com.trr.readers_room_api.common.pageResponse;
import com.trr.readers_room_api.handler.exception.OperationNotPermittedException;
import com.trr.readers_room_api.users.userEntity;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class feedbackService {

    private final feedbackRepository feedBackRepo;
    private final bookRepository bookRepo;
    private final feedbackMapper feedbackMapper;

    public Integer save(feedbackRequest request, Authentication connectedUser) {
        bookEntity book = bookRepo.findById(request.bookId())
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + request.bookId()));
        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("You cannot give a feedback for and archived or not shareable book");
        }
        userEntity user = ((userEntity) connectedUser.getPrincipal());
        if (Objects.equals(book.getCreatedBy(), user.getId())) {
            throw new OperationNotPermittedException("You cannot give feedback to your own book");
        }
        feedbackEntity feedback = feedbackMapper.toFeedback(request);
        return feedBackRepo.save(feedback).getId();
    }

    @Transactional
    public pageResponse<feedbackResponse> findAllFeedbacksByBook(Integer bookId, int page, int size, Authentication connectedUser) {
        Pageable pageable = PageRequest.of(page, size);
        userEntity user = ((userEntity) connectedUser.getPrincipal());
        Page<feedbackEntity> feedbacks = feedBackRepo.findAllByBookId(bookId, pageable);
        List<feedbackResponse> feedbackResponses = feedbacks.stream()
                .map(f -> feedbackMapper.toFeedbackResponse(f, user.getId()))
                .toList();
        return new pageResponse<>(
                feedbackResponses,
                feedbacks.getNumber(),
                feedbacks.getSize(),
                feedbacks.getTotalElements(),
                feedbacks.getTotalPages(),
                feedbacks.isFirst(),
                feedbacks.isLast()
        );

    }
}