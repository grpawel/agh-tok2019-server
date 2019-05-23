package pl.edu.agh.toik.infun.exceptions;

public class NoUserCookieFoundException extends InFunException {
    private static String message = "Nie dołączyłeś do żadnego pokoju lub pokój został zamknięty.";
    public NoUserCookieFoundException() {
        super(message);
    }

    public NoUserCookieFoundException(Throwable cause) {
        super(message, cause);
    }
}
