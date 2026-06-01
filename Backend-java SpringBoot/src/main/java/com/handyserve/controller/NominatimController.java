package com.handyserve.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/nominatim")
public class NominatimController {

    private final WebClient nominatimWebClient;

    public NominatimController(WebClient nominatimWebClient) {
        this.nominatimWebClient = nominatimWebClient;
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<String> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "json") String format,
            @RequestParam(defaultValue = "6") Integer limit,
            @RequestParam(name = "addressdetails", defaultValue = "1") Integer addressDetails,
            @RequestParam(name = "countrycodes", defaultValue = "in") String countryCodes) {

        return nominatimWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("q", q)
                        .queryParam("format", format)
                        .queryParam("limit", limit)
                        .queryParam("addressdetails", addressDetails)
                        .queryParam("countrycodes", countryCodes)
                        .build())
                .retrieve()
                .bodyToMono(String.class);
    }
}
