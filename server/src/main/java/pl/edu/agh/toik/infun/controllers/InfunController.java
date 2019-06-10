package pl.edu.agh.toik.infun.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.util.WebUtils;
import pl.edu.agh.toik.infun.exceptions.*;
import pl.edu.agh.toik.infun.model.ConfigDTO;
import pl.edu.agh.toik.infun.model.Room;
import pl.edu.agh.toik.infun.model.domain.TaskResult;
import pl.edu.agh.toik.infun.model.domain.UserResult;
import pl.edu.agh.toik.infun.model.requests.CreateRoomInput;
import pl.edu.agh.toik.infun.model.requests.JoinRoomInput;
import pl.edu.agh.toik.infun.model.requests.LastResultResponse;
import pl.edu.agh.toik.infun.model.requests.TaskConfig;
import pl.edu.agh.toik.infun.services.IFolderScanService;
import pl.edu.agh.toik.infun.services.IRoomService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static pl.edu.agh.toik.infun.utils.InFunUtils.*;

@Controller
public class InfunController {

    @Autowired
    IRoomService roomService;

    @Autowired
    IFolderScanService folderScanService;

    @RequestMapping("/")
    String main() {
        return "redirect:/room/join";
    }

    @GetMapping("/room/create")
    String createRoom(HttpServletRequest request, Model model) {
        if(isLocalhost(request.getLocalAddr())){
            return redirectToHttps("/room/create");
        }
        CreateRoomInput createRoomInput = new CreateRoomInput(roomService.createDefaultTasksConfig(
                folderScanService.scanFolder())
        );
        model.addAttribute("createRoomInput", createRoomInput);
        return "create_room";
    }

    @GetMapping(value = "/room/join")
    String joinRoom(HttpServletRequest request, HttpServletResponse response, Model model) {
        if(isLocalhost(request.getLocalAddr())){
            return redirectToHttps("/room/join");
        }
        Cookie cookie = WebUtils.getCookie(request, "COOKIE");

        if(cookie == null){
            cookie = new Cookie("COOKIE", String.valueOf(RequestContextHolder.currentRequestAttributes().getSessionId()));
            cookie.setPath("/");
            response.addCookie(cookie);
        }

        final List<Room> joinedRooms = roomService.getRoomsByCookie(cookie.getValue());
        if (!joinedRooms.isEmpty()) {
            model.addAttribute("existingGameId", joinedRooms.get(0).getId());
        }
        model.addAttribute("joinRoomInput", new JoinRoomInput());
        try {
            roomService.getNextTask(cookie.getValue());
            model.addAttribute("allGamesFinished", false);
        } catch (NoUserCookieFoundException | NoMoreAvailableTasksException e) {
            model.addAttribute("allGamesFinished", true);
        }
        return "join_room";
    }

    @PostMapping(value = "/room/join")
    String getTask(@ModelAttribute JoinRoomInput joinRoomInput, @CookieValue("COOKIE") String cookie, Model model) throws UserAlreadyExistsException, NoSuchRoomException {
        roomService.removeUser(cookie);
        roomService.addUser(joinRoomInput.nick, joinRoomInput.age, joinRoomInput.roomId, cookie);
        return "redirect:/tasks/new";
    }

    @GetMapping("/tasks/new")
    public String getNextTask(@CookieValue("COOKIE") String cookie) throws NoUserCookieFoundException {
        try {
            String nextTask = roomService.getNextTask(cookie);
            if (nextTask.equals("robot")) {
                return redirectToHttp("/tasks/next?type=robot");
            }
            return redirectToHttps("/tasks/next?type=normal");
        } catch (NoMoreAvailableTasksException e) {
            e.printStackTrace();
            return "redirect:/end";
        }
    }

    @GetMapping("/tasks/next")
    public String robotGame(@CookieValue("COOKIE") String cookie, @RequestParam String type) throws NoUserCookieFoundException{
        try {
            String nextTask =  roomService.getNextTask(cookie);
            if(nextTask.equals("robot") && type.equals("robot")){
                return "robot/index";
            } else if(type.equals("normal")) {
                return nextTask + "/index";
            }
        } catch (NoMoreAvailableTasksException e) {
            e.printStackTrace();
            return "redirect:/end";
        }
        return "redirect:/room/join";

    }

    @PostMapping("/manage")
    String manage(@ModelAttribute("createRoomInput") CreateRoomInput createRoomInput, @CookieValue("JSESSIONID") String cookie, Model model) throws RoomAlreadyExistsException, NoGameSelectedException {
        List<TaskConfig> userChoice = createRoomInput.getTasksConfig();
        String roomId = createRoomInput.getRoomId();
        if (roomId == null || roomId.trim().equals("")) {
            roomId = roomService.generateRandomRoomId();
        }
        List<TaskConfig> filteredConfigs = userChoice.stream().filter(taskConfig -> taskConfig.name != null).collect(Collectors.toList());

        if (filteredConfigs.size() == 0) {
            model.addAttribute("error", "Nie wybrano żadnej gry.");
            model.addAttribute("link", "/room/create");
            model.addAttribute("link_name", "Powrót");
            return "error_view_custom";
        }
        List<TaskConfig> configs = new ArrayList<>();
        for (TaskConfig taskConfig : filteredConfigs) {
            configs.add(new TaskConfig(taskConfig.name.trim(), taskConfig.config == null ? new ArrayList<>() : taskConfig.config));
        }

        roomService.addRoom(new Room(roomId, configs, cookie, createRoomInput.getTaskNumber()));
        return "redirect:/manage/" + roomId;
    }

    @RequestMapping("/manage/{roomId}")
    String manage(@PathVariable final String roomId, @CookieValue("JSESSIONID") String cookie, Model model) {
        if (!roomService.getRoomById(roomId).isPresent()) {
            model.addAttribute("error", String.format("Pokój o id='%s' nie istnieje.", roomId));
            model.addAttribute("link", "/room/create");
            model.addAttribute("link_name", "Stwórz pokój");
            return "error_view_custom";
        }
        model.addAttribute("room_id", roomId);
        model.addAttribute("owned_rooms", roomService.roomIdsCreatedBy(cookie));
        return "manage";
    }

    @RequestMapping(value = "/{task_name}/config")
    @ResponseBody
    ConfigDTO getConfig(@PathVariable(value = "task_name") final String taskName, @CookieValue("COOKIE") String cookie) throws NoUserCookieFoundException {
        return roomService.getConfig(taskName, cookie);
    }


    @PostMapping(value = "/{task_name}/end")
    @ResponseBody
    public String endGame(@PathVariable(value = "task_name") final String taskName, @RequestBody TaskResult taskResult, @CookieValue("COOKIE") String cookie, Model model) throws NoSuchRoomException, NoUserCookieFoundException {
        roomService.addResult(taskName, cookie, taskResult.getNick(), taskResult.getRoom(), taskResult.getResult());
        model.addAttribute("result", taskResult);
        return "/task_result";
    }

    @GetMapping(value = "/task_result")
    String taskResult(@CookieValue("COOKIE") String cookie, Model model) {
        return "task_result";
    }

    @GetMapping(value = "/end")
    String end(@CookieValue("COOKIE") String cookie, Model model) {
        model.addAttribute("result", roomService.getLastResults(cookie).getScore());
        return "end";
    }

    @GetMapping(value = "/{room_id}/remove")
    String endGame(@CookieValue("JSESSIONID") String cookie, @PathVariable(value = "room_id") final String roomId) throws CannotRemoveRoomException {
        roomService.removeRoom(roomId, cookie);
        return "redirect:/room/create";
    }

    @RequestMapping("/{room_id}/results")
    @ResponseBody
    List<UserResult> getResults(@PathVariable(value = "room_id") final String roomId, @CookieValue("JSESSIONID") String cookie) throws NoSuchRoomException, AccessDeniedException {
        return roomService.getResults(roomId, cookie);
    }

    @RequestMapping("/last/results")
    @ResponseBody
    LastResultResponse getLastResults(@CookieValue("COOKIE") String cookie) {
        return roomService.getLastResults(cookie);
    }

    @GetMapping("/qrcode")
    String getQrCode() {
        return "qrcode";
    }
}