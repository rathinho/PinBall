/*
 * Filename: Heart.js
 * Author: Rathinho
 * Time: 2013/5/2
 * Function: Define a Heart class in this file
 */

var cocos = require('cocos2d');
var geom = require('geometry');

var Heart = cocos.nodes.Node.extend({
	init: function () {
		Heart.superclass.init.call(this);

		var sprite = cocos.nodes.Sprite.create({
			file: '/resources/heart.png',
			rect: new geom.Rect(0, 0, 20, 20)
		});
		sprite.set('anchorPoint', new geom.Point(0, 0));
		this.addChild({child: sprite});
		this.set('contentSize', sprite.get('contentSize'));
	}
});

exports.Heart = Heart;