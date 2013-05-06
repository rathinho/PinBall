/*
 * Filename: Bat.js
 * Author: Rathinho
 * Time: 2013/5/2
 * Function: Define a Bat class in this file
 */

var cocos = require('cocos2d');
var geom = require('geometry');

var Bat = cocos.nodes.Node.extend({
	init: function() {
		Bat.superclass.init.call(this);

		// add sprite
		var sprite = cocos.nodes.Sprite.create({
			file: '/resources/sprites.png',
			rect: new geom.Rect(0, 0, 64, 16)
		});
		sprite.set('anchorPoint', new geom.Point(0, 0));
		this.addChild({child: sprite});
		this.set('contentSize', sprite.get('contentSize'));
	}
});

exports.Bat = Bat;