package com.example.ttcs.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.core.userdetails.UserDetailsPasswordService;
import org.springframework.security.core.userdetails.UserDetailsService;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Cho phép dùng @PreAuthorize ở tầng Controller
public class SecurityConfig {

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); 
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) { 
    

    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
    authProvider.setUserDetailsPasswordService((UserDetailsPasswordService) userDetailsService); 
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
}


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt CSRF nếu bạn đang làm API (REST). Nếu dùng Thymeleaf/JSP thì nên bật.
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/login", "/register").permitAll() // Ai cũng vào được
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Chỉ ADMIN
                .requestMatchers("/api/giaovien/**").hasAnyRole("ADMIN", "GV") // ADMIN hoặc GV
                .requestMatchers("/api/hocsinh/**").hasAnyRole("ADMIN", "GV", "HS") // Ai đã đăng nhập cũng có thể dùng
                .anyRequest().authenticated() // Mọi request khác đều phải đăng nhập
            )
            .formLogin(form -> form
                .defaultSuccessUrl("/home", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .permitAll()
            );

        return http.build();
    }
}