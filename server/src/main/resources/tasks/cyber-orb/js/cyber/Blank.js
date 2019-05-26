Ball.Blank = function(game) {};
Ball.Blank.prototype = {
    create: function() {
        this.add.sprite(0, 0, 'screen-bg');
    }
};