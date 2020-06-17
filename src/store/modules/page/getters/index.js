export default {
  isLoading: (state) => {
    return state.isLoading;
  },
  cssVars: (state) => {
    return state.cssVars;
  },
  metadata: (state) => {
    return state.metadata;
  },
  name: (state) => {
    return state.name;
  },
  isCurrent: (state) => (name) => {
    return state.name === name;
  }
};
