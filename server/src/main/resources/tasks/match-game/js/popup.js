const modal = document.getElementById('pass-modal');
const span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function pass_or_fail_msg(eq_result,eq_time) {
    const mbody = document.getElementsByClassName('modal-body')[0];
    const header = document.getElementsByClassName('modal-header')[0];

    if(eq_result == true) {
        move_next();
    } else {
        header.innerHTML='<h1>Spróbuj jeszcze raz</h1>';
        mbody.innerHTML='<button id="ret" onclick="reloading();" class="retry-button">Spróbuj jeszcze raz</button>';
        modal.style.display = "block";
    }
}

function move_next(){
    const score = compute_score();
    postScoreJson(postScore_endpoint, score)
}