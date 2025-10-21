package com.example.leads;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ApiTokenFilter extends OncePerRequestFilter {

    private final String expected = System.getenv().getOrDefault("API_TOKEN", "secret123");

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {

        String path = req.getRequestURI();
        if (path != null && path.startsWith("/health")) {
            chain.doFilter(req, res);
            return;
        }

        String auth = req.getHeader("Authorization");
        boolean ok = auth != null && auth.startsWith("Bearer ")
                && expected.equals(auth.substring(7));

        if (!ok) {
            res.setStatus(401);
            res.setContentType("application/json");
            res.getWriter().write("{\"error\":\"Unauthorized\"}");
            return;
        }

        chain.doFilter(req, res);
    }
}
