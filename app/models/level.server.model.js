'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Level Schema
 */
var LevelSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Level name',
		trim: true
	},
    leveltype:{
      type: String,
        default: '',
        trim:true
    },
    icon:{
        type: String,
        default: '',
        trim:true
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    kcomponents: [{type: Schema.ObjectId, ref: 'Kcomponent'}],
    mastered:{
        type: Boolean,
        default: false
    },
    examples:{
        type: String,
        default: ''
    },
    example1:{
        type: String,
        default: '',
        trim:true
    },
    example2:{
        type: String,
        default: '',
        trim:true
    },
    sequence:{
        type:String,
        default:'2',
        trim:true
    }
    //kcomponents
    //mastered
    //examples
});

mongoose.model('Level', LevelSchema);