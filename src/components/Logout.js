import { auth } from './firebase'; // Firebase Auth import करें

const logout = async () => {
  
  try {
    await auth.signOut(); 
    navigate('/login');
  } catch (error) {
    console.error("Error during logout: ", error);
  }
};
 