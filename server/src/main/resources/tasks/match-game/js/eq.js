function generateEquationNumber(age) {
    let min;
    let max;
    if (age < 12 ) {
        min = 1;
        max = 40;
    } else if (age >= 12 && age < 16) {
        min = 200;
        max = 275;
    } else {
        min = 400;
        max = 496;
    }
    return Math.floor(Math.random()*(max-min+1)+min);
}

function createHint() {
    const hint = document.getElementById("hint");
    const eqLen = equations[eq_num].sol[0].length;
    const eqMode = equations[eq_num].mode;
    if (eqMode == 'move' && eqLen / 2 === 1) {
        hint.innerHTML = "przesuń " + eqLen / 2 + " zapałkę";
    } else if (eqMode == 'move' && eqLen / 2 > 1) {
        hint.innerHTML = "przesuń " + eqLen / 2 + " zapałki";
    } else if (eqMode == 'add' && eqLen === 1) {
        hint.innerHTML = "dodaj " + eqLen + " zapałkę"
    } else if (eqMode == 'add' && eqLen > 1) {
        hint.innerHTML = "dodaj " + eqLen + " zapałki"
    } else if (eqMode == 'remove' && eqLen === 1) {
        hint.innerHTML = "usuń " + eqLen + " zapałkę";
    } else if (eqMode == 'remove' && eqLen > 1) {
        hint.innerHTML = "usuń " + eqLen + " zapałki";

    }
}

//Create Images in div
function divequation() {
    let i;
    const div = document.getElementById("divequation");
    for (i = 0; i < 13; i++) {
        div.innerHTML += '<img src="img/vertical.png" alt="" id=img' + i + ' class ="strickimgs">';
    }
    for (i = 16; i < 28; i++) {
        div.innerHTML += '<img src="img/horizontal.png" alt="" id=img' + i + ' class ="strickimgs">';
    }
}

//equation draw
function draw_equation(f, operator, s, r) {
    let image;
    const first = set_number(f, "first");
    const sec = set_number(s, "sec");
    const res = set_number(r, "res");

    //drawing first operand
    for (let i = 0; i < first.length; i++) {
        image = document.getElementById("img" + first[i]);
        image.classList.add('view');
    }
    //drawing second operand
    for (let i = 0; i < sec.length; i++) {
        image = document.getElementById("img" + sec[i]);
        image.classList.add('view');
    }

    //drawing result
    for (let i = 0; i < res.length; i++) {
        image = document.getElementById("img" + res[i]);
        image.classList.add('view');
    }

    //drawing =
    for (let i = 23; i <= 24; i++) {
        image = document.getElementById("img" + i);
        image.setAttribute("class", "view");
    }

    //drawing operand - (set class to view [no toggle])
    image = document.getElementById("img19");
    image.setAttribute("class", "view");
    //drawing operand +
    if (operator === "+") {
        const image2 = document.getElementById("img4");
        image2.classList.add('view');
    }
}


function addListenerRemove(i, im, num_moves, array, changedImg) {
    im[i].addEventListener("click", function (e) {
        const maxMovesToDel = num_moves / 2;
        if (changedImg.del.length < maxMovesToDel) {
            e.target.classList.toggle('view');
            const imgId = e.target.id;
            if (changedImg.add.includes(imgId)) {
                let a = Array.from(changedImg.add).filter(t => t !== imgId);
                changedImg.add = a;
            }

            if (!changedImg.del.includes(imgId)) {
                changedImg.del.push(imgId);
            }

            addListenerAdd(i, im, num_moves, array, changedImg);
            restrict_moves(e.target.id, num_moves, array)
        } else {
            addListenerRemove(i, im, num_moves, array, changedImg);
        }
    }, {once: true});
}

function addListenerAdd(i, im, num_moves, array, changedImg) {
    im[i].addEventListener("click", function (e) {
        if (changedImg.del.length - changedImg.add.length > 0) {
            e.target.classList.toggle('view');
            const id = e.target.id;
            if (changedImg.del.includes(id)) {
                let a = Array.from(changedImg.del).filter(t => t !== id);
                changedImg.del = a;
            }

            if (!changedImg.add.includes(id)) {
                changedImg.add.push(id);
            }
            addListenerRemove(i, im, num_moves, array, changedImg);
            restrict_moves(e.target.id, num_moves, array)
        } else {
            addListenerAdd(i, im, num_moves, array, changedImg);
        }
    }, {once: true});
}

function moves_mode(mode, num_moves) {
    const im = document.getElementsByClassName("strickimgs");
    const changedImg = {add: [], del: []};
    const array = [];
    let i;
    switch (mode) {
        case "move":
            for (i = 0; i < im.length; i++) {
                if (im[i].classList.contains('view')) {
                    addListenerRemove(i, im, num_moves, array, changedImg);
                }

                if (!im[i].classList.contains('view')) {
                    addListenerAdd(i, im, num_moves, array, changedImg);
                }
            }
            break;

        case "add":
            for (i = 0; i < im.length; i++) {
                if (!im[i].classList.contains('view')) {
                    im[i].addEventListener("click", function (e) {
                        e.target.classList.toggle('view');
                        restrict_moves(e.target.id, num_moves, array)
                    });
                }
            }
            break;

        case "remove":
            for (i = 0; i < im.length; i++) {
                if (im[i].classList.contains('view')) {
                    im[i].addEventListener("click", function (e) {
                        e.target.classList.toggle('view');
                        restrict_moves(e.target.id, num_moves, array);
                    });
                }
            }
            break;
    }
}


function checkMovesWithSolution(array) {

    for (let i = 0; i < equations[eq_num].sol.length; i++) {
        var tries = [];
        for (let j = 0; j < equations[eq_num].sol[i].length; j++) {
            let solution = equations[eq_num].sol[i][j];
            //compare sol and array
            if (array.includes(solution)) {
                tries.push(true);
            }
        }
        if (tries.length === array.length) {
            return true;
        }
    }
    return false;
}

//restrict number of moves for the player
function restrict_moves(id, num_moves, array) {
    var check_flag;
    var exist;

    if (num_moves == 1) {
        array.push(id);
        time = totalSeconds;
        check_flag = checkMovesWithSolution(array);
        pass_or_fail_msg(check_flag, time);
    }
    if (array.length == 0) {
        array.push(id);
    }
    else {
        if (array.length < num_moves) {
            for (i = 0; i < array.length; i++) {
                if (array[i] == id) {
                    exist = i;
                }
            }
            if (exist != null) {
                array.splice(exist, 1);
                exist = null;
            }
            else {
                array.push(id);
                if (array.length == num_moves) {
                    time = totalSeconds;
                    check_flag = checkMovesWithSolution(array);
                    pass_or_fail_msg(check_flag, time);
                }
            }
        }
    }
}

//set IDs for img in the required equation
function set_number(num, pos) {
    var temp = [];
    switch (pos) {
        case 'first':
            if (num == 0) {
                temp = [0, 1, 2, 3, 17, 18];
            }
            else if (num == 1) {
                temp = [2, 3];
            }
            else if (num == 2) {
                temp = [1, 2, 16, 17, 18];
            }
            else if (num == 3) {
                temp = [2, 3, 16, 17, 18];
            }
            else if (num == 4) {
                temp = [0, 2, 3, 16];
            }
            else if (num == 5) {
                temp = [0, 3, 16, 17, 18];
            }
            else if (num == 6) {
                temp = [0, 1, 3, 16, 17, 18];
            }
            else if (num == 7) {
                temp = [2, 3, 17];
            }
            else if (num == 8) {
                temp = [0, 1, 2, 3, 16, 17, 18];
            }
            else if (num == 9) {
                temp = [0, 2, 3, 16, 17, 18];
            }
            return temp;
            break;
        case "sec":
            if (num == 0) {
                temp = [5, 6, 7, 8, 21, 22]
            }
            else if (num == 1) {
                temp = [7, 8]
            }
            else if (num == 2) {
                temp = [6, 7, 20, 21, 22]
            }
            else if (num == 3) {
                temp = [7, 8, 20, 21, 22];
            }
            else if (num == 4) {
                temp = [5, 7, 8, 20];
            }
            else if (num == 5) {
                temp = [5, 8, 20, 21, 22];
            }
            else if (num == 6) {
                temp = [5, 8, 20, 21, 22];
            }
            else if (num == 7) {
                temp = [7, 8, 21];
            }
            else if (num == 8) {
                temp = [5, 6, 7, 8, 20, 21, 22];
            }
            else if (num == 9) {
                temp = [5, 7, 8, 20, 21, 22];
            }
            return temp;
            break;
        case "res":
            if (num == 0) {
                temp = [9, 10, 11, 12, 26, 27]
            }
            else if (num == 1) {
                temp = [11, 12]
            }
            else if (num == 2) {
                temp = [10, 11, 25, 26, 27]
            }
            else if (num == 3) {
                temp = [11, 12, 25, 26, 27];
            }
            else if (num == 4) {
                temp = [9, 11, 12, 25];
            }
            else if (num == 5) {
                temp = [9, 12, 25, 26, 27];
            }
            else if (num == 6) {
                temp = [9, 10, 12, 25, 26, 27];
            }
            else if (num == 7) {
                temp = [11, 12, 26];
            }
            else if (num == 8) {
                temp = [9, 10, 11, 12, 25, 26, 27];
            }
            else if (num == 9) {
                temp = [9, 11, 12, 25, 26, 27];
            }
            return temp;
            break;
        default:
            console.log("error getting IDs for number " + num + "in " + pos);
    }
}
