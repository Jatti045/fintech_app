package com.fintechapp.fintech_api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String from;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from:}") String from
    ) {
        this.mailSender = mailSender;
        this.from = from;
    }

    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            if (StringUtils.hasText(from)) {
                message.setFrom(from);
            }

            mailSender.send(message);
            logger.info("Email sent successfully to {}", to);
        } catch (MailException exception) {
            logger.error("Error sending email to {}: {}", to, exception.getMessage());
        }
    }
}
