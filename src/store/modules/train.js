const train = {
  state: {
    trainTimeInVuex: ''
  },
  mutations: {
    SET_TRAIN_TIME: (state, data) => {
      state.trainTimeInVuex = data
    }
  }
}
export default train
