package pl.edu.agh.toik.infun.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;

//@Component
public class InFunUtils {
    public static final String RESET = "\033[0m";  // Text Reset
    public static final String RED = "\033[0;31m";     // RED

//    @Value("${server.http.port}")
    private static int httpPort = 8082;

//    @Value("${server.port}")
    private static int httpsPort = 8443;

    public static boolean isLocalhost(String url) {
        return Arrays.asList("0:0:0:0:0:0:0:1", "::1", "127.0.0.1", "localhost").contains(url);
    }

    private static String redirect(String protocol, int port, String uri){
        try {
            String ip = InetAddress.getLocalHost().getHostAddress();
            return String.format("redirect:%s://%s:%d%s", protocol, ip, port, uri);
        } catch (UnknownHostException e) {
            e.printStackTrace();
            return "redirect:/";
        }
    }

    public static String redirectToHttp(String uri){
       return redirect("http", httpPort, uri);
    }
    public static String redirectToHttps(String uri){
        return redirect("https", httpsPort, uri);
    }
}
