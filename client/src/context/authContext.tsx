import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

const AuthProvider = ({ children = null }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.user) {
      sessionStorage.setItem("user", JSON.stringify(state.user));
      sessionStorage.setItem("token", state.token);
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch, user: state.user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
