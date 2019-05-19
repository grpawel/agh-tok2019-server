package pl.edu.agh.toik.infun.services;

import org.springframework.stereotype.Service;
import pl.edu.agh.toik.infun.exceptions.*;
import pl.edu.agh.toik.infun.model.ConfigDTO;
import pl.edu.agh.toik.infun.model.Room;
import pl.edu.agh.toik.infun.model.domain.UserResult;
import pl.edu.agh.toik.infun.model.requests.LastResultResponse;
import pl.edu.agh.toik.infun.model.requests.TaskConfig;

import java.util.List;
import java.util.Optional;

@Service
public interface IRoomService {
    List<TaskConfig> createDefaultTasksConfig(List<String> jsons);

    void addRoom(Room room) throws RoomAlreadyExistsException;

    void addUser(String name, int age, String room, String cookie) throws UserAlreadyExistsException, NoSuchRoomException;

    void removeUser(String cookie);

    List<Room> getRoomsByCookie(String cookie);

    ConfigDTO getConfig(String task, String cookie) throws NoUserCookieFoundException;

    String getNextTask(String cookie) throws NoMoreAvailableTasksException, NoUserCookieFoundException;

    boolean isCreator(String roomId, String cookie);

    public List<String> roomIdsCreatedBy(final String cookie);

    public Optional<Room> getRoomById(String roomId);

    void removeRoom(String roomId, String cookie) throws CannotRemoveRoomException;

    void addResult(String taskName, String cookie, String nick, String room, double result) throws NoSuchRoomException, NoUserCookieFoundException;

    List<UserResult> getResults(String roomId, String cookie) throws NoSuchRoomException, AccessDeniedException;

    String generateRandomRoomId();

    LastResultResponse getLastResults(String cookie);

    TaskConfig getTaskConfig(String taskName);

    void checkUserCurrentTask(String task, String cookie) throws WrongTaskException;
}
