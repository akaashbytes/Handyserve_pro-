package com.handyserve.dto;

import com.handyserve.entity.PromoCode;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PromoCodeDto {
    private String code;
    private String label;
    private String type; // percent | flat
    private Double value;

    public static PromoCodeDto fromEntity(PromoCode entity) {
        if (entity == null) return null;
        return PromoCodeDto.builder()
                .code(entity.getCode())
                .label(entity.getLabel())
                .type(entity.getType().name())
                .value(entity.getValue())
                .build();
    }
}
