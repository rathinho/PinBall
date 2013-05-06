/*
 * Filename: Clock.js
 * Author: Rathinho
 * Time: 2013/5/2
 * Function: Define a Clock class in this file
 */

var cocos = require('cocos2d');
var geom = require('geometry');

var Clock = cocos.nodes.Node.extend({
	time: null,

	init: function () {
		Clock.superclass.init.call(this);

		var time = cocos.nodes.Label.create({string: "0s"});
		this.addChild({child: time});
		this.set('time', time);
	},

	countTime: function (dt) {
		var lastTime = parseFloat(this.get('time').string);
		lastTime += dt;
		lastTime = lastTime.toFixed(2);
		this.get('time').set('string', lastTime.toString()+"s");
	}
 });

exports.Clock = Clock;