import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Receives M5Stack contact events and serves the latest state/count to React.
 * Run only on a trusted local network. The server has no authentication.
 */
public class SensorReceiver {
    private static final int PORT = 8000;
    private static final int MAX_BODY_BYTES = 4096;
    private static final SensorState STATE = new SensorState();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", PORT), 0);
        server.createContext("/contact", new ContactHandler());
        server.createContext("/api/status", exchange -> {
            if (!"GET".equals(exchange.getRequestMethod())) {
                send(exchange, 405, "Method Not Allowed", "text/plain");
                return;
            }
            send(exchange, 200, STATE.json(), "application/json");
        });
        server.createContext("/api/reset", exchange -> {
            if (!"POST".equals(exchange.getRequestMethod())) {
                send(exchange, 405, "Method Not Allowed", "text/plain");
                return;
            }
            STATE.reset();
            send(exchange, 200, STATE.json(), "application/json");
        });
        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        server.start();
        System.out.println("Listening on port " + PORT + " (/contact, /api/status, /api/reset)");
        Runtime.getRuntime().addShutdownHook(new Thread(() -> server.stop(0)));
    }

    private static class SensorState {
        private boolean contact = false;
        private boolean buttonB = false;
        private boolean initialized = false;
        private boolean recording = false;
        private int count = 0;
        private long uptimeMs = 0;
        private long lastSeenMs = 0;

        synchronized void update(boolean newContact, boolean newButton, long uptime) {
            // A reboot resets uptime. Treat the first reading as baseline, not as an edge.
            if (!initialized || uptime < uptimeMs) {
                initialized = true;
                contact = newContact;
            } else if (recording && !contact && newContact) {
                count++;
            }
            contact = newContact;
            buttonB = newButton;
            uptimeMs = uptime;
            lastSeenMs = System.currentTimeMillis();
        }

        synchronized void reset() {
            count = 0;
            recording = true;
            // Preserve current sensor state, so a held contact is not counted again.
        }

        synchronized int count() { return count; }

        synchronized String json() {
            return "{\"contact\":" + contact
                + ",\"button_b\":" + buttonB
                + ",\"count\":" + count
                + ",\"recording\":" + recording
                + ",\"connected\":" + (initialized && System.currentTimeMillis() - lastSeenMs < 15000)
                + ",\"uptime_ms\":" + uptimeMs
                + "}";
        }
    }

    private static class ContactHandler implements HttpHandler {
        private static final Pattern CONTACT = Pattern.compile("\"contact\"\\s*:\\s*(true|false)");
        private static final Pattern BUTTON = Pattern.compile("\"button_b\"\\s*:\\s*(true|false)");
        private static final Pattern UPTIME = Pattern.compile("\"uptime_ms\"\\s*:\\s*(\\d+)");

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equals(exchange.getRequestMethod())) {
                send(exchange, 405, "Method Not Allowed", "text/plain");
                return;
            }
            byte[] bytes;
            try (InputStream in = exchange.getRequestBody()) {
                bytes = in.readNBytes(MAX_BODY_BYTES + 1);
            }
            if (bytes.length == 0 || bytes.length > MAX_BODY_BYTES) {
                send(exchange, 400, "Invalid request size", "text/plain");
                return;
            }
            String body = new String(bytes, StandardCharsets.UTF_8);
            Matcher contact = CONTACT.matcher(body);
            Matcher button = BUTTON.matcher(body);
            Matcher uptime = UPTIME.matcher(body);
            if (!contact.find() || !button.find() || !uptime.find()) {
                send(exchange, 400, "contact, button_b and uptime_ms required", "text/plain");
                return;
            }
            long uptimeValue;
            try {
                uptimeValue = Long.parseLong(uptime.group(1));
            } catch (NumberFormatException ex) {
                send(exchange, 400, "Invalid uptime", "text/plain");
                return;
            }
            boolean isContact = Boolean.parseBoolean(contact.group(1));
            boolean isPressed = Boolean.parseBoolean(button.group(1));
            STATE.update(isContact, isPressed, uptimeValue);
            String timestamp = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
            System.out.printf("[%s] contact=%s button_b=%s count=%d%n",
                timestamp, isContact, isPressed, STATE.count());
            send(exchange, 200, "OK", "text/plain");
        }
    }

    private static void send(HttpExchange exchange, int status, String body, String contentType)
        throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", contentType + "; charset=utf-8");
        exchange.getResponseHeaders().set("Cache-Control", "no-store");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream out = exchange.getResponseBody()) {
            out.write(bytes);
        }
    }
}
