package pl.edu.agh.toik.infun.model;

import com.google.gson.Gson;
import lombok.Data;
import pl.edu.agh.toik.infun.exceptions.UserAlreadyExistsException;
import pl.edu.agh.toik.infun.model.requests.TaskConfig;
import pl.edu.agh.toik.infun.services.IRandomColor;
import pl.edu.agh.toik.infun.services.RandomColorFactory;

import java.util.*;
import java.util.stream.Collectors;

@Data
public class Room {
    private String id;
    private List<TaskConfig> tasksConfig;
    private List<String> tasks;
    private List<User> userList;
    private String creatorCookie;
    private int taskNumber;
    private Gson gson;
    private Random random;
    private IRandomColor randomColor;

    public Room(String id, List<TaskConfig> tasksConfig, String creatorCookie, int taskNumber) {
        this.random = new Random();
        this.gson = new Gson();
        this.id = id;
        this.userList = Collections.synchronizedList(new ArrayList<>());
        this.tasksConfig = tasksConfig;
        this.tasks = createTasksSequence(tasksConfig.stream().map(TaskConfig::getName).collect(Collectors.toList()), taskNumber);
        this.creatorCookie = creatorCookie;
        this.taskNumber = taskNumber;
        this.randomColor = RandomColorFactory.getRandomColor();
    }

    private List<String> createTasksSequence(List<String> tasks, int taskNumber) {
        List<String> resultList = new ArrayList<>();
        if (tasks.size() == 1) {
            for (int i = 0; i < taskNumber; i++) {
                resultList.add(tasks.get(0));
            }
            return resultList;
        }
        String currentTask = tasks.remove(random.nextInt(tasks.size()));
        resultList.add(currentTask);
        String previousTask = currentTask;
        for (int i = 0; i < taskNumber - 1; i++) {
            currentTask = tasks.remove(random.nextInt(tasks.size()));
            resultList.add(currentTask);
            tasks.add(previousTask);
            previousTask = currentTask;
        }
        return resultList;
    }

    public void addUser(String name, int age, String cookie) throws UserAlreadyExistsException {
        if (userList.stream().anyMatch(u -> u.getNick().equals(name))) {
            throw new UserAlreadyExistsException("Użytkownik = " + name + " już istnieje");
        }
        final String color = this.randomColor.getColor(this.userList.size());
        userList.add(new User(name, age, color, cookie, new ArrayList<>(tasks)));
    }

    public void removeUser(final String cookie) {
        getUserByCookie(cookie)
                .ifPresent(user -> {
                    userList.remove(user);
                    randomColor.returnColor(user.getColor());
                });
    }

    public Optional<User> getUserByCookie(String cookie) {
        return userList.stream().filter(u -> u.getCookieValue().equals(cookie)).findFirst();
    }
}
