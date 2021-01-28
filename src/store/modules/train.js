const train = {
  state: {
    trainTimeInVuex: [],
    paperTimeInVuex: ''
  },
  mutations: {
    SET_TRAIN_TIME: (state, data) => {
      state.trainTimeInVuex = data
    },
    SET_PAPER_TIME: (state, data) => {
      state.paperTimeInVuex = data
    }
  }
}
export default train
