---
title: "Storing a function in React state"
date: "2023-06-07T14:11:00.000Z"
description: 'and why I felt so dumb'
---

I felt very React-dumb today. I simply wanted to store a function in the state of a React component. So, I would initialize the component state:

```ts
const [myCallback, setMyCallback] = useState<() => void>()
```

and later in the code I would have a button that sets this state:

```ts
const cb = () => console.log('hi!')
setMyCallback(cb)
```

I've been breaking my head on why the hell my callback function gets called even though I never call it anywhere in my code! Notice that we didn't execute `cb()` or `myCallback()` anywhere.

The problem is that the argument of the `setState` functions can be a function that let's us update the state based on the previous value. See the [docs of `setState`](https://react.dev/reference/react/Component#setstate) for details. React cannot tell if the function we pass is the aforementioned function, or the value that we want to store in our state. A solution to this is to simply wrap the value we want to store into a function:

```jsx
setMyCallback(() => cb)
```

So funny yet so frustrating at the same time! Hope I save someone's time!
