import { GET_ALL_ROLES } from "../types";

const rolesReducer = (state, action) => {
  switch (action.type) {
    case GET_ALL_ROLES:
      return {
        ...state,
        roles: action.payload,
      };
    default:
      return state;
  }
};
export default rolesReducer;
