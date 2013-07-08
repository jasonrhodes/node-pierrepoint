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
    msg = "ERROR: " + msg;
    options = options || {};
    options.color = 'red';
    this.log(msg, options);
};

Pierrepoint.prototype.success = function (msg, options) {
    msg = "[✓] " + msg;
    options = options || {};
    options.color = 'green';
    this.log(msg, options);
}

Pierrepoint.prototype.run = function (i) {
    var order;
    var pp = this;
    i = i || 0;
    order = this.orders[i];
    if (!order) return;
    if (order.message) {
        this.log(order.message, { color: order.color });
        this.run(++i);
    } else if (order.command) {
        //console.log(colors.purple + "Attempting to execute " + order.command + colors.none);
        exec(order.command, function (error, stdout, stderr) {
            //console.log(colors.purple + "Completed (?) " + order.command + colors.none);
            var condition = typeof order.condition === "function" ? order.condition(error, stdout, stderr) : error === null;
            if (condition) {
                pp.success(order.description);
            } else {
                pp.error(order.description + " (failed)");
                console.error('Error Object:', error, 'STDOUT:', stdout, 'STDERR:', stderr);
                if (!order.continueOnFail) { return false; }
            }
            pp.run(++i);
        });
    }
};

module.exports = Pierrepoint;