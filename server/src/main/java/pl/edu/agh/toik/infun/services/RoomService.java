package pl.edu.agh.toik.infun.services;

import com.google.gson.Gson;
import org.apache.commons.text.CharacterPredicates;
import org.apache.commons.text.RandomStringGenerator;
import org.springframework.stereotype.Service;
import pl.edu.agh.toik.infun.exceptions.*;
import pl.edu.agh.toik.infun.model.ConfigDTO;
import pl.edu.agh.toik.infun.model.Room;
import pl.edu.agh.toik.infun.model.User;
import pl.edu.agh.toik.infun.model.domain.UserResult;
import pl.edu.agh.toik.infun.model.requests.LastResultResponse;
import pl.edu.agh.toik.infun.model.requests.TaskConfig;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class RoomService implements IRoomService {
    private List<Room> rooms;
    private Map<String, TaskConfig> mapTaskNameConfig;

    public RoomService() {
        this.rooms = Collections.synchronizedList(new ArrayList<Room>());
        this.mapTaskNameConfig = new ConcurrentHashMap<>();
    }

    @Override
    public List<TaskConfig> createDefaultTasksConfig(List<String> jsons) {
        Gson gson = new Gson();
        List<TaskConfig> taskConfigList = jsons.stream().map(j -> gson.fromJson(j, TaskConfig.class)).collect(Collectors.toList());
        taskConfigList.forEach(tc -> mapTaskNameConfig.putIfAbsent(tc.getName(), tc));

        return taskConfigList;
    }


    @Override
    public void addRoom(Room room) throws RoomAlreadyExistsException {
        if (rooms.stream().filter(g -> g.getId().equals(room.getId())).count() > 0) {
            throw new RoomAlreadyExistsException("Pokój z id = " + room.getId() + " już istnieje");
        }
        rooms.add(room);
    }

    @Override
    public void addUser(String name, int age, String roomId, String cookie) throws UserAlreadyExistsException, NoSuchRoomException {
        if (rooms.stream().anyMatch(g -> g.getUserByCookie(cookie).isPresent())) {
            throw new UserAlreadyExistsException("Użytkownik z ciasteczkiem " + cookie + " już istnieje");
        }

        Optional<Room> room = rooms.stream().filter(g -> g.getId().equals(roomId)).findFirst();
        if (room.isPresent()) {
            room.get().addUser(name, age, cookie);
        } else {
            throw new NoSuchRoomException(String.format("Pokój o id '%s' nie istnieje.", roomId));
        }
    }

    @Override
    public void removeUser(final String cookie) {
        rooms.forEach(room -> room.removeUser(cookie));
    }

    @Override
    public List<Room> getRoomsByCookie(final String cookie) {
        return rooms.stream()
                .filter(room -> room.getUserByCookie(cookie).isPresent())
                .collect(Collectors.toList());
    }

    @Override
    public ConfigDTO getConfig(String task, String cookie) throws NoUserCookieFoundException {
        ConfigDTO configDTO = new ConfigDTO();
        for (Room room : rooms) {
            Optional<User> user = room.getUserByCookie(cookie);
            if (user.isPresent()) {
                configDTO.setRoom(room.getId());
                configDTO.setNick(user.get().getNick());
                configDTO.setAge(user.get().getAge());
                try {
                    configDTO.setConfig(room.getTasksConfig().stream().filter(t -> t.getName().equals(task)).findFirst().get().getConfig());
                } catch (Exception e) {
                    configDTO.setConfig(new ArrayList<>());
                }
                return configDTO;
            }
        }
        throw new NoUserCookieFoundException();
    }

    @Override
    public String getNextTask(String cookie) throws NoMoreAvailableTasksException, NoUserCookieFoundException {
        Optional<Room> roomOptional = rooms.stream().filter(g -> g.getUserByCookie(cookie).isPresent()).findFirst();
        if (!roomOptional.isPresent()) {
            throw new NoUserCookieFoundException();
        }

        Room room = roomOptional.get();
        Optional<User> userOptional = room.getUserByCookie(cookie);
        if (!userOptional.isPresent()) {
            throw new NoUserCookieFoundException();
        }

        User user = userOptional.get();
        return user.getNextTask();
    }

    @Override
    public boolean isCreator(String roomId, String cookie) {
        return rooms
                .stream()
                .filter(g -> g.getId().equals(roomId))
                .findFirst()
                .map(g -> g.getCreatorCookie().equals(cookie))
                .orElse(false);
    }

    public List<String> roomIdsCreatedBy(final String cookie) {
        return rooms.stream()
                .filter(room -> room.getCreatorCookie().equals(cookie))
                .map(Room::getId)
                .collect(Collectors.toList());
    }

    @Override
    public void removeRoom(String roomId, String cookie) throws CannotRemoveRoomException {
        Optional<Room> room = rooms.stream().filter(g -> g.getId().equals(roomId) && g.getCreatorCookie().equals(cookie)).findAny();
        if (room.isPresent() && room.get().getCreatorCookie().equals(cookie)) {
            rooms.remove(room.get());
        } else {
            throw new CannotRemoveRoomException("Nie można usunąć pokoju o id = " + roomId);
        }
    }

    @Override
    public void addResult(String taskName, String cookie, String nick, String roomId, double result) throws NoSuchRoomException, NoUserCookieFoundException {
        final Optional<Room> room = this.getRoomById(roomId);
        if (!room.isPresent()) {
            throw new NoSuchRoomException("Nie ma pokoju o id = " + roomId);
        }

        Optional<User> user = room.get().getUserList().stream().filter(u -> u.getNick().equals(nick) && u.getCookieValue().equals(cookie)).findFirst();
        if (!user.isPresent()) {
            throw new NoUserCookieFoundException();
        }

        user.get().addUserResult(result, taskName);
    }

    @Override
    public Optional<Room> getRoomById(String roomId) {
        return rooms.stream()
                .filter(g -> g.getId().equals(roomId))
                .findFirst();
    }

    @Override
    public List<UserResult> getResults(String roomId, String cookie) throws NoSuchRoomException, AccessDeniedException {
        Optional<Room> roomOptional = this.getRoomById(roomId);
        if (!roomOptional.isPresent())
            throw new NoSuchRoomException("Nie ma pokoju z id = " + roomId);
        Room room = roomOptional.get();
        if (!room.getCreatorCookie().equals(cookie))
            throw new AccessDeniedException("Nie można pobrać wyników ze względu na niewłaściwe ciasteczko");
        return room.getUserList()
                .stream()
                .sorted(Comparator.comparingDouble(User::getScore))
                .map(UserResult::fromUser)
                .collect(Collectors.toList());
        //return room.getUserList().stream().collect(Collectors.groupingBy(User::getNick, Collectors.summingDouble(User::getScore)));
    }

    @Override
    public String generateRandomRoomId() {
        RandomStringGenerator randomStringGenerator = new RandomStringGenerator.Builder()
                .withinRange('0', 'z')
                .filteredBy(CharacterPredicates.ASCII_UPPERCASE_LETTERS)
                .build();
        String roomId;
        do {
            roomId = randomStringGenerator.generate(4);
        } while (containsRoomId(roomId));
        return roomId;
    }

    @Override
    public LastResultResponse getLastResults(String cookie) {
        Optional<Room> roomOptional = rooms.stream().filter(g -> g.getUserByCookie(cookie).isPresent()).findFirst();
        if (roomOptional.isPresent()) {
            Room room = roomOptional.get();
            Optional<User> userOptional = room.getUserByCookie(cookie);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                LastResultResponse lastResultResponse = new LastResultResponse();
                lastResultResponse.setLastResult(user.getLastResult());
                lastResultResponse.setScore(user.getScore());
                lastResultResponse.setRank(1 + room.getUserList()
                        .stream()
                        .map(User::getScore)
                        .filter(s -> s > user.getScore())
                        .count());
                lastResultResponse.setColor(user.getColor());
                return lastResultResponse;
            }
        }

        return new LastResultResponse();
    }

    @Override
    public TaskConfig getTaskConfig(String taskName) {
        return mapTaskNameConfig.getOrDefault(taskName, new TaskConfig(taskName, new ArrayList<>()));
    }

    @Override
    public void checkUserCurrentTask(String task, String cookie) throws WrongTaskException {
        for (Room room : rooms) {
            for (User user : room.getUserList()) {
                if (user.getCookieValue().equals(cookie)) {
                    if (!user.getCurrentTask().equals(task)) {
                        throw new WrongTaskException("Zła gra: " + task);
                    }
                    return;
                }
            }
        }
    }


    private boolean containsRoomId(String roomId) {
        return rooms.stream().anyMatch(g -> g.getId().equals(roomId));
    }
}
