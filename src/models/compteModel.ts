import { Collection, ObjectId } from "mongodb";

export type CompteInput = {
  email: string;
  adress: {
    code: number; //0 adresse du client autre :  adresse de livraison
    firstname: string;
    lastname: string;
    numero: string;
    rue: string;
    rue_complement?: string;
    code_postal: string;
    ville: string;
    pays: string;
  }[];
};

export type Compte = CompteInput & {
  _id: ObjectId;
};

export default class CompteModel {
  private collection: Collection;
  constructor(collection: Collection) {
    this.collection = collection;
  }
  findByMail(mail: string): Promise<Compte | null> {
    return this.collection.findOne({
      email: mail,
    });
  }
  async insertOne(payload: CompteInput): Promise<Compte> {
    const dbResponse = await this.collection.insertOne(payload);
    const { ops } = dbResponse;
    return ops[0];
  }
  async updateOne(mail: string, payload: Compte): Promise<Compte> {
    const dbResponse = await this.collection.replaceOne({ email: mail }, payload);
    const { ops } = dbResponse;
    return ops[0];
  }
}
