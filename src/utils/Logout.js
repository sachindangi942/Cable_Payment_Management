import { auth } from "../components/firebase";

export const logoutUser = async (navigate) => {
  try {
    await auth.signOut();
    navigate('/login');
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
