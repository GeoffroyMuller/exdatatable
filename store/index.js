export const strict = false
export const state = () => ({
  counter: 0,
  customers: []
})

export const mutations = {
  setCustomers(state, listcustomers) {
    state.customers = listcustomers;
  }
}
