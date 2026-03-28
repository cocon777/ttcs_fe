package com.example.ttcs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

// PHẢI CÓ 2 DÒNG IMPORT QUAN TRỌNG NÀY:
import com.example.ttcs.dto.LoginRequest;
import com.example.ttcs.dto.SignupRequest;
import com.example.ttcs.entity.NguoiDung;
import com.example.ttcs.enums.VaiTro;      // <--- Import này để dùng HOC_SINH, GIAO_VIEN
import com.example.ttcs.security.JwtUtils; // <--- Import này để dùng JwtUtils
import com.example.ttcs.repository.NguoiDungRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    NguoiDungRepository nguoiDungRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getTenDangNhap(), loginRequest.getMatKhau()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", jwt);
        
        String vaiTroStr = authentication.getAuthorities().iterator().next().getAuthority();
        Map<String, String> userMap = new HashMap<>();
        userMap.put("vaiTro", vaiTroStr.replace("ROLE_", "")); 
        response.put("user", userMap);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        NguoiDung user = new NguoiDung();
        user.setTen(signUpRequest.getTen());
        user.setTenDangNhap(signUpRequest.getTenDangNhap());
        user.setEmail(signUpRequest.getEmail());
        user.setMatKhau(passwordEncoder.encode(signUpRequest.getMatKhau())); 
        
        // So khớp với Enum HOC_SINH, GIAO_VIEN bạn vừa sửa
        if ("HS".equals(signUpRequest.getVaiTro())) {
            user.setVaiTro(VaiTro.HOC_SINH); 
        } else {
            user.setVaiTro(VaiTro.GIAO_VIEN);
        }

        nguoiDungRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công!");
    }
}