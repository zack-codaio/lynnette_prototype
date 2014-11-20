'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Kcomponent Schema
 */
var KcomponentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Kcomponent name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    description: {
        type: String,
        default: '',
        trim: true
    },
    mastered:{
        type:Boolean,
        default:false
    },
    percentComplete:{
        type:Number,
        default:25
    }
});

mongoose.model('Kcomponent', KcomponentSchema);