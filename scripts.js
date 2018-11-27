//LIMERIC INFO
const songList = {
  1: "Don't want to be a fool for you(huh uh), Just another player in your game for two(thas right), You may hate me but it ain't no lie(nuh uh), Baby bye bye bye, Bye bye!, I Don't want to make it tough(not how I do), I just want to tell you that I've had enough(it aint 'chu), It might sound crazy but it ain't no lie(hard truth), Baby bye bye bye... (BYE BYE!)".split(', '),
  2: "These are not my people no, These are not my people, And it looks like the end my friend, Gotta get in the wind my friend, Well you find yourself naked in the world with no place to hide, And you felt for the pulse of your god and he had died, Now you're rebels that have got no cause, Lord you're tigers that have got no claws, Well they promised you the world on a string, but you know they lied, Oh you said you'd be back in a black Cadillac limousine, But you know I'm inclined to think it's not, the kind you mean, Cause when you fall down from off your cloud, And you're just another face in the crowd, They're gonna throw you away like last week's magazine".split(', ')
};


// INITIAL REDUX STATE
const initialState = {
  currentSongId: null,
  songsById: {
    1: {
      title: 'Bye Bye Bye (Bye Bye Bye!)',
      artist: 'N\'Sync',
      songId: 1,
      songArray: songList[1],
      arrayPosition: 0,
    },
    2: {
      title: 'These Are Not My People',
      artist: 'SWAMP DOGG',
      songId: 2,
      songArray: songList[2],
      arrayPosition: 0,
    }
  }
}

// REDUX REDUCER

const limericChangeReducer = (state = initialState.songsById, action) => {
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;
  switch (action.type) {
    case 'NEXT_LIMERIC':
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {arrayPosition: newArrayPosition});
      newSongsByIdStateSlice = Object.assign({}, state, {[action.currentSongId]: newSongsByIdEntry});
      return newSongsByIdStateSlice;
    case 'RESTART_SONG':
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {arrayPosition: 0});
      newSongsByIdStateSlice = Object.assign({}, state, {[action.currentSongId]: newSongsByIdEntry});
      return newSongsByIdStateSlice;
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type) {
    case 'CHANGE_SONG':
      return action.newSelectedSongId
    default:
      return state;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentSongId: songChangeReducer,
  songsById: limericChangeReducer
})

// REDUX STORE
const { createStore } = Redux;
const store = createStore(rootReducer);

// TIME-SAVERS
const gs = store.getState;

// JEST TESTS & SETUP
const { expect } = window;

expect(limericChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);

expect(limericChangeReducer(initialState.songsById, { type: 'NEXT_LIMERIC', currentSongId: 2 })).toEqual({
  1: {
    title: 'Bye Bye Bye (Bye Bye Bye!)',
    artist: 'N\'Sync',
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: 'These Are Not My People',
    artist: 'SWAMP DOGG',
    songId: 2,
    songArray: songList[2],
    arrayPosition: 1,
  }
});

expect(limericChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
  1: {
    title: 'Bye Bye Bye (Bye Bye Bye!)',
    artist: 'N\'Sync',
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: 'These Are Not My People',
    artist: 'SWAMP DOGG',
    songId: 2,
    songArray: songList[2],
    arrayPosition: 0,
  }
});

expect(songChangeReducer(initialState, {type: null})).toEqual(initialState);

expect(songChangeReducer(initialState.currentSongId, {type: 'CHANGE_SONG', newSelectedSongId: 1})).toEqual(1);

expect(rootReducer(initialState, { type: null })).toEqual(initialState);

expect(gs().currentSongId).toEqual(songChangeReducer(undefined, { type: null}));
expect(gs().songsById).toEqual(limericChangeReducer(undefined, { type: null}));


// RENDERING STATE IN DOM

const renderLimerics = () => {
  const limericsDisplay = document.getElementById('limerics');
  while (limericsDisplay.firstChild) {
    limericsDisplay.removeChild(limericsDisplay.firstChild);
  }

  if (store.getState().currentSongId) {
    const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
    document.getElementById('limerics').appendChild(currentLine);
  } else {
    const selectSongMessage = document.createTextNode("Why do ye nae sing along wi' us? Ye must first select a wee song, lass!");
    document.getElementById('limerics').appendChild(selectSongMessage);
  }
}

const renderSongs = () => {
  console.log('renderSongs method successfully fired!');
  console.log(store.getState());
  const songsById = store.getState().songsById;
  for (const songKey in songsById) {
    const song = songsById[songKey];
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const songTitle = document.createTextNode(song.title);
    const songArtist = document.createTextNode(' by ' + song.artist);
    em.appendChild(songTitle);
    h3.appendChild(em);
    h3.appendChild(songArtist);
    h3.addEventListener('click', function() {
      selectSong(song.songId);
    });
    li.appendChild(h3);
    document.getElementById('songs').appendChild(li);
  }
}

window.onload = function() {
  renderSongs();
  renderLimerics();
}

// CLICK LISTENER
const userClick = () => {
  if (gs().songsById[gs().currentSongId].arrayPosition === gs().songsById[gs().currentSongId].songArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG', currentSongId: gs().currentSongId });
  } else {
    store.dispatch({ type: 'NEXT_LIMERIC', currentSongId: gs().currentSongId})
  }
}

const selectSong = (newSongId) => {
  let action;
  if (gs().currentSongId) {
    action = {
      type: 'RESTART_SONG',
      currentSongId: gs().currentSongId
    }
    store.dispatch(action);
  }
  action = {
    type: 'CHANGE_SONG',
    newSelectedSongId: newSongId
  }
  store.dispatch(action);
}

// SUBSCRIBE TO REDUX STORE
store.subscribe(renderLimerics);
