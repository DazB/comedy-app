/*
* I'm gonna be honest I haven't a fuckin clue what's goin on here. It was in the Redux Navigation example. So, yeah,
* dunno really what to write here. Lovely weather we're having. How's about them (insert controversial group here).
* The thing about Arsenal is, they always try and walk it in.
*/
import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);
const addListener = createReduxBoundAddListener("root");

export {
  middleware,
  addListener,
};