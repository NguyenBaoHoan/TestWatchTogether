package com.watchtogether.Entity.jpa;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoItem {
    private String videoId;
    private String title;
    private String source; // "yt", "vimeo", "dm", "html5"
}