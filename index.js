var exec = require('child_process').exec;

var colors = {
    black: "\033[030m",
    red: "\033[31m",
    green: '\033[32m',
    yellow: '\033[33m',
    blue: '\033[34m',
    purple: '\033[35m',
    cyan: '\033[36m',
    white: '\033[37m',
    none: '\033[0m'
};

var Pierrepoint = function (orders) {
    this.orders = orders;
};

Pierrepoint.prototype.log = function (msg, options) {
    if (options && options.color) {
        msg = colors[options.color] + msg + colors.none;
    }
    console.log(msg);
};

Pierrepoint.prototype.error = function (msg, options) {
    console.error(msg);
};

Pierrepoint.prototype.run = function (i) {
    var order;
    var pp = this;
    i = i || 0;
    order = this.orders[i];
    if (!order) return;
    if (order.message) {
        this.log(order.message, { color: 'blue' });
        this.run(++i);
    } else if (order.command) {
        //console.log(colors.purple + "Attempting to execute " + order.command + colors.none);
        exec(order.command, function (error, stdout, stderr) {
            //console.log(colors.purple + "Completed (?) " + order.command + colors.none);
            var condition = typeof order.condition === "function" ? order.condition(error, stdout, stderr) : error === null;
            if (condition) {
                pp.log(order.description + " : " + '[✓]', { color: 'green' });
            } else {
                pp.error(order.description + " : " + "FAILED", { color: 'red' });
                console.error('Error:', error);
                console.error('Stdout:', stdout);
                console.error('Stderr:', stderr);
                if (!order.continueOnFail) { return false; }
            }
            pp.run(++i);
        });
    }
};

module.exports = Pierrepoint;