import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const getStoredAuth = () => {
  const storedUser = sessionStorage.getItem("user");
  const storedToken = sessionStorage.getItem("token");
  
  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
  };
};

const initialState = {
  ...getStoredAuth(),
  loading: true,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "LOGIN":
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      sessionStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "LOGOUT":
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      return {
        ...initialState,
        user: null,
        token: null,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children = null }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initAuth = () => {
      const { user, token } = getStoredAuth();
      if (user && token) {
        dispatch({ 
          type: "LOGIN", 
          payload: { user, token } 
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, user: state.user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
