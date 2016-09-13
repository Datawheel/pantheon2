/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import * as types from 'types';

polyfill();

/*
 * Utility function to make AJAX requests using isomorphic fetch.
 * You can also use jquery's $.ajax({}) if you do not want to use the
 * /fetch API.
 * Note: this function relies on an external variable `API_ENDPOINT`
 *        and isn't a pure function
 * @param Object Data you wish to pass to the server
 * @param String HTTP method, e.g. post, get, put, delete
 * @param String endpoint
 * @return Promise
 */
export function makePersonRequest(method, id, data, api = '/person') {
  const requestedURL = api + (id ? ('?id=eq.' + id) : '');
  console.log(id, requestedURL)
  const x = request[method](requestedURL, data);
  return x;
}

export function increment(id) {
  return { type: types.INCREMENT_COUNT, id };
}

export function decrement(id) {
  return { type: types.DECREMENT_COUNT, id };
}

export function destroy(id) {
  return { type: types.DESTROY_TOPIC, id };
}


export function typing(text) {
  return {
    type: types.TYPING,
    newTopic: text
  };
}

/*
 * @param data
 * @return a simple JS object
 */
export function createTopicRequest(data) {
  return {
    type: types.CREATE_TOPIC_REQUEST,
    id: data.id,
    count: data.count,
    text: data.text
  };
}

export function createTopicSuccess() {
  return {
    type: types.CREATE_TOPIC_SUCCESS
  };
}

export function createTopicFailure(data) {
  return {
    type: types.CREATE_TOPIC_FAILURE,
    id: data.id,
    error: data.error
  };
}

export function createTopicDuplicate() {
  return {
    type: types.CREATE_TOPIC_DUPLICATE
  };
}

// This action creator returns a function,
// which will get executed by Redux-Thunk middleware
// This function does not need to be pure, and thus allowed
// to have side effects, including executing asynchronous API calls.
export function createTopic(text) {
  return (dispatch, getState) => {
    // If the text box is empty
    if (text.trim().length <= 0) return;

    const id = md5.hash(text);
    // Redux thunk's middleware receives the store methods `dispatch`
    // and `getState` as parameters
    const { topic } = getState();
    const data = {
      count: 1,
      id,
      text
    };

    // Conditional dispatch
    // If the topic already exists, make sure we emit a dispatch event
    if (topic.topics.filter(topicItem => topicItem.id === id).length > 0) {
      // Currently there is no reducer that changes state for this
      // For production you would ideally have a message reducer that
      // notifies the user of a duplicate topic
      return dispatch(createTopicDuplicate());
    }

    // First dispatch an optimistic update
    dispatch(createTopicRequest(data));

    return makeTopicRequest('post', id, data)
      .then(res => {
        if (res.status === 200) {
          // We can actually dispatch a CREATE_TOPIC_SUCCESS
          // on success, but I've opted to leave that out
          // since we already did an optimistic update
          // We could return res.json();
          return dispatch(createTopicSuccess());
        }
      })
      .catch(() => {
        return dispatch(createTopicFailure({ id, error: 'Oops! Something went wrong and we couldn\'t create your topic'}));
      });
  };
}

// Fetch posts logic
export function fetchTopics() {
  return {
    type: types.GET_TOPICS,
    promise: makePersonRequest('get')
  };
}

// export function fetchPerson(store) {
//   return {
//     type: types.GET_PERSON,
//     promise: makePersonRequest('get', store["id"])
//   };
// }

export function fetchClosestRanks(occupationId, rank) {
  const rankSub = rank.parseInt() - 2;
  const rankPlus = rank.parseInt() + 2;

  const apiUrl = `/person_occupation?occupation_id=eq.${occupationId}&rank=gt.${rankSub}&rank=lt.${rankPlus}`
  console.log('API', apiUrl)

  return {
    type: "GET_CLOSEST_RANKS",
    promise: makePersonRequest('get', null, null, apiUrl)
  };

}

export function fetchRank(store) {
  // return {
  //   type: "GET_RANK",
  //   promise: makePersonRequest('get', null, null, `/person_occupation?person_id=eq.${store.id}`)
  // };
  return (dispatch, getState) => {

    // dispatch({
    //   type: "GET_RANK",
    //   promise: makePersonRequest('get', null, null, `/person_occupation?person_id=eq.${store.id}`)
    // })

      return makePersonRequest('get', null, null, `/person_occupation_rank?person=eq.${store.id}`)
        .then(res => {
          // console.log(res.data)
          if (res.status === 200) {
            // console.log('data!!!', res.data)
            // const { rank } = getState();
            // console.log("rank!!!", rank)
            const thisRank = res.data[0]

            console.log("got here!")
            // return fetchClosestRanks(thisRank.occupation_id, thisRank.rank);

            const rankSub = parseInt(thisRank.rank_unique) - 2;
            const rankPlus = parseInt(thisRank.rank_unique) + 2;
            //
            const apiUrl = `/person_occupation_rank?occupation=eq.${thisRank.occupation}&rank_unique=gte.${rankSub}&rank_unique=lte.${rankPlus}&select=occupation{*},person{*},langs,rank`

            console.log('thisRank', thisRank)
            console.log('API', apiUrl)

            // makePersonRequest('get', null, null, apiUrl)
            //   .then(res2 => {
            //
            //     console.log('second request!!!', res2)
            //
            //   })

            return dispatch({
              type: "GET_CLOSEST_RANKS",
              promise: makePersonRequest('get', null, null, apiUrl)
            });


          }
      })
    }
}

// export function abc(data) {
//   console.log(data)
//   return {
//     type: "GET_RANK",
//     id: data.id,
//     count: 1,
//     text: "abc 1"
//   };
// }

// export function fetchRank(store) {
//   return (dispatch, getState) => {
//     return makePersonRequest('get', store["id"])
//       .then(res => {
//         if (res.status === 200) {
//           console.log('GOT HERE!!!!')
//           return dispatch(abc({"person_id":}));
//           return;
//           // We can actually dispatch a CREATE_TOPIC_SUCCESS
//           // on success, but I've opted to leave that out
//           // since we already did an optimistic update
//           // We could return res.json();
//           // return dispatch(createTopicSuccess());
//         }
//       })
//       .catch(() => {
//         return dispatch(createTopicFailure({ id, error: 'Oops! Something went wrong and we couldn\'t create your topic'}));
//       });
//   };
//
// }
