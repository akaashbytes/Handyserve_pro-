package com.handyserve.dto;

import com.handyserve.document.ContactRequest;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactRequestDto {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String message;
    private String status; // pending | replied | closed
    private String date;

    public static ContactRequestDto fromDocument(ContactRequest doc) {
        if (doc == null) return null;
        return ContactRequestDto.builder()
                .id(doc.getId())
                .name(doc.getName())
                .email(doc.getEmail())
                .phone(doc.getPhone())
                .message(doc.getMessage())
                .status(doc.getStatus())
                .date(doc.getDate())
                .build();
    }
}
