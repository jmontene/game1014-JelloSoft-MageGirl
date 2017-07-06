//Interface for Pluggable Actor Behaviours

function ActorBehaviour(actor, machine, args){
    this.actor = actor;
    this.stateMachine = machine;
    this.args = args;
};

ActorBehaviour.prototype.run = function(){

};