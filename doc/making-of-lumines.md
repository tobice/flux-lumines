# Making of Lumines

Lumines is not a typical React application and when I was making it I ran into some interesting 
issues. 

TODO: make a scheme of terms

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

1. The player hits the button **A**.
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

```javascript
const clock = new Clock();
const update = (time) => {
    let elapsed = clock.next(time) / 1000;
    this.dispatch(UPDATE, {time: elapsed});
    this.render();
    requestAnimationFrame(update);
};
requestAnimationFrame(update);
```

If you ever created a WebGL/OpenGL application, this should look very familiar to you.

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
want to record the game and then replay it, it's very easy. All you have to do is to register to 
the dispatcher and remember all dispatched actions (with timestamps). After that you can simply start a 
new game and then dispatch all the recorded actions in correct order with appropriate timing (or 
not, you could dispatch all the actions at double speed. What matters is the time information 
carried with the `UPDATE` actions).

This obviously wouldn't work if the block generation was left in the game core. You could of 
course record all the actions and remember what the player *did* (his moves) but it wouldn't make
any sense as the game situation (squares on the grid) would be completely different.

An actual implementation of this can be found [here](https://github.com/tobice/flux-lumines-demos/blob/master/recording/recording.js).

## The stores

TODO: make a scheme of stores

The game consists of several separated logical components and each one of them is represented by 
a single store. A typical example is the `ScanLineStore` that represents the scan line. All 
stores are registered to the **dispatcher** (including this one) and listen to all incoming 
actions. Regarding stores, there are several neat features stemming from the Flux pattern:

1. All stores can be updated only through actions.
2. All actions come through a single entry in the store.
3. A new action cannot be dispatched before the previous is finished. That also means that all 
stores are updated at once in a single run, always leaving the application in a consistent state.
3. The data inside a store are accessible from the outside only through a read-only public API.

The result is that it is really easy to reason about what is happening in the store. To give you 
an idea, this is how the `ScanLineStore` looks from the inside:

```javascript
class ScanLineStore extends BaseStore {
    constructor() {
        // Init default values
    }

    handleAction({action, payload}) {
        switch (action) {
            case RESTART:
                // Reset the position 
                break;

            case UPDATE:
                // Move the line
                break;
        }
    }

    get position() {
        // Return the position
    }
}
```

*Notice some of the ES6 syntax sugar at work, like destructing or getters.*

### Using `waitFor()`

Sometimes it is necessary to enforce the order in which the stores are updated. For example, we 
want to first move the scan line and only when that's done we want to update the square grid. 
This can be achieved using a not very common method of the dispatcher 
[`waitFor()`](https://github.com/facebook/flux/blob/master/src/Dispatcher.js).
(I'm talking about the Facebook's implementation of Flux).

When you're about to perform an update inside a store, but you need to make sure that another 
store is updated first, you simply call this method with the desired store as the method argument.

The name of this method might suggest that there is some kind of *asynchronicity* involved (like 
waiting for another thread to finish) but that's not true (besides, JavaScript is single-threaded). 
The dispatcher simply checks whether the store you want to wait for is already updated (using current
action) and if not, it updates it first. 
 
This way you have a complete control over what is going on in the application and everything is 
nicely separated. It's perfect... except it's not.

### Circular dependencies

Flux is an easy to understand concept but once you try to actually use it, you might soon get 
into troubles. One of the complications that might arise are circular dependencies between 
stores. Consider following example: 

* The `GameStateStore` is holding the information about the current state of the game (like 
**PAUSED**, **PLAYING**, **OVER** etc).
* The `SquareStore` contains the information about the squares and their positions and colors on 
the grid.

The `SquareStore` responds to the `UPDATE` action but only when the state is **PLAYING** (the 
action is ignored when the game is paused or over), so it depends on the `GameStateStore`. On the
other hand, if during an update the game comes to an end (which happens in the `SquareStore`; the
squares on the grid reach the upper row), the `GameStateStore` has to detect that and flip the 
status which means it depends on the `SquareStore`. To make it more clear, here is exactly what 
might happen in the game:

1. An `UPDATE` action is dispatched. 
2. `SquareStore` responds to this action first and checks the `GameStateStore` if the game is on.
Let's say it is. 
3. The `SquareStore` updates all squares on the grid and it turns out that  
some of the squares reach the upper row which means game over.
4. `GameStateStore` responds to the action second, checks the `SquareStore` and as the game is 
over, it changes the state to **OVER**.

There is a circular dependency. Both stores need to access each other. Why is it a problem? Well, 
the stores are usually implemented as JavaScript modules which are then `required` whenever needed.
The modules of which the application consists form a dependency tree which obviously doesn't allow 
any circular dependency. What now?

The main objection could be that this is a matter of bad design. Since the game over actually 
happens in the `SquareStore`, information about it should be held in the `SquareStore` as well. 
So those two stores should be merged into one. Unfortunately, there are other stores that are by 
this problem affected as well and they would have to be also merged into one. As a result, 95% of
the application logic would be handled by a single store.

That is actually not a problem, there are many ways how to organize and separate code and it 
could all happen within this one store. It would be probably the cleanest solution. But I really 
liked my stores so I decided to follow this path.

The important thing to realize is that there are actually two types of circular dependencies 
that might occur.

1. The first one is related to the order in which the stores respond to an action
(*action dependency graph*). The order is enforced 
by the `waitFor()` method and if a store A waits on a store B, clearly the store B can't wait on 
the store A at the same time. But our situation is not this case. In our situation, the order is 
quite simple: the `SquareStore` goes first and `GameStateStore` goes afterwards. What might 
happen is that for one action A waits for B, and for another B waits for A. But that's okay. Even
the Facebook devs [say](https://github.com/facebook/flux/issues/144#issuecomment-72797512) it's 
okay to have different dependency graphs for different actions.
2. The second one is on the *module* level, ie. which stores need to access each other. That is 
our case, because `SquareStore` needs to check `GameStateStore` and at the same time, 
`GameStateStore` needs to access `SquareStore`. Remember that the stores can be changed only 
through actions and that their content is accessible only through public read-only API. Therefore
by *access* I mean *read*. We can talk about *read dependency graphs*.
 
To deal with everything mentioned above, I simply decided to implement stores as individual 
instances, put them all into one *pool* and shared that *pool* among the stores. Therefore the 
stores can arbitrarily read from each other. 

That might sound dirty but don't forget:

1. The stores can only read from each other, they can't change each other.
2. The stores can change only through actions and the order in which they respond to actions is 
strictly given.

You have to also realize that it's similar to when you work with a set of variables in the same 
scope. Sometimes there is no hierarchy.

Last remark on this topic: This problem of circular dependencies does exist, there is even an 
[issue](https://github.com/facebook/flux/issues/28) for that. The conclusion might be that Flux 
simply doesn't fit all situations. 

