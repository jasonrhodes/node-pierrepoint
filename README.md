Pierrepoint
===========

Pierrepoint executes so you don't have to.

## What is this?

Pierrepoint executes an automated list of CLI commands, in order, saving you from manually managing synchronous exec calls one by one. It uses the core, async exec method with callbacks and manages default conditions and output messages.

## How do you say the name?

It rhymes with "beer joint".

## Why did you call it that?

My first choice, Texas, was [already taken](https://npmjs.org/package/texas), and [Albert Pierrepoint](http://en.wikipedia.org/wiki/Albert_Pierrepoint) **executed** at least 400 criminals as a long-serving hangman in England in the mid 20th century.

## How do I use it?

```javascript
var Pierrepoint = require('pierrepoint');

var albert = new Pierrepoint([
    {
        message: "MyCommand is starting...",
        color: "blue"
    }, {
        description: "Create temp folder",
        command: "mkdir ../tmp",
        continueOnFail: true
    }, {
        description: "Move files to a temporary folder",
        command: "mv ./files/* ../tmp"
    }, {
        description: "Verify existence of a file",
        command: 'ls ./images | grep .gitkeep',
        condition: function (error, stdout, stderr) {
            return !!stdout && error === null;
        }
    }
]);

albert.run();
```

Each object in the orders array that you pass to the Pierrepoint constructor can contain the following properties:

* **message**: If the order contains a message, no command or condition will be attempted. The message will be output (using the color if provided), and the next order will be evaluated immediately.
* **color**: Optional color to use for a message (black, red, green, yellow, blue, purple, cyan, and white)
* **description**: Describe the command for clarity. It's also used to print default feedback messages.
* **command**: The CLI command to run
* **condition**: Optional function to run, receives `error, stdout, stderr` from the exec callback and should return true or false, whether to proceed or not. By default, Pierrepoint checks if `error === null` as the condition.
* **continueOnFail**: False by default, set to true if you want to continue even if the condition fails. (Success/fail messaging will still print out appropriately.)

Green and red feedback messages are output to the CLI for each order.