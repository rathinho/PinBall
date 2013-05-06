/*
 * Filename: Ball.js
 * Author: Rathinho
 * Time: 2013/5/2
 * Function: Define a Ball class in this file
 */

var cocos = require('cocos2d');
var geom = require('geometry');
var util = require('util');

var Ball = cocos.nodes.Node.extend({
	velocity: null,

	init: function(xVel, yVel) {
		Ball.superclass.init.call(this);

		// add sprite
		var sprite = cocos.nodes.Sprite.create({
			file: '/resources/sprites.png',
			rect: new geom.Rect(64, 0, 16, 16)
		});
		sprite.set('anchorPoint', new geom.Point(0, 0));
		this.addChild({child: sprite});
		this.set('contentSize', sprite.get('contentSize'));
		
		// set velocity
		this.set('velocity', new geom.Point(xVel, yVel));
		this.scheduleUpdate();
	},

	update: function(dt) {
		var pos = util.copy(this.get('position')),
			vel = util.copy(this.get('velocity'));

		pos.x += dt * vel.x;
		pos.y += dt * vel.y;
		this.set('position', pos);
		
		this.testBatCollision();
		this.testEdgeCollision();
		this.testOutside();
	},

	testBatCollision: function() {
		var vel = util.copy(this.get('velocity')),
			ballBox = this.get('boundingBox');

		// The parent of the ball is the Breakout Layer, which has a 'bat'
        // property pointing to the player's bat.
        var batBox = this.get('parent').get('userBat').get('boundingBox');

        // If moving down then check for collision with the bat
        if(vel.y > 0) {
        	if(geom.rectOverlapsRect(ballBox, batBox)) {
        		// Flip Y velocity
        		vel.y *= -1;
        	}
        }

        // Update position and velocity on the ball
        this.set('velocity', vel);
	},

	testEdgeCollision: function() {
		var vel = util.copy(this.get('velocity')),
		    ballBox = this.get('boundingBox'),
		    // Get size of canvas
		    winSize = cocos.Director.get('sharedDirector').get('winSize');
		 
		// Moving left and hit left edge
		if (vel.x < 0 && geom.rectGetMinX(ballBox) < 0) {
		    // Flip X velocity
		    vel.x *= -1;
		}
		 
		// Moving right and hit right edge
		if (vel.x > 0 && geom.rectGetMaxX(ballBox) > winSize.width) {
		    // Flip X velocity
		    vel.x *= -1;
		}
		 
		// Moving up and hit top edge
		if (vel.y < 0 && geom.rectGetMinY(ballBox) < 0) {
		    // Flip Y velocity
		    vel.y *= -1;
		}

		this.set('velocity', vel);
	},

	testOutside: function () {
		// Get current ball count
		var parentNode = this.get('parent'),
			totalBallCount = parentNode.get('ballCount'),
			currentBallCount = parentNode.get('currentBallCount');

		// Check if the ball is outside the scene
		var pos = util.copy(this.get('position')),
			vel = util.copy(this.get('velocity')),
			winSize = cocos.Director.get('sharedDirector').get('winSize');
		if(pos.y > winSize.height || pos.y < 0) {
			// Decrease a heart
			parentNode.removeChild({child: parentNode.get('heart')[2 - (totalBallCount - currentBallCount)]});
			parentNode.get('heart').pop();
			parentNode.removeChild({child: this});
			//parentNode.get('ball').pop();

			currentBallCount -= 1;
			parentNode.set('currentBallCount', currentBallCount);
		}
	}
});

exports.Ball = Ball;