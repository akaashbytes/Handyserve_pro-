package com.handyserve.dto;

import com.handyserve.document.Notification;
import lombok.*;

import java.time.format.DateTimeFormatter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationDto {
    private String id;
    private String title;
    private String message;
    private String icon;
    private Boolean read;
    private String time; // format "dd MMM, hh:mm a"

    public static NotificationDto fromDocument(Notification doc) {
        if (doc == null) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM, hh:mm a");
        return NotificationDto.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .message(doc.getMessage())
                .icon(doc.getIcon())
                .read(doc.getRead())
                .time(doc.getCreatedAt() != null ? doc.getCreatedAt().format(formatter) : "")
                .build();
    }
}
