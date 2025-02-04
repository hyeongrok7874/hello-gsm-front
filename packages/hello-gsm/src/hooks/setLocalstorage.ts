/**
 *
 * @param key localstorage key값
 * @param value localstorage에 저장할 배열값
 */
const setLocalstorage = (key: string, value: object) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export default setLocalstorage;
