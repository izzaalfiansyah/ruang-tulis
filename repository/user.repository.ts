import { updatePassword } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { User } from "~/entities/user.type";

export class UserRepository {
  static async find(id: any): Promise<User> {
    const result = await getDoc(doc(db, "users", id));

    if (!result.exists()) {
      throw new Error("User not found");
    }

    const user = User.fromDocument(result);

    return user;
  }

  static async getByEmail(email: string): Promise<User> {
    const results = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );

    if (results.empty) {
      throw new Error("User not found");
    }

    let user: User | undefined;

    results.forEach((doc) => {
      if (doc.exists()) {
        user = User.fromDocument(doc);
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async save(user: User, password?: string): Promise<boolean> {
    await setDoc(doc(db, "users", user.id), user);

    if (password) {
      await updatePassword(auth.currentUser!, password);
    }

    return true;
  }
}
