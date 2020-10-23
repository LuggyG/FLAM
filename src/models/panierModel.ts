import { Collection, ObjectId } from "mongodb";

export type PanierInput = {
  email: string;
  slug: string;
  name: string;
  cover_url: string;
  pv: number;
  platform_slugs: string;
};

export type Panier = PanierInput & {
  _id: ObjectId;
};

export default class PanierModel {
  private collection: Collection;
  constructor(collection: Collection) {
    this.collection = collection;
  }

  findAll(): Promise<Panier[]> {
    return this.collection.find({}).toArray();
  }

  findByMail(mail: string): Promise<Panier | null> {
    return this.collection.findOne({
      email: mail,
    });
  }
  async insertOne(payload: PanierInput): Promise<Panier> {
    const dbResponse = await this.collection.insertOne(payload);
    const { ops } = dbResponse;
    return ops[0];
  }
  async updateOne(mail: string, payload: Panier): Promise<Panier> {
    const dbResponse = await this.collection.replaceOne({ email: mail }, payload);
    const { ops } = dbResponse;
    return ops[0];
  }
  async remove(id: ObjectId): Promise<void> {
    await this.collection.deleteOne({ _id: id });
  }
}
