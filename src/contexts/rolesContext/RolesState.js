import { useEffect, useReducer } from "react";
import RolesContext from "./rolesContext";
import rolesReducer from "./rolesReducer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { GET_ALL_ROLES } from "../types";

const INITIAL_STATE = {
  roles: [],
};

const RolesState = ({ children }) => {
  const [state, dispatch] = useReducer(rolesReducer, INITIAL_STATE);

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "roles"));
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    dispatch({ type: GET_ALL_ROLES, payload: list });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <RolesContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};

export default RolesState;
