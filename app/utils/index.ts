import { Types } from "mongoose";

export const isValidMongooseObjectId = (_id: string) => {
  let castedIdentifier;
  if (Types.ObjectId.isValid(_id))
    castedIdentifier = new Types.ObjectId(_id).toString();
  return castedIdentifier === _id;
};
