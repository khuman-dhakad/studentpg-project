package com.studentpg.security.filter;


import com.studentpg.security.jwt.JwtService;
import com.studentpg.security.userdetails.CustomUserDetailsService;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


import lombok.RequiredArgsConstructor;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;


import org.springframework.stereotype.Component;


import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter

        extends OncePerRequestFilter {


    private static final Logger logger =

            LoggerFactory.getLogger(

                    JwtAuthenticationFilter.class

            );


    private static final String ACCESS_TOKEN_COOKIE =

            "access_token";


    private final JwtService jwtService;


    private final CustomUserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(

            HttpServletRequest request,

            HttpServletResponse response,

            FilterChain filterChain

    ) throws ServletException, IOException {


        String token =

                extractTokenFromCookie(

                        request

                );


        if (

                token == null

                        || token.isBlank()

        ) {


            String authHeader =

                    request.getHeader(

                            "Authorization"

                    );


            if (

                    authHeader != null

                            && authHeader.startsWith(

                            "Bearer "

                    )

            ) {


                token =

                        authHeader

                                .substring(

                                        7

                                )

                                .trim();

            }

        }


        /*
         * NO TOKEN
         */

        if (

                token == null

                        || token.isBlank()

        ) {


            logger.debug(

                    "No JWT token found for request: {} {}",

                    request.getMethod(),

                    request.getRequestURI()

            );


            filterChain.doFilter(

                    request,

                    response

            );


            return;

        }


        try {


            String email =

                    jwtService.extractEmail(

                            token

                    );


            if (

                    email == null

                            || email.isBlank()

            ) {


                logger.warn(

                        "JWT email is empty"

                );


                filterChain.doFilter(

                        request,

                        response

                );


                return;

            }


            UserDetails userDetails =

                    userDetailsService

                            .loadUserByUsername(

                                    email

                            );


            Long expectedTokenVersion = (userDetails instanceof com.studentpg.security.userdetails.StudentPgUserDetails)
                    ? ((com.studentpg.security.userdetails.StudentPgUserDetails) userDetails).getTokenVersion()
                    : null;

            boolean valid = (expectedTokenVersion != null)
                    ? jwtService.isTokenValid(
                            token,
                            userDetails.getUsername(),
                            expectedTokenVersion
                    )
                    : jwtService.isTokenValid(
                            token,
                            userDetails.getUsername()
                    );


            if (!valid) {


                logger.warn(

                        "Invalid JWT token for user: {}",

                        email

                );


                SecurityContextHolder

                        .clearContext();


                filterChain.doFilter(

                        request,

                        response

                );


                return;

            }
            Authentication currentAuthentication =
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication();

            boolean shouldPopulateAuthentication = currentAuthentication == null
                    || currentAuthentication instanceof AnonymousAuthenticationToken;

            if (shouldPopulateAuthentication) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }


            logger.debug(

                    "JWT authentication successful for: {}",

                    email

            );


        }

        catch (Exception exception) {


            logger.warn(
        "JWT authentication failed",
        exception
);


            SecurityContextHolder.clearContext();
        }  
        filterChain.doFilter(request, response);  

    }
    


    private String extractTokenFromCookie(

            HttpServletRequest request

    ) {


        Cookie[] cookies =

                request.getCookies();


        if (

                cookies == null

        ) {


            logger.debug(

                    "No cookies found for request: {}",

                    request.getRequestURI()

            );


            return null;

        }


        for (

                Cookie cookie : cookies

        ) {


            if (

                    ACCESS_TOKEN_COOKIE.equals(

                            cookie.getName()

                    )

            ) {


                String token =

                        cookie.getValue();


                if (

                        token != null

                                && !token.isBlank()

                ) {


                    logger.debug(

                            "JWT cookie found"

                    );


                    return token;

                }

            }

        }


        logger.debug(

                "access_token cookie not found"

        );


        return null;

    }

}