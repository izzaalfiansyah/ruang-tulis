import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  endAt,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  startAt,
  where,
  type DocumentData,
} from "firebase/firestore";
import { v4 } from "uuid";
import { Document } from "~/entities/document.type";
import { User } from "~/entities/user.type";

export class DocumentRepository {
  static async get(props?: {
    tag?: string;
    search?: string;
  }): Promise<Document[]> {
    let filter: QueryConstraint[] = [];

    if (props?.tag) {
      filter = [...filter, where("tags", "array-contains", props.tag)];
    }

    if (props?.search) {
      filter = [
        ...filter,
        startAt(props.search),
        endAt(props.search + "\uf8ff"),
      ];
    }

    const result = await getDocs(
      query(collection(db, "documents"), orderBy("date", "desc"), ...filter)
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
