module.exports = function(RED) {
    function switchbotAuthorization(n) {
        RED.nodes.createNode(this, n);
        this.token = n.token;
    }
    RED.nodes.registerType("switchbot-authorization", switchbotAuthorization);
}