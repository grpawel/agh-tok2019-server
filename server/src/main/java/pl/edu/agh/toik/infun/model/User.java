package pl.edu.agh.toik.infun.model;


import lombok.Data;
import pl.edu.agh.toik.infun.exceptions.NoMoreAvailableTasksException;

import java.util.List;

import static pl.edu.agh.toik.infun.utils.InFunUtils.RED;
import static pl.edu.agh.toik.infun.utils.InFunUtils.RESET;

@Data
public class User {
    private String nick;
    private int age;
    private String color;
    private String cookieValue;
    private double score;
    private double lastResult;
    private List<String> availableTasks;
    private int completedNumber;
    private String currentTask;


    public User(String nick, int age, String color, String cookieValue, List<String> taskList) {
        this.nick = nick;
        this.age = age;
        this.color = color;
        this.cookieValue = cookieValue;
        this.availableTasks = taskList;
        this.lastResult = 0;
        this.completedNumber = 0;
    }

    public void addUserResult(double result, String task) {
        if (!currentTask.equals(task)){ //todo ???
            System.out.println(RED + "Given result = " + result + " it's from wrong task = " + task + " but current task is = " + currentTask + RESET);
        } else {
            score += result;
            lastResult = result;
            completedNumber++;
        }

    }

    public String getNextTask() throws NoMoreAvailableTasksException {
        if (completedNumber < availableTasks.size()) {
            currentTask = availableTasks.get(completedNumber);
            return currentTask;
        } else {
            throw new NoMoreAvailableTasksException("Nie ma już więcej dostępnych zadań");
        }
    }
}