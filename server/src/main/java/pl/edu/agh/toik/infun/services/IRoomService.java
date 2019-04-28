package pl.edu.agh.toik.infun.services;

import org.springframework.stereotype.Service;
import pl.edu.agh.toik.infun.exceptions.*;
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

    void addUser(String name, int age, String room, String cookie) throws UserAlreadyExistsException;

    String getConfig(String task, String cookie) throws NoSuchUserException;

    String getNextTask(String cookie) throws NoMoreAvailableTasksException, NoSuchUserException;

    boolean isCreator(String roomId, String cookie);

    public Optional<Room> getRoomById(String roomId);

    void removeRoom(String roomId, String cookie) throws CannotRemoveRoomException;

    void addResult(String taskName, String cookie, String nick, String room, double result) throws NoSuchRoomException, NoSuchUserException;

    List<UserResult> getResults(String roomId, String cookie) throws NoSuchRoomException, AccessDeniedException;

    String generateRandomRoomId();

    LastResultResponse getLastResults(String cookie);

    TaskConfig getTaskConfig(String taskName);

    void checkUserCurrentTask(String task, String cookie) throws WrongTaskException;
}
