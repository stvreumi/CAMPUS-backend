// schema definition about map

// Query

const Tag = `type Tag {
  id: ID!
  locationName: String
  accessibility: Float
  category: Category
  coordinates: Coordinate
  tagDetail: TagDetail
  status: Status
  statusHistory: [Status]!
}`;

const Category = `type Category {
  missionName: String!
  subTypeName: String
  targetName: String
}`;

const TagDetail = `type TagDetail {
  tagID: ID!
  createTime: String
  lastUpdateTime: String
  createUser: User
  description: String
  imageUrl: [String]
  streetViewInfo: StreetView
}`;

const Status = `type Status {
  statusName: String!
  createTime: String!
  createUser: User
}`;

const User = `type User {
  id: ID!
  name: String
  email: String
}`;

const Coordinate = `type Coordinate {
  latitude: String!
  longitude: String!
}`;

const StreetView = `type StreetView {
  povHeading: Float!
  povPitch: Float!
  panoID: String!
  latitude: Float!
  longitude: Float!
}`;

const Mission = `type Mission {
  id: ID!
  name: String
  discoveries: [Discovery]
}`;

const Discovery = `type Discovery {
  id: ID!
  mission: Mission
  name: String
}`;

// mutation

const AddNewTagResponse = `type AddNewTagResponse {
  tag: Tag!
  imageNumber: Int!
  imageUploadUrl: [String]!
}`;

const TagUpdateInput = `input TagUpdateInput {
  "set null if we want to create new data"
  id: ID
  "true if modifing existing tag; false if creaing new tag"
  modify: Boolean!
  locationName: String
  accessibility: Float
  coordinates: CoordinateInput
  description: String
}`;

const AddNewTagDataInput = `input AddNewTagDataInput {
  locationName: String!
  accessibility: Float
  category: CategoryInput!
  coordinates: CoordinateInput!
  description: String
  imageNumber: Int
  streetViewInfo: StreetViewInput
}`;

const CoordinateInput = `input CoordinateInput {
  latitude: String
  longitude: String
}`;

const CategoryInput = `input CategoryInput {
  "設施任務/問題任務/動態任務"
  missionName: String!
  "**類型"
  subTypeName: String
  "具體**"
  targetName: String
}`;

const StreetViewInput = `input StreetViewInput {
  povHeading: Float!
  povPitch: Float!
  panoID: String!
  latitude: Float!
  longitude: Float!
}`;

module.exports = {
  Tag,
  Category,
  TagDetail,
  Status,
  User,
  Coordinate,
  StreetView,
  Mission,
  Discovery,
  AddNewTagResponse,
  TagUpdateInput,
  AddNewTagDataInput,
  CoordinateInput,
  CategoryInput,
  StreetViewInput,
};