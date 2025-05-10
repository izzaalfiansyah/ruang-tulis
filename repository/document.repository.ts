import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import { Document } from "~/entities/document.type";
import type { Failure } from "~/entities/failure.type";
import { User } from "~/entities/user.type";

export class DocumentRepository {
  static async get(): Promise<Document[] | Failure> {
    try {
      const result = await getDocs(
        query(collection(db, "documents"), orderBy("date", "desc"))
      );

      if (result.empty) {
        throw "Dokumen belum tersedia";
      }

      let documents: Document[] = [];

      for (const doc of result.docs) {
        documents = [...documents, Document.fromDocument(doc)];
      }

      return documents;
    } catch (e: any) {
      return {
        code: 500,
        message: e,
      };
    }
  }

  static async find(id: any): Promise<Document | Failure> {
    try {
      const result = await getDoc(doc(db, "documents", id));

      if (!result.exists()) {
        throw "Dokumen tidak ditemukan";
      }

      let document = Document.fromDocument(result);

      const author = await getDoc(
        result.data().author as DocumentReference<DocumentData>
      );
      console.log(author);

      if (!author.exists()) {
        throw "Author tidak ditemukan";
      }

      document.author = User.fromDocument(author);

      return document;
    } catch (e: any) {
      return {
        code: 400,
        message: e,
      };
    }
  }
}
