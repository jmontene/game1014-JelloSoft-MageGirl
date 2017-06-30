function StateMachine(owner, args){
    this.owner = owner;
    this.states = args.states;
    this.properties = args.properties;
    this.currentState = this.states[args.start_state];

    this.onEnterState(this.currentState);
};

StateMachine.prototype.update = function(){
    this.onState(this.currentState);

    let transitions = this.currentState.transitions;
    for(var i=0;i < transitions.length ; ++i){
        if(this.check(transitions[i])){
            this.onExitState(this.currentState);
            this.onEnterState(this.states[transitions[i].to]);
            this.currentState = this.states[transitions[i].to];
            break;
        }
    }
};

StateMachine.prototype.onEnterState = function(state){
    if(!state.onEnter){
        return;
    }
    this.owner[state.onEnter.function].apply(this.owner, state.onEnter.args);
};

StateMachine.prototype.onExitState = function(state){
    if(!state.onExit){
        return;
    }
    this.owner[state.onExit.function].apply(this.owner, state.onExit.args);
};

StateMachine.prototype.onState = function(state){
    if(!state.onState){
        return;
    }
    this.owner[state.onState.function].apply(this.owner, state.onState.args);
};

StateMachine.prototype.check = function(transition){
    return StateMachine.check_functions[transition.check](this, transition.property,transition.val);
};

StateMachine.prototype.setProperty = function(property, value){
    this.properties[property] = value;
};

//Check functions

StateMachine.check_functions = {
    property_is_true : function(thisArg, property, val){
        return thisArg.properties[property];
    },
    property_is_equal_to : function(thisArg, property, val){
        return thisArg.properties[property] == val;
    },
    property_is_not_equal_to : function(thisArg, property, val){
        return !thisArg.properties[property] == val;
    },
    property_greater_than : function(thisArg, property, val){
        return thisArg.properties[property] > val;
    }
};