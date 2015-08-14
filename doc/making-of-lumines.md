# Making of Lumines

Lumines is not a typical React application and when I was making it I ran into some interesting 
issues. 

## The Flux

Flux is what drives this application. It's an application architecture or maybe just a pattern,
introduced (or popularized) by Facebook. If you are not familiar with Flux, you should check 
the [website](https://facebook.github.io/flux/docs/overview.html#content).

The nice thing about Flux is that you can get a pretty good idea of how it works just by looking 
at a single picture (and I'm going to borrow that picture from their website).

![Flux Cycle](https://facebook.github.io/flux/img/flux-simple-f8-diagram-explained-1300w.png)

An **action** represents some kind of event that occurs in the application. **Store** is what is 
holding the current application state (like squares on the grid, the falling block, elapsed time etc.) 
and a **view** is just a view, it's what you see on the screen. **Dispatcher** is what ties this 
all together, distributing actions to the stores.

To give you an idea how Flux works in Lumines, here is an example:

1. The player hits the **arrow left** button.
2. Action `ROTATE_LEFT` is created and dispatched using **dispatcher** to all stores.
3. The **Block store** will respond to this action and update itself. It will rotate the falling 
block to the left.
4. The whole game UI (React components) is rerendered.

Compared to the original idea of Flux, there are several simplifications in Lumines. For example,
there are no action creators as the actions are really simple. Also the stores don't emit any 
*change* events to notify the view. The view is updated every time an action is dispatched.

The main feature of Flux is that the data flow is unidirectional making the whole application 
easier to reason about. Lumines is actually very simple so it wouldn't make sense doing it any 
other way, but there are other Flux features that will turn out extremely useful.

## The actions

Most of the *actions* used in Lumines are very simple and are directly bound to key strokes. 
The purpose of these actions is to control to game. The `ROTATE_LEFT` action was a typical 
example but obviously there are more: `ROTATE_RIGHT`, `MOVE_LEFT`, `MOVE_RIGHT`, `PAUSE`, 
`RESTART` etc.

### Main game loop

One special action is the `UPDATE` action. This action creates the *illusion* of time in the game. 
It's dispatched approximately 60 times per second and carries the time elapsed since the last 
dispatch of this action. This action basically shifts the time pointer in the game so it's 
crucial for the game mechanics.

One of the elements it directly affects is the **scan line** (the line going from the left to the
right, sweeping the grid) which is represented in the **ScanLineSore**. The line is defined by 
it's current `x` position and by its speed. When the `UPDATE` action is dispatched, the store 
responds and increases the `x` position by speed times elapsed time.

To make the game as smooth as possible, the individual dispatches (and UI re-renders) are 
synchronized with the browser repaints. That can be achieved using the 
[requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
function. So the main game loop looks as follows:

```
const clock = new Clock();
const update = (time) => {
    let elapsed = clock.next(time) / 1000;
    this.dispatch(UPDATE, {time: elapsed});
    this.render();
    requestAnimationFrame(update);
};
requestAnimationFrame(update);
```

### Making the game deterministic

There is another special action: `REFILL_QUEUE`. As the game runs, new and new blocks are taken 
from the queue on the left and naturally the queue has to be refilled. The new blocks 
are generated (if needed) in the main game loop and added to the queue using the `REFILL_QUEUE` 
action. The actual block definition (what colors the 4 squares are) is sent as payload with the 
action.

That sounds like something that is part of the game business logic and should happen automatically.
So why is there a special action for that?

The problem is that there is a random element involved. The new blocks are generated randomly. By
taking the block generation out of the core, we make the game 100% deterministic. Therefore at 
any point during the game, **the actual state depends completely on the previous actions**. So if you
want to record the game and then replay it, it's very easy. All you have to do is to hook to the 
dispatcher and remember all dispatched actions (with timestamps). After that you can simply start a 
new game and then dispatch all the recorded actions in correct order with appropriate timing.

An actual implementation of this can be found [here](https://github.com/tobice/flux-lumines-demos/blob/master/recording/recording.js).
