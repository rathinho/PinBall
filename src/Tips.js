/*
 * Filename: GameOver.js
 * Author: Rathinho
 * Time: 2013/5/2
 * Function: Define a GameOver class in this file
 */

var cocos = require('cocos2d');
var geom = require('geometry');

var GameOver = cocos.nodes.Node.extend({
    init: function() {
        GameOver.superclass.init.call(this);
        var text = cocos.nodes.Label.create({string: "Game Over!", fontSize: 25.0});
        this.addChild({child: text});
    }
});  

var NewRecord = cocos.nodes.Node.extend({
    init: function() {
        NewRecord.superclass.init.call(this);
        var text = cocos.nodes.Label.create({string: "Congratulations! New Record!", fontSize: 25.0});
        this.addChild({child: text});
    }
});  

exports.GameOver = GameOver;
exports.NewRecord = NewRecord;