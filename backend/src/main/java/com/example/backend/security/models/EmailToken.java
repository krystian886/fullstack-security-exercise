package com.example.backend.security.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.security.Timestamp;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name="emailTokens")
public class EmailToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String token;

    @Column(updatable = false)
    @Basic(optional = false)
    private LocalDateTime createdAt;

    @Column(updatable = false)
    @Basic(optional = false)
    private LocalDateTime expireAt;

    @ManyToOne
    @JoinColumn(
            name="user_id",
            nullable = false)
    private User user;

    public EmailToken(String token,
                      LocalDateTime createdAt,
                      LocalDateTime expireAt,
                      User user) {
        this.token = token;
        this.createdAt = createdAt;
        this.expireAt = expireAt;
        this.user = user;
    }
}
