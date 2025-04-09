import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQVGyvVYeJPRVRmYSrCpx98WkOKw-wqDQ",
  authDomain: "coursegpt-2bbab.firebaseapp.com",
  projectId: "coursegpt-2bbab",
  storageBucket: "coursegpt-2bbab.firebasestorage.app",
  messagingSenderId: "272181880215",
  appId: "1:272181880215:web:a4b100ba485adf1ce410d2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
