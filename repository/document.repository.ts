import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { v4 } from "uuid";
import { Document } from "~/entities/document.type";
import { User } from "~/entities/user.type";

export class DocumentRepository {
  static async get(): Promise<Document[]> {
    const result = await getDocs(
      query(collection(db, "documents"), orderBy("date", "desc"))
    );

    if (result.empty) {
      throw new Error("Dokumen belum tersedia");
    }

    let documents: Document[] = [];

    for (const doc of result.docs) {
      documents = [...documents, Document.fromDocument(doc)];
    }

    return documents;
  }

  static async find(id: any): Promise<Document> {
    const result = await getDoc(doc(db, "documents", id));

    if (!result.exists()) {
      throw new Error("Dokumen tidak ditemukan");
    }

    let document = Document.fromDocument(result);

    const author = await getDoc(
      result.data().author as DocumentReference<DocumentData>
    );

    if (!author.exists()) {
      throw new Error("Author tidak ditemukan");
    }

    document.author = User.fromDocument(author);

    return document;
  }

  static async save(document: Document): Promise<any> {
    const isCreate = !document.id;

    if (isCreate) {
      document.id = v4();
    }

    const author = doc(db, "users", document.author!.id);
    await setDoc(doc(db, "documents", document.id), { ...document, author });

    return document.id;
  }

  static async destroy(document: Document): Promise<boolean> {
    await deleteDoc(doc(db, "documents", document.id));

    return true;
  }
}
