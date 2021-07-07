export interface Attribute {
  name: string;
  value: string;
}

export enum State {
  None = 0,
  NodeStart = 1,
  NodeTypeStart = 2,
  AttrStart = 3,
  TextStart = 4
}

