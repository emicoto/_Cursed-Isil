const source = {}
const sup = {}
const base = {}
const palam = {}
const cflag = {}
const tsv = {}
const stats = {}
const exp = {}
const juel = {}
const action = {}
const using = {}
const flag = {}

Object.defineProperties(window, {
	V: {
		get: function() {
			return State.variables;
		}
	},

	T: {
		get: function() {
			return State.temporary;
		}
	},

	S: {
		get: function(){
			return setup;
		}
	},

	C: {
		get:function(){
			return State.variables.chara;
		}
	},

	Flag:{
		get:function(){
			return State.variables.flag;
		}
	},

	tc:{
		get:function(){
			return State.variables.tc
		},

		set:function(v){
			State.variables.tc = v
		}
	},

	pc:{
		get:function(){
			return State.variables.pc
		},
		set:function(v){
			State.variables.pc = v
		}
	},

	player:{
		get:function(){
			return C[pc]
		}
	},

	target:{
		get:function(){
			return C[tc]
		}
	},

	Base:{
		get: function(){
			return base
		}
	},

	Stats:{
		get:function(){
			return stats
		}
	},

	Palam:{
		get:function(){
			return palam
		}
	},

	Source:{
		get: function(){
			return source
		}
	},

	Sup:{
		get: function(){
			return sup
		}
	},

	Cflag:{
		get: function(){
			return cflag
		}
	},
	Tsv:{
		get: function(){
			return tsv
		}
	},

	Exp:{
		get: function(){
			return exp
		}
	},

	Juel:{
		get:function(){
			return juel
		}
	},

	Act:{
		get:function(){
			return action
		}
	},

	Using:{
		get:function(){
			return using
		}
	}
	
});
